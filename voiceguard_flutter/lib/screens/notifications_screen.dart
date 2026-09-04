import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';
import '../models/notification_model.dart';

class NotificationsScreen extends StatefulWidget {
  const NotificationsScreen({super.key});

  @override
  State<NotificationsScreen> createState() => _NotificationsScreenState();
}

class _NotificationsScreenState extends State<NotificationsScreen> {
  String _filter = 'ALL'; // 'ALL', 'HIGH', 'LOW'

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();
    final allNotifs = provider.notifications;
    final filteredNotifs = allNotifs.where((n) {
      if (_filter == 'ALL') return true;
      if (_filter == 'HIGH') return n.severity == 'HIGH';
      if (_filter == 'LOW') return n.severity == 'LOW';
      return true;
    }).toList();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Security Alerts & Notifications',
          style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A), fontSize: 18),
        ),
        actions: [
          if (allNotifs.isNotEmpty)
            TextButton.icon(
              onPressed: () => provider.markAllNotificationsRead(),
              icon: const Icon(Icons.done_all, size: 16, color: Color(0xFF2563EB)),
              label: const Text('Mark Read', style: TextStyle(color: Color(0xFF2563EB), fontWeight: FontWeight.bold, fontSize: 12)),
            ),
        ],
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Filter chips
              Row(
                children: [
                  _buildFilterChip('ALL', 'All (${allNotifs.length})'),
                  const SizedBox(width: 8),
                  _buildFilterChip('HIGH', 'Threats (${allNotifs.where((n) => n.severity == 'HIGH').length})', isDanger: true),
                  const SizedBox(width: 8),
                  _buildFilterChip('LOW', 'System (${allNotifs.where((n) => n.severity == 'LOW').length})'),
                ],
              ),
              const SizedBox(height: 16),

              if (filteredNotifs.isEmpty)
                Container(
                  padding: const EdgeInsets.all(40),
                  alignment: Alignment.center,
                  child: Column(
                    children: [
                      Icon(Icons.notifications_off_outlined, size: 48, color: Colors.grey[400]),
                      const SizedBox(height: 12),
                      const Text(
                        'No notifications found',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF64748B)),
                      ),
                      const SizedBox(height: 4),
                      const Text('Your call security feed is clear.', style: TextStyle(fontSize: 13, color: Color(0xFF94A3B8))),
                    ],
                  ),
                )
              else
                ...filteredNotifs.map((notif) => _buildNotificationCard(notif, provider)),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilterChip(String key, String label, {bool isDanger = false}) {
    final isSelected = _filter == key;
    return InkWell(
      onTap: () => setState(() => _filter = key),
      borderRadius: BorderRadius.circular(12),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isSelected
              ? (isDanger ? const Color(0xFFDC2626) : const Color(0xFF2563EB))
              : Colors.white,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(
            color: isSelected
                ? (isDanger ? const Color(0xFFDC2626) : const Color(0xFF2563EB))
                : const Color(0xFFE2E8F0),
          ),
        ),
        child: Text(
          label,
          style: TextStyle(
            fontSize: 12,
            fontWeight: FontWeight.w700,
            color: isSelected ? Colors.white : const Color(0xFF64748B),
          ),
        ),
      ),
    );
  }

  Widget _buildNotificationCard(SecurityNotification notif, VoiceGuardProvider provider) {
    final isHigh = notif.severity == 'HIGH';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isHigh ? const Color(0xFFFCA5A5).withValues(alpha: 0.6) : const Color(0xFFE2E8F0),
          width: isHigh ? 1.5 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 8,
            offset: const Offset(0, 3),
          ),
        ],
      ),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: isHigh ? const Color(0xFFFEE2E2) : const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              isHigh ? Icons.shield_outlined : Icons.info_outline,
              color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF2563EB),
              size: 20,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Expanded(
                      child: Text(
                        notif.title,
                        style: const TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF0F172A),
                        ),
                      ),
                    ),
                    Text(
                      notif.timestamp,
                      style: const TextStyle(fontSize: 11, color: Color(0xFF94A3B8), fontFamily: 'monospace'),
                    ),
                  ],
                ),
                const SizedBox(height: 6),
                Text(
                  notif.message,
                  style: const TextStyle(fontSize: 12.5, color: Color(0xFF475569), height: 1.4),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
