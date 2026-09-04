import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';
import '../models/call_session.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 17) return 'Good afternoon';
    if (hour >= 17 && hour < 22) return 'Good evening';
    return 'Good night';
  }

  String _getGreetingIcon() {
    final hour = DateTime.now().hour;
    if (hour >= 5 && hour < 12) return '🌅';
    if (hour >= 12 && hour < 17) return '☀️';
    if (hour >= 17 && hour < 22) return '🌆';
    return '🌙';
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();
    final history = provider.history;
    final threatsCount = history.where((c) => c.finalRiskLevel == 'HIGH' || c.maxRiskScore >= 75).length;
    final totalChunks = history.fold<int>(0, (acc, c) => acc + (c.chunksAnalyzed > 0 ? c.chunksAnalyzed : 4));

    final steps = [
      {'num': '01', 'title': 'Unknown Call', 'desc': 'Call arrives from an unregistered number.'},
      {'num': '02', 'title': 'Audio Captured', 'desc': 'Microphone stream captured upon answer.'},
      {'num': '03', 'title': '2s Audio Chunks', 'desc': 'Slices audio into 16kHz WAV segments.'},
      {'num': '04', 'title': 'AI Analysis', 'desc': 'VoiceGuard Neural Model extracts spectral & pitch dynamics.'},
      {'num': '05', 'title': 'Spoof Risk', 'desc': 'Dynamic score generated in ~800ms.'},
      {'num': '06', 'title': 'User Alert', 'desc': 'Instant warning if synthetic voice detected.'},
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1280),
          child: ListView(
            padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 28),
            children: [
              // Top Greeting & Status Card
              LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 650;
                  final content = [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'AI CYBER DEFENSE HUB',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Color(0xFF2563EB),
                            fontFamily: 'monospace',
                            letterSpacing: 1.0,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Row(
                          children: [
                            Text(
                              '${_getGreeting()}, Aryan ',
                              style: const TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                                color: Color(0xFF0F172A),
                                letterSpacing: -0.5,
                              ),
                            ),
                            Text(
                              _getGreetingIcon(),
                              style: const TextStyle(fontSize: 24),
                            ),
                          ],
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'Your voice is your identity. We protect it.',
                          style: TextStyle(
                            fontSize: 13,
                            color: Color(0xFF64748B),
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    if (!isWide) const SizedBox(height: 12),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      decoration: BoxDecoration(
                        color: Colors.white,
                        borderRadius: BorderRadius.circular(18),
                        border: Border.all(color: const Color(0xFFA7F3D0)),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withValues(alpha: 0.02),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Container(
                            width: 10,
                            height: 10,
                            decoration: const BoxDecoration(
                              color: Color(0xFF10B981),
                              shape: BoxShape.circle,
                            ),
                          ),
                          const SizedBox(width: 10),
                          const Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                '● PROTECTION ACTIVE',
                                style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFF065F46),
                                  fontFamily: 'monospace',
                                ),
                              ),
                              Text(
                                'Real-Time VoiceGuard Shield',
                                style: TextStyle(
                                  fontSize: 10.5,
                                  color: Color(0xFF64748B),
                                ),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ];

                  return isWide
                      ? Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          crossAxisAlignment: CrossAxisAlignment.center,
                          children: content,
                        )
                      : Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: content,
                        );
                },
              ),
              const SizedBox(height: 24),

              // Hero Section
              Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFF0F172A), Color(0xFF1E1B4B), Color(0xFF1E3A8A)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(28),
                  boxShadow: [
                    BoxShadow(
                      color: const Color(0xFF1E3A8A).withValues(alpha: 0.3),
                      blurRadius: 24,
                      offset: const Offset(0, 10),
                    ),
                  ],
                ),
                padding: const EdgeInsets.all(28),
                child: LayoutBuilder(
                  builder: (context, constraints) {
                    final isWide = constraints.maxWidth > 750;
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        Expanded(
                          flex: 7,
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                                decoration: BoxDecoration(
                                  color: Colors.white.withValues(alpha: 0.1),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(color: Colors.white.withValues(alpha: 0.15)),
                                ),
                                child: const Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    Icon(Icons.bolt, color: Color(0xFF38BDF8), size: 14),
                                    SizedBox(width: 6),
                                    Text(
                                      'VoiceGuard-v1.2 16kHz Deep Learning Engine',
                                      style: TextStyle(
                                        color: Color(0xFF38BDF8),
                                        fontSize: 11,
                                        fontWeight: FontWeight.w700,
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              const SizedBox(height: 16),
                              const Text(
                                'AI-Powered Voice Threat Detection',
                                style: TextStyle(
                                  fontSize: 28,
                                  fontWeight: FontWeight.w900,
                                  color: Colors.white,
                                  letterSpacing: -0.5,
                                  height: 1.2,
                                ),
                              ),
                              const SizedBox(height: 10),
                              const Text(
                                'Detect AI-generated and cloned voices in real time during unknown calls. Safeguard against deepfake audio scams, unauthorized OTP extortions, and synthetic speech deception.',
                                style: TextStyle(
                                  fontSize: 13.5,
                                  color: Color(0xFFCBD5E1),
                                  height: 1.5,
                                ),
                              ),
                              const SizedBox(height: 20),
                              Wrap(
                                spacing: 10,
                                runSpacing: 10,
                                children: [
                                  ElevatedButton.icon(
                                    onPressed: () => provider.navigateToTab('/audiolab'),
                                    icon: const Icon(Icons.bolt, size: 16, color: Colors.white),
                                    label: const Text('Upload & Test .WAV Audio', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Colors.white)),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF0891B2),
                                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                      elevation: 0,
                                    ),
                                  ),
                                  ElevatedButton.icon(
                                    onPressed: () => provider.navigateToTab('/dialer'),
                                    icon: const Icon(Icons.phone, size: 16, color: Colors.white),
                                    label: const Text('Open Phone Dialer', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Colors.white)),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF059669),
                                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                      elevation: 0,
                                    ),
                                  ),
                                  ElevatedButton.icon(
                                    onPressed: () => provider.startProtectedCall(phoneNumber: '+91 98234 11092', callerLabel: 'Simulated Robocall Threat'),
                                    icon: const Icon(Icons.play_arrow, size: 16, color: Color(0xFF38BDF8)),
                                    label: const Text('Simulate Call', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Colors.white)),
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF2563EB).withValues(alpha: 0.8),
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(14),
                                        side: BorderSide(color: const Color(0xFF60A5FA).withValues(alpha: 0.3)),
                                      ),
                                      elevation: 0,
                                    ),
                                  ),
                                  OutlinedButton(
                                    onPressed: () => provider.navigateToTab('/calls'),
                                    style: OutlinedButton.styleFrom(
                                      foregroundColor: Colors.white,
                                      side: BorderSide(color: Colors.white.withValues(alpha: 0.2)),
                                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                                    ),
                                    child: const Text('Live Monitor', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13, color: Colors.white)),
                                  ),
                                ],
                              ),
                            ],
                          ),
                        ),
                        if (isWide) ...[
                          const SizedBox(width: 24),
                          Expanded(
                            flex: 5,
                            child: Center(
                              child: Stack(
                                alignment: Alignment.center,
                                clipBehavior: Clip.none,
                                children: [
                                  Container(
                                    padding: const EdgeInsets.all(28),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withValues(alpha: 0.05),
                                      borderRadius: BorderRadius.circular(28),
                                      border: Border.all(color: Colors.white.withValues(alpha: 0.1)),
                                    ),
                                    child: Container(
                                      width: 110,
                                      height: 110,
                                      decoration: BoxDecoration(
                                        gradient: const LinearGradient(
                                          colors: [Color(0xFF2563EB), Color(0xFF4F46E5), Color(0xFF06B6D4)],
                                          begin: Alignment.bottomLeft,
                                          end: Alignment.topRight,
                                        ),
                                        borderRadius: BorderRadius.circular(24),
                                        boxShadow: [
                                          BoxShadow(
                                            color: const Color(0xFF2563EB).withValues(alpha: 0.5),
                                            blurRadius: 30,
                                            offset: const Offset(0, 8),
                                          ),
                                        ],
                                      ),
                                      child: const Icon(Icons.shield, color: Colors.white, size: 54),
                                    ),
                                  ),
                                  // Orbital badges
                                  Positioned(
                                    top: -10,
                                    right: -10,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F172A),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(color: const Color(0xFF22D3EE).withValues(alpha: 0.5)),
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.radio, color: Color(0xFF22D3EE), size: 12),
                                          SizedBox(width: 4),
                                          Text('2s Chunks', style: TextStyle(color: Color(0xFF22D3EE), fontSize: 10, fontWeight: FontWeight.w800, fontFamily: 'monospace')),
                                        ],
                                      ),
                                    ),
                                  ),
                                  Positioned(
                                    bottom: -10,
                                    left: -10,
                                    child: Container(
                                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                                      decoration: BoxDecoration(
                                        color: const Color(0xFF0F172A),
                                        borderRadius: BorderRadius.circular(12),
                                        border: Border.all(color: const Color(0xFF34D399).withValues(alpha: 0.5)),
                                      ),
                                      child: const Row(
                                        mainAxisSize: MainAxisSize.min,
                                        children: [
                                          Icon(Icons.memory, color: Color(0xFF34D399), size: 12),
                                          SizedBox(width: 4),
                                          Text('~800ms Latency', style: TextStyle(color: Color(0xFF34D399), fontSize: 10, fontWeight: FontWeight.w800, fontFamily: 'monospace')),
                                        ],
                                      ),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                        ],
                      ],
                    );
                  },
                ),
              ),
              const SizedBox(height: 24),

              // 4 Dynamic Live Telemetry Statistics Cards
              LayoutBuilder(
                builder: (context, constraints) {
                  final crossAxisCount = constraints.maxWidth > 900
                      ? 4
                      : constraints.maxWidth > 550
                          ? 2
                          : 1;

                  return GridView.count(
                    crossAxisCount: crossAxisCount,
                    crossAxisSpacing: 14,
                    mainAxisSpacing: 14,
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    childAspectRatio: crossAxisCount == 4 ? 1.45 : 1.7,
                    children: [
                      _buildStatCard(
                        title: 'CALLS MONITORED',
                        value: '${history.length}',
                        badge: 'Live Synced',
                        badgeColor: const Color(0xFF059669),
                        subtitle: 'Total cellular & WebRTC calls',
                        icon: Icons.phone_in_talk,
                        iconBg: const Color(0xFFEFF6FF),
                        iconColor: const Color(0xFF2563EB),
                      ),
                      _buildStatCard(
                        title: 'THREATS INTERCEPTED',
                        value: '$threatsCount',
                        badge: 'High Spoof Risk',
                        badgeColor: const Color(0xFFDC2626),
                        subtitle: 'Synthetic AI voices intercepted',
                        icon: Icons.shield_outlined,
                        iconBg: const Color(0xFFFEF2F2),
                        iconColor: const Color(0xFFDC2626),
                        isDanger: true,
                      ),
                      _buildStatCard(
                        title: 'AUDIO CHUNKS SLICED',
                        value: '$totalChunks',
                        badge: '2-second windows',
                        badgeColor: const Color(0xFF64748B),
                        subtitle: '16kHz spectral analysis',
                        icon: Icons.layers_outlined,
                        iconBg: const Color(0xFFEEF2FF),
                        iconColor: const Color(0xFF4F46E5),
                      ),
                      _buildStatCard(
                        title: 'PROTECTION STATUS',
                        value: '100% ACTIVE',
                        badge: 'Online',
                        badgeColor: const Color(0xFF059669),
                        subtitle: 'VoiceGuard Neural Core (~65ms)',
                        icon: Icons.verified_user_outlined,
                        iconBg: const Color(0xFFECFDF5),
                        iconColor: const Color(0xFF059669),
                        isSuccess: true,
                      ),
                    ],
                  );
                },
              ),
              const SizedBox(height: 24),

              // Middle Section: Recent Unknown Call Activity & Threat Distribution
              LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 850;
                  final leftCard = _buildRecentActivityCard(history, provider);
                  final rightCard = _buildRiskDistributionCard();

                  return isWide
                      ? Row(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Expanded(flex: 7, child: leftCard),
                            const SizedBox(width: 18),
                            Expanded(flex: 5, child: rightCard),
                          ],
                        )
                      : Column(
                          children: [
                            leftCard,
                            const SizedBox(height: 18),
                            rightCard,
                          ],
                        );
                },
              ),
              const SizedBox(height: 28),

              // HOW VOICEGUARD PROTECTS YOU - 6-Step Visual Explanation
              Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 10,
                      offset: const Offset(0, 4),
                    ),
                  ],
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Center(
                      child: Column(
                        children: [
                          const Text(
                            'AUTOMATED PROTECTION LIFECYCLE',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: Color(0xFF2563EB),
                              fontFamily: 'monospace',
                              letterSpacing: 1.0,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'How VoiceGuard Protects You',
                            style: TextStyle(
                              fontSize: 20,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF0F172A),
                            ),
                          ),
                          const SizedBox(height: 2),
                          const Text(
                            'From the moment an unknown number rings to real-time deep learning verification',
                            style: TextStyle(fontSize: 12, color: Color(0xFF64748B)),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),
                    LayoutBuilder(
                      builder: (context, constraints) {
                        final crossAxisCount = constraints.maxWidth > 900
                            ? 6
                            : constraints.maxWidth > 600
                                ? 3
                                : 2;

                        return GridView.builder(
                          shrinkWrap: true,
                          physics: const NeverScrollableScrollPhysics(),
                          itemCount: steps.length,
                          gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: crossAxisCount,
                            crossAxisSpacing: 10,
                            mainAxisSpacing: 10,
                            childAspectRatio: crossAxisCount == 6 ? 0.95 : 1.3,
                          ),
                          itemBuilder: (context, index) {
                            final s = steps[index];
                            return Container(
                              padding: const EdgeInsets.all(14),
                              decoration: BoxDecoration(
                                color: const Color(0xFFF8FAFC),
                                borderRadius: BorderRadius.circular(16),
                                border: Border.all(color: const Color(0xFFE2E8F0)),
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Container(
                                    width: 30,
                                    height: 30,
                                    decoration: BoxDecoration(
                                      color: const Color(0xFFDBEAFE),
                                      borderRadius: BorderRadius.circular(10),
                                    ),
                                    alignment: Alignment.center,
                                    child: Text(
                                      s['num']!,
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w900,
                                        color: Color(0xFF1D4ED8),
                                        fontFamily: 'monospace',
                                      ),
                                    ),
                                  ),
                                  const SizedBox(height: 10),
                                  Text(
                                    s['title']!,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w800,
                                      color: Color(0xFF0F172A),
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    s['desc']!,
                                    style: const TextStyle(
                                      fontSize: 10.5,
                                      color: Color(0xFF64748B),
                                      height: 1.35,
                                    ),
                                  ),
                                ],
                              ),
                            );
                          },
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard({
    required String title,
    required String value,
    required String badge,
    required Color badgeColor,
    required String subtitle,
    required IconData icon,
    required Color iconBg,
    required Color iconColor,
    bool isDanger = false,
    bool isSuccess = false,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                title,
                style: const TextStyle(
                  fontSize: 10.5,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF64748B),
                  fontFamily: 'monospace',
                ),
              ),
              Container(
                padding: const EdgeInsets.all(7),
                decoration: BoxDecoration(
                  color: iconBg,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(icon, color: iconColor, size: 16),
              ),
            ],
          ),
          Row(
            crossAxisAlignment: CrossAxisAlignment.baseline,
            textBaseline: TextBaseline.alphabetic,
            children: [
              Text(
                value,
                style: TextStyle(
                  fontSize: isSuccess ? 20 : 28,
                  fontWeight: FontWeight.w900,
                  color: isDanger
                      ? const Color(0xFFDC2626)
                      : isSuccess
                          ? const Color(0xFF059669)
                          : const Color(0xFF0F172A),
                  fontFamily: 'monospace',
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: badgeColor.withValues(alpha: 0.1),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  badge,
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.w800,
                    color: badgeColor,
                    fontFamily: 'monospace',
                  ),
                ),
              ),
            ],
          ),
          Text(
            subtitle,
            style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8)),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentActivityCard(List<CallSession> history, VoiceGuardProvider provider) {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.timeline, color: Color(0xFF2563EB), size: 18),
                  SizedBox(width: 8),
                  Text(
                    'RECENT UNKNOWN CALL ACTIVITY',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFF0F172A),
                      fontFamily: 'monospace',
                    ),
                  ),
                ],
              ),
              InkWell(
                onTap: () => provider.navigateToTab('/history'),
                child: const Row(
                  children: [
                    Text(
                      'View All',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF2563EB),
                      ),
                    ),
                    Icon(Icons.arrow_forward_ios, size: 10, color: Color(0xFF2563EB)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          if (history.isEmpty)
            const Padding(
              padding: EdgeInsets.all(20),
              child: Center(child: Text('No call activity recorded yet.', style: TextStyle(color: Color(0xFF94A3B8)))),
            )
          else
            ...history.take(4).map((call) {
              final isHigh = call.finalRiskLevel == 'HIGH';
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(8),
                          decoration: BoxDecoration(
                            color: isHigh ? const Color(0xFFFEE2E2) : const Color(0xFFD1FAE5),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: Icon(
                            isHigh ? Icons.shield_outlined : Icons.check_circle_outline,
                            color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF059669),
                            size: 16,
                          ),
                        ),
                        const SizedBox(width: 12),
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              call.phoneNumber,
                              style: const TextStyle(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: Color(0xFF0F172A),
                                fontFamily: 'monospace',
                              ),
                            ),
                            Text(
                              '${call.callerTag} • ${call.timestamp}',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF64748B)),
                            ),
                          ],
                        ),
                      ],
                    ),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                          decoration: BoxDecoration(
                            color: isHigh ? const Color(0xFFFEF2F2) : const Color(0xFFECFDF5),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isHigh ? const Color(0xFFFECACA) : const Color(0xFFA7F3D0),
                            ),
                          ),
                          child: Text(
                            '${call.averageRiskScore}% ${isHigh ? 'AI VOICE' : 'NATURAL'}',
                            style: TextStyle(
                              fontSize: 11,
                              fontWeight: FontWeight.w800,
                              color: isHigh ? const Color(0xFFB91C1C) : const Color(0xFF047857),
                              fontFamily: 'monospace',
                            ),
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          '${call.durationSec}s • ${call.chunksAnalyzed} Chunks',
                          style: const TextStyle(fontSize: 10, color: Color(0xFF94A3B8), fontFamily: 'monospace'),
                        ),
                      ],
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }

  Widget _buildRiskDistributionCard() {
    return Container(
      padding: const EdgeInsets.all(22),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: const Color(0xFFE2E8F0)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'THREAT RISK DISTRIBUTION',
            style: TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w800,
              color: Color(0xFF0F172A),
              fontFamily: 'monospace',
            ),
          ),
          const SizedBox(height: 20),
          _buildProgressBar('Natural Voice (Low Spoof Risk)', '72%', 0.72, const Color(0xFF10B981)),
          const SizedBox(height: 16),
          _buildProgressBar('Moderate / Unusual Voice', '18%', 0.18, const Color(0xFFF59E0B)),
          const SizedBox(height: 16),
          _buildProgressBar('AI Voice Suspected (High Risk)', '10%', 0.10, const Color(0xFFEF4444)),
        ],
      ),
    );
  }

  Widget _buildProgressBar(String label, String pct, double progress, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: Color(0xFF334155))),
            Text(pct, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0F172A), fontFamily: 'monospace')),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            backgroundColor: const Color(0xFFF1F5F9),
            valueColor: AlwaysStoppedAnimation<Color>(color),
            minHeight: 8,
          ),
        ),
      ],
    );
  }
}
