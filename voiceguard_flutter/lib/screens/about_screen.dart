import 'package:flutter/material.dart';

class AboutScreen extends StatelessWidget {
  const AboutScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'About VoiceGuard Architecture',
          style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A), fontSize: 18),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Hero banner
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E1B4B)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFF2563EB).withValues(alpha: 0.3),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF38BDF8).withValues(alpha: 0.4)),
                      ),
                      child: const Text(
                        'VOICEGUARD AI CORE v1.2',
                        style: TextStyle(color: Color(0xFF38BDF8), fontSize: 11, fontWeight: FontWeight.w800, fontFamily: 'monospace'),
                      ),
                    ),
                    const SizedBox(height: 14),
                    const Text(
                      'Defending Against Deepfake Voice Fraud in Real Time',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.w900, color: Colors.white),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'VoiceGuard integrates on-device audio streaming with high-frequency spectral feature analysis to detect artificial vocoder artifacts, missing glottal pulses, and quantized pitch contours in 2-second windows.',
                      style: TextStyle(fontSize: 13, color: Color(0xFFCBD5E1), height: 1.4),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),

              // Architectural Specs
              _buildSpecCard(
                title: 'Technical Specifications',
                specs: [
                  {'label': 'Sampling Rate', 'value': '16,000 Hz (16kHz Mono PCM)'},
                  {'label': 'Window Size', 'value': '2.0 seconds (32,000 frames)'},
                  {'label': 'Feature Vector', 'value': 'MFCC (40 bins) + Spectral Flatness + Pitch Jitter'},
                  {'label': 'Inference Latency', 'value': '~52ms average neural model latency'},
                  {'label': 'Supported Formats', 'value': 'WAV, PCM, MP3, FLAC, Live WebRTC / Cellular'},
                  {'label': 'Zero-Retention Privacy', 'value': '100% On-memory analysis (hashes only)'},
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSpecCard({required String title, required List<Map<String, String>> specs}) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A))),
          const SizedBox(height: 14),
          ...specs.map((s) => Padding(
            padding: const EdgeInsets.only(bottom: 10),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(s['label']!, style: const TextStyle(fontSize: 13, color: Color(0xFF64748B), fontWeight: FontWeight.w600)),
                Text(s['value']!, style: const TextStyle(fontSize: 13, color: Color(0xFF0F172A), fontWeight: FontWeight.w800, fontFamily: 'monospace')),
              ],
            ),
          )),
        ],
      ),
    );
  }
}
