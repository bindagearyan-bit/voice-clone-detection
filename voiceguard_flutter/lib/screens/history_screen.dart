import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';

class HistoryScreen extends StatelessWidget {
  const HistoryScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();
    final history = provider.history;

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Call History & Logs',
          style: TextStyle(fontWeight: FontWeight.w800, color: Color(0xFF0F172A), fontSize: 18),
        ),
        leading: Navigator.canPop(context)
            ? IconButton(
                icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: Color(0xFF0F172A)),
                onPressed: () => Navigator.pop(context),
              )
            : null,
      ),
      body: history.isEmpty
          ? Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Icon(Icons.history_edu, size: 64, color: Color(0xFFCBD5E1)),
                  const SizedBox(height: 12),
                  const Text(
                    'No call sessions recorded yet',
                    style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF64748B), fontSize: 15),
                  ),
                  const SizedBox(height: 4),
                  const Text(
                    'Make a protected call or run a benchmark test.',
                    style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12),
                  ),
                ],
              ),
            )
          : ListView.separated(
              padding: const EdgeInsets.all(20),
              itemCount: history.length,
              separatorBuilder: (_, __) => const SizedBox(height: 12),
              itemBuilder: (context, index) {
                final session = history[index];
                final isHigh = session.finalRiskLevel == 'HIGH';

                return Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Row(
                            children: [
                              CircleAvatar(
                                radius: 18,
                                backgroundColor: isHigh ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7),
                                child: Icon(
                                  isHigh ? Icons.warning_rounded : Icons.shield_rounded,
                                  color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
                                  size: 20,
                                ),
                              ),
                              const SizedBox(width: 12),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(
                                    session.callerTag,
                                    style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 14, color: Color(0xFF0F172A)),
                                  ),
                                  Text(
                                    session.phoneNumber,
                                    style: const TextStyle(fontSize: 11, color: Color(0xFF64748B), fontFamily: 'monospace'),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: isHigh ? const Color(0xFFFEE2E2) : const Color(0xFFDCFCE7),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: Text(
                              '${session.averageRiskScore}% Risk',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                fontFamily: 'monospace',
                                color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: const Color(0xFFF1F5F9),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              session.classification,
                              style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600, color: Color(0xFF334155)),
                            ),
                            Text(
                              '${session.durationSec}s • ${session.chunksAnalyzed} Chunks',
                              style: const TextStyle(fontSize: 10.5, color: Color(0xFF64748B), fontFamily: 'monospace'),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                );
              },
            ),
    );
  }
}
