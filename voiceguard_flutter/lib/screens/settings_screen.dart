import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _realtimeMonitoring = true;
  bool _unknownCallerProtection = true;
  bool _highRiskAlerts = true;
  bool _audioRetentionZero = true;
  bool _onDeviceProcessing = true;
  String _serverUrl = 'http://127.0.0.1:8000';

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Settings & Security Policy',
          style: TextStyle(fontWeight: FontWeight.w900, color: Color(0xFF0F172A), fontSize: 18),
        ),
      ),
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1000),
          child: ListView(
            padding: const EdgeInsets.all(20),
            children: [
              // Card 1: Real-Time Voice Protection
              _buildSectionCard(
                title: 'Real-Time Voice Protection',
                icon: Icons.shield,
                iconColor: const Color(0xFF2563EB),
                children: [
                  SwitchListTile(
                    title: const Text('Real-Time Call Shield', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: const Text('Analyze voice streams in 2-second increments during calls.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    value: _realtimeMonitoring,
                    activeTrackColor: const Color(0xFF2563EB),
                    onChanged: (v) => setState(() => _realtimeMonitoring = v),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('Unknown Caller Auto-Inspection', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: const Text('Automatically activate neural vocoder analysis on unsaved numbers.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    value: _unknownCallerProtection,
                    activeTrackColor: const Color(0xFF2563EB),
                    onChanged: (v) => setState(() => _unknownCallerProtection = v),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('High-Risk Threat Alerts', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: const Text('Display immediate fullscreen warning when AI clone probability > 80%.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    value: _highRiskAlerts,
                    activeTrackColor: const Color(0xFF2563EB),
                    onChanged: (v) => setState(() => _highRiskAlerts = v),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Card 2: Privacy & Audio Retention
              _buildSectionCard(
                title: 'Privacy & Audio Retention',
                icon: Icons.lock_outline,
                iconColor: const Color(0xFF059669),
                children: [
                  SwitchListTile(
                    title: const Text('Zero-Retention Mode', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: const Text('Discard all raw audio samples immediately after feature vector extraction. No raw recordings stored.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    value: _audioRetentionZero,
                    activeTrackColor: const Color(0xFF059669),
                    onChanged: (v) => setState(() => _audioRetentionZero = v),
                  ),
                  const Divider(height: 1),
                  SwitchListTile(
                    title: const Text('On-Device Preprocessing', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 14)),
                    subtitle: const Text('Perform FFT filtering, spectral flux, and windowing locally before neural inference.', style: TextStyle(fontSize: 12, color: Color(0xFF64748B))),
                    value: _onDeviceProcessing,
                    activeTrackColor: const Color(0xFF059669),
                    onChanged: (v) => setState(() => _onDeviceProcessing = v),
                  ),
                ],
              ),
              const SizedBox(height: 20),

              // Card 3: Backend API Config
              _buildSectionCard(
                title: 'VoiceGuard Engine Connection',
                icon: Icons.hub_outlined,
                iconColor: const Color(0xFF7C3AED),
                children: [
                  Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('FastAPI Detection Server URL', style: TextStyle(fontWeight: FontWeight.w700, fontSize: 13)),
                        const SizedBox(height: 8),
                        TextFormField(
                          initialValue: _serverUrl,
                          decoration: InputDecoration(
                            hintText: 'http://127.0.0.1:8000',
                            filled: true,
                            fillColor: const Color(0xFFF8FAFC),
                            border: OutlineInputBorder(borderRadius: BorderRadius.circular(12), borderSide: const BorderSide(color: Color(0xFFCBD5E1))),
                            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                          ),
                          onChanged: (v) => _serverUrl = v,
                        ),
                        const SizedBox(height: 8),
                        const Text('Default local engine: http://127.0.0.1:8000 (FastAPI 16kHz Model Server)', style: TextStyle(fontSize: 11, color: Color(0xFF94A3B8))),
                      ],
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required IconData icon,
    required Color iconColor,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
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
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: iconColor.withValues(alpha: 0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: iconColor, size: 18),
                ),
                const SizedBox(width: 12),
                Text(
                  title,
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 15, color: Color(0xFF0F172A)),
                ),
              ],
            ),
          ),
          const Divider(height: 1),
          ...children,
        ],
      ),
    );
  }
}
