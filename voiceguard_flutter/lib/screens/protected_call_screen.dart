import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';
import '../widgets/risk_meter.dart';
import '../widgets/live_waveform.dart';
import '../widgets/high_risk_modal.dart';

class ProtectedCallScreen extends StatelessWidget {
  const ProtectedCallScreen({super.key});

  String _formatTimer(int totalSeconds) {
    final m = totalSeconds ~/ 60;
    final s = totalSeconds % 60;
    return '${m.toString().padLeft(2, '0')}:${s.toString().padLeft(2, '0')}';
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();

    return WillPopScope(
      onWillPop: () async => false, // Prevent accidental back press during active call
      child: Scaffold(
        backgroundColor: const Color(0xFF0F172A),
        body: Stack(
          children: [
            SafeArea(
              child: Padding(
                padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 16.0),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Top Status Header
                    Column(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: const Color(0xFF334155)),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.shield, color: Color(0xFF38BDF8), size: 14),
                              const SizedBox(width: 6),
                              Text(
                                'VOICEGUARD 16kHz SHIELD ACTIVE',
                                style: TextStyle(
                                  color: Colors.cyan.shade300,
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w800,
                                  fontFamily: 'monospace',
                                ),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 14),
                        Text(
                          provider.activeCallerName,
                          style: const TextStyle(
                            fontSize: 26,
                            fontWeight: FontWeight.w900,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          provider.activeCallerNumber,
                          style: const TextStyle(
                            fontSize: 14,
                            color: Color(0xFF94A3B8),
                            fontFamily: 'monospace',
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _formatTimer(provider.callTimer),
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            color: Color(0xFF38BDF8),
                            fontFamily: 'monospace',
                          ),
                        ),
                      ],
                    ),

                    // Central Risk Meter & Waveform Visualizer
                    Column(
                      children: [
                        RiskMeter(score: provider.liveRiskScore, size: 160),
                        const SizedBox(height: 20),
                        const LiveWaveform(isActive: true),
                        const SizedBox(height: 16),
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: const Color(0xFF1E293B),
                            borderRadius: BorderRadius.circular(16),
                            border: Border.all(color: const Color(0xFF334155)),
                          ),
                          child: Text(
                            provider.liveReason,
                            textAlign: TextAlign.center,
                            style: const TextStyle(
                              fontSize: 12,
                              color: Color(0xFFCBD5E1),
                              height: 1.4,
                            ),
                          ),
                        ),
                      ],
                    ),

                    // Bottom End Call Button
                    Padding(
                      padding: const EdgeInsets.only(bottom: 16.0),
                      child: Column(
                        children: [
                          InkWell(
                            onTap: () {
                              provider.endCall();
                              Navigator.pop(context);
                            },
                            borderRadius: BorderRadius.circular(40),
                            child: Container(
                              width: 72,
                              height: 72,
                              decoration: BoxDecoration(
                                color: const Color(0xFFDC2626),
                                shape: BoxShape.circle,
                                boxShadow: [
                                  BoxShadow(
                                    color: const Color(0xFFDC2626).withOpacity(0.4),
                                    blurRadius: 20,
                                    offset: const Offset(0, 8),
                                  ),
                                ],
                              ),
                              child: const Icon(Icons.call_end, color: Colors.white, size: 34),
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            'End Protected Call',
                            style: TextStyle(
                              color: Color(0xFF94A3B8),
                              fontSize: 12,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // High Risk Modal Overlay
            if (provider.isHighRiskModalOpen)
              HighRiskModal(
                riskScore: provider.liveRiskScore,
                callerName: provider.activeCallerName,
                reason: provider.liveReason,
                onDismiss: () => provider.closeHighRiskModal(),
                onBlock: () {
                  provider.endCall(isBlocked: true);
                  Navigator.pop(context);
                },
              ),
          ],
        ),
      ),
    );
  }
}
