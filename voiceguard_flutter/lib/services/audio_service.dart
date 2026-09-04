import 'dart:async';
import 'dart:io';
import 'package:audioplayers/audioplayers.dart';
import 'package:record/record.dart';
import 'package:path_provider/path_provider.dart';

class AudioService {
  static final AudioService _instance = AudioService._internal();
  factory AudioService() => _instance;
  AudioService._internal();

  final AudioPlayer _audioPlayer = AudioPlayer();
  final AudioRecorder _audioRecorder = AudioRecorder();

  bool _isPlaying = false;
  bool get isPlaying => _isPlaying;

  // Stream controller for real-time live mic amplitude/waveform
  final _amplitudeController = StreamController<double>.broadcast();
  Stream<double> get amplitudeStream => _amplitudeController.stream;

  Timer? _amplitudeTimer;

  // Play audio sample from assets (0ms latency, zero network dependency)
  Future<void> playAssetSample(String assetPath) async {
    await _audioPlayer.stop();
    await _audioPlayer.play(AssetSource(assetPath.replaceFirst('assets/', '')));
    _isPlaying = true;

    _audioPlayer.onPlayerComplete.listen((_) {
      _isPlaying = false;
    });
  }

  // Play audio file from path
  Future<void> playLocalFile(String filePath) async {
    await _audioPlayer.stop();
    await _audioPlayer.play(DeviceFileSource(filePath));
    _isPlaying = true;

    _audioPlayer.onPlayerComplete.listen((_) {
      _isPlaying = false;
    });
  }

  Future<void> stopPlayback() async {
    await _audioPlayer.stop();
    _isPlaying = false;
  }

  // Start continuous 2-second microphone chunk slicing
  Future<void> startLiveMicSlicing(Function(File chunkFile) onChunkReady) async {
    if (await _audioRecorder.hasPermission()) {
      final dir = await getTemporaryDirectory();
      int chunkCount = 0;

      _amplitudeTimer = Timer.periodic(const Duration(milliseconds: 100), (timer) async {
        final amp = await _audioRecorder.getAmplitude();
        final normalized = (amp.current + 50.0).clamp(0.0, 50.0) / 50.0;
        _amplitudeController.add(normalized);
      });

      // Continuous 2-second slicing loop
      Timer.periodic(const Duration(seconds: 2), (timer) async {
        if (!await _audioRecorder.isRecording()) return;
        chunkCount++;
        final path = '${dir.path}/chunk_$chunkCount.m4a';
        final recordedPath = await _audioRecorder.stop();
        if (recordedPath != null) {
          onChunkReady(File(recordedPath));
        }
        await _audioRecorder.start(
          const RecordConfig(encoder: AudioEncoder.aacLc, sampleRate: 16000, bitRate: 32000),
          path: path,
        );
      });

      final initialPath = '${dir.path}/chunk_0.m4a';
      await _audioRecorder.start(
        const RecordConfig(encoder: AudioEncoder.aacLc, sampleRate: 16000, bitRate: 32000),
        path: initialPath,
      );
    }
  }

  Future<void> stopLiveMic() async {
    _amplitudeTimer?.cancel();
    if (await _audioRecorder.isRecording()) {
      await _audioRecorder.stop();
    }
  }
}
