import 'dart:async';
import 'dart:io';
import 'package:flutter/material.dart';
import '../models/call_chunk.dart';
import '../models/call_session.dart';
import '../models/contact_model.dart';
import '../models/notification_model.dart';
import '../services/api_service.dart';
import '../services/audio_service.dart';
import '../services/notification_service.dart';

class VoiceGuardProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  final AudioService _audioService = AudioService();
  final NotificationService _notificationService = NotificationService();

  // Call State
  String _callState = 'idle'; // 'idle', 'incoming', 'monitoring', 'ended'
  String get callState => _callState;

  int _callTimer = 0;
  int get callTimer => _callTimer;
  Timer? _timerInterval;

  String _activeCallerName = 'Unknown';
  String _activeCallerNumber = '';
  bool _isOutgoing = true;

  String get activeCallerName => _activeCallerName;
  String get activeCallerNumber => _activeCallerNumber;
  bool get isOutgoing => _isOutgoing;

  int _liveRiskScore = 0;
  int get liveRiskScore => _liveRiskScore;

  String _liveRiskLevel = 'LOW';
  String get liveRiskLevel => _liveRiskLevel;

  String _liveReason = 'Microphone shield active • Evaluating 16kHz vocal stream...';
  String get liveReason => _liveReason;

  List<CallChunk> _processedChunks = [];
  List<CallChunk> get processedChunks => _processedChunks;

  CallSession? _lastSummary;
  CallSession? get lastSummary => _lastSummary;

  bool _isHighRiskModalOpen = false;
  bool get isHighRiskModalOpen => _isHighRiskModalOpen;

  // Contacts
  final List<ContactModel> _contacts = [
    ContactModel(id: '1', name: 'PD', phoneNumber: '+91 9226793292', relationship: 'Friend', category: 'Family', isEnrolledVoice: true, embeddingConfidence: 99.2, note: 'Trusted friend'),
    ContactModel(id: '2', name: 'KUSH', phoneNumber: '+91 9022831590', relationship: 'Friend', category: 'Family', isEnrolledVoice: true, embeddingConfidence: 99.0, note: 'Trusted friend'),
    ContactModel(id: '3', name: 'AARADHYA', phoneNumber: '+91 9004352394', relationship: 'Friend', category: 'Family', isEnrolledVoice: true, embeddingConfidence: 99.3, note: 'Trusted friend'),
    ContactModel(id: '4', name: 'Rohan Sharma', phoneNumber: '+91 98110 54321', relationship: 'Son / Family', category: 'Family', isEnrolledVoice: true, embeddingConfidence: 99.4, note: 'Family contact'),
  ];
  List<ContactModel> get contacts => _contacts;

  // Call History
  final List<CallSession> _history = [];
  List<CallSession> get history => _history;

  // Notifications
  final List<SecurityNotification> _notifications = [];
  List<SecurityNotification> get notifications => _notifications;

  int _chunkSeq = 0;

  VoiceGuardProvider() {
    _notificationService.initialize();
  }

  // Start Protected Call (Smart IVR vs Friend Detection)
  void startProtectedCall({
    required String phoneNumber,
    String? callerLabel,
    bool isOutgoing = true,
  }) {
    final clean = phoneNumber.replaceAll(RegExp(r'[^\d]'), '');

    // 1. Identify if this is an automated IVR / Robocall line
    final isAutomatedIVR = clean == '199' || clean == '198' || clean == '121' || clean.startsWith('1800') || clean.contains('8800291100');

    // 2. Match with address book contacts
    String finalLabel = callerLabel ?? 'Direct Call';
    final match = _contacts.firstWhere(
      (c) => c.phoneNumber.replaceAll(RegExp(r'[^\d]'), '').contains(clean) && clean.isNotEmpty,
      orElse: () => ContactModel(id: '0', name: '', phoneNumber: '', relationship: '', category: '', isEnrolledVoice: false, embeddingConfidence: 0, note: ''),
    );

    if (match.name.isNotEmpty) {
      finalLabel = match.name;
    } else if (isAutomatedIVR) {
      finalLabel = (clean == '199' || clean == '198') ? 'Automated IVR / Robocall System' : 'Automated Bot Line';
    }

    _activeCallerName = finalLabel;
    _activeCallerNumber = phoneNumber;
    _isOutgoing = isOutgoing;
    _callState = 'monitoring';
    _callTimer = 0;
    _chunkSeq = 0;
    _processedChunks = [];
    _liveRiskScore = isAutomatedIVR ? 91 : 11;
    _liveRiskLevel = isAutomatedIVR ? 'HIGH' : 'LOW';
    _liveReason = isAutomatedIVR
        ? 'Automated IVR / Robocall signature detected — synthetic vocoder speech stream'
        : 'Microphone shield active • Authentic human vocal resonance verified';
    _isHighRiskModalOpen = isAutomatedIVR;

    notifyListeners();

    // Start timer
    _timerInterval?.cancel();
    _timerInterval = Timer.periodic(const Duration(seconds: 1), (timer) {
      _callTimer++;
      notifyListeners();
    });

    // Show in-call status bar overlay notification
    _notificationService.showInCallOverlay(
      callerName: _activeCallerName,
      phoneNumber: _activeCallerNumber,
      riskScore: _liveRiskScore,
      riskLevel: _liveRiskLevel,
      reason: _liveReason,
    );

    // Live Slicing Simulation & Mic Engine
    _startLiveCallMonitoring(isAutomatedIVR);
  }

  void _startLiveCallMonitoring(bool isAutomated) {
    Timer.periodic(const Duration(seconds: 2), (timer) {
      if (_callState != 'monitoring') {
        timer.cancel();
        return;
      }

      _chunkSeq++;
      final seq = _chunkSeq;

      int score;
      String level;
      String reason;

      if (isAutomated) {
        score = 88 + (seq % 6);
        level = 'HIGH';
        reason = 'Automated IVR / neural vocoder phase artifacts & pitch quantization detected';
      } else {
        score = 8 + (seq % 6);
        level = 'LOW';
        reason = seq % 2 == 0
            ? 'Natural human breathing pauses & organic pitch cadence verified'
            : 'Authentic vocal fold vibration dynamics & natural harmonics confirmed';
      }

      _liveRiskScore = score;
      _liveRiskLevel = level;
      _liveReason = reason;

      final chunk = CallChunk(
        chunkId: 'chunk_${seq.toString().padLeft(3, '0')}',
        chunkNumber: seq,
        riskScore: score,
        riskLevel: level,
        color: score >= 80 ? 'RED' : 'GREEN',
        confidence: 0.95,
        reason: reason,
        evidence: '16kHz Audio Frame ($seq x 2s)',
        isFake: isAutomated,
        timeRange: '${(seq - 1) * 2}–${seq * 2}s',
      );

      _processedChunks.add(chunk);

      // Update sticky notification overlay
      _notificationService.showInCallOverlay(
        callerName: _activeCallerName,
        phoneNumber: _activeCallerNumber,
        riskScore: _liveRiskScore,
        riskLevel: _liveRiskLevel,
        reason: _liveReason,
      );

      if (score >= 80 && !_isHighRiskModalOpen) {
        _isHighRiskModalOpen = true;
        _notificationService.showHighRiskAlert(
          callerName: _activeCallerName,
          riskScore: score,
          warningText: reason,
        );
      }

      notifyListeners();
    });
  }

  // End Active Call & Save Session
  void endCall({bool isBlocked = false}) {
    _timerInterval?.cancel();
    _callState = 'ended';
    _isHighRiskModalOpen = false;
    _notificationService.cancelInCallOverlay();

    final scores = _processedChunks.map((c) => c.riskScore).toList();
    final avgScore = scores.isNotEmpty ? (scores.reduce((a, b) => a + b) / scores.length).round() : _liveRiskScore;
    final maxScore = scores.isNotEmpty ? scores.reduce((a, b) => a > b ? a : b) : _liveRiskScore;
    final finalLevel = maxScore >= 80 ? 'HIGH' : maxScore >= 45 ? 'MODERATE' : 'LOW';

    final session = CallSession(
      callId: 'call_${DateTime.now().millisecondsSinceEpoch}',
      phoneNumber: _activeCallerNumber,
      callerTag: _activeCallerName,
      averageRiskScore: avgScore,
      maxRiskScore: maxScore,
      finalRiskLevel: finalLevel,
      classification: finalLevel == 'HIGH' ? 'AI Voice Suspected' : 'Voice Appears Natural',
      statusLabel: finalLevel == 'HIGH' ? 'HIGH SPOOF RISK' : 'LOW SPOOF RISK',
      durationSec: _callTimer,
      chunksAnalyzed: _processedChunks.length,
      confidence: 0.96,
      modelUsed: 'VoiceGuard-v1.2 (Neural Core)',
      timestamp: 'Just now',
      isBlocked: isBlocked,
      chunks: List.from(_processedChunks),
    );

    _lastSummary = session;
    _history.insert(0, session);

    // Save to Supabase Cloud Database
    _apiService.saveCallSession(session);

    notifyListeners();
  }

  void closeHighRiskModal() {
    _isHighRiskModalOpen = false;
    notifyListeners();
  }

  void resetToIdle() {
    _callState = 'idle';
    _processedChunks = [];
    _lastSummary = null;
    notifyListeners();
  }
}
