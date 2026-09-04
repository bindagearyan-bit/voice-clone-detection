import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';
import 'protected_call_screen.dart';

class DialerScreen extends StatefulWidget {
  const DialerScreen({super.key});

  @override
  State<DialerScreen> createState() => _DialerScreenState();
}

class _DialerScreenState extends State<DialerScreen> {
  String _dialedNumber = '';

  void _onKeyPress(String digit) {
    if (_dialedNumber.length < 15) {
      setState(() {
        _dialedNumber += digit;
      });
    }
  }

  void _onBackspace() {
    if (_dialedNumber.isNotEmpty) {
      setState(() {
        _dialedNumber = _dialedNumber.substring(0, _dialedNumber.length - 1);
      });
    }
  }

  void _initiateCall(BuildContext context, String number, {String? label}) {
    if (number.isEmpty) return;
    final provider = context.read<VoiceGuardProvider>();
    provider.startProtectedCall(phoneNumber: number, callerLabel: label);
    Navigator.push(context, MaterialPageRoute(builder: (_) => const ProtectedCallScreen()));
  }

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();

    return Scaffold(
      backgroundColor: const Color(0xFFF8FAFC),
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: const Text(
          'Protected Phone Dialer',
          style: TextStyle(
            fontWeight: FontWeight.w800,
            color: Color(0xFF0F172A),
            fontSize: 18,
          ),
        ),
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 18, color: Color(0xFF0F172A)),
          onPressed: () => Navigator.pop(context),
        ),
      ),
      body: Column(
        children: [
          // Number Display Area
          Expanded(
            flex: 2,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 24.0),
              alignment: Alignment.center,
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Text(
                    _dialedNumber.isEmpty ? 'Enter phone number' : _dialedNumber,
                    style: TextStyle(
                      fontSize: _dialedNumber.length > 10 ? 26 : 32,
                      fontWeight: FontWeight.w900,
                      color: _dialedNumber.isEmpty ? const Color(0xFF94A3B8) : const Color(0xFF0F172A),
                      fontFamily: 'monospace',
                      letterSpacing: 1.0,
                    ),
                  ),
                  if (_dialedNumber == '199' || _dialedNumber == '198')
                    Container(
                      margin: const EdgeInsets.only(top: 8),
                      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEE2E2),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Text(
                        '🤖 Automated IVR Robocall System (High Spoof Test)',
                        style: TextStyle(color: Color(0xFFDC2626), fontSize: 11, fontWeight: FontWeight.w700),
                      ),
                    ),
                ],
              ),
            ),
          ),

          // Quick Friends Bar
          Container(
            height: 48,
            padding: const EdgeInsets.symmetric(horizontal: 16),
            child: ListView.separated(
              scrollDirection: Axis.horizontal,
              itemCount: provider.contacts.length,
              separatorBuilder: (_, __) => const SizedBox(width: 8),
              itemBuilder: (context, index) {
                final c = provider.contacts[index];
                return ActionChip(
                  avatar: CircleAvatar(
                    backgroundColor: const Color(0xFF2563EB),
                    child: Text(c.name[0], style: const TextStyle(color: Colors.white, fontSize: 11)),
                  ),
                  label: Text(c.name, style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 12)),
                  backgroundColor: Colors.white,
                  side: const BorderSide(color: Color(0xFFE2E8F0)),
                  onPressed: () => _initiateCall(context, c.phoneNumber, label: c.name),
                );
              },
            ),
          ),
          const SizedBox(height: 12),

          // Keypad Grid
          Expanded(
            flex: 5,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 36.0),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                children: [
                  _buildKeyRow(['1', '2', '3'], ['', 'ABC', 'DEF']),
                  _buildKeyRow(['4', '5', '6'], ['GHI', 'JKL', 'MNO']),
                  _buildKeyRow(['7', '8', '9'], ['PQRS', 'TUV', 'WXYZ']),
                  _buildKeyRow(['*', '0', '#'], ['', '+', '']),
                ],
              ),
            ),
          ),

          // Call & Backspace Action Bar
          Padding(
            padding: const EdgeInsets.only(bottom: 28.0, top: 10.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceEvenly,
              children: [
                const SizedBox(width: 56), // spacer
                // Green Call Button
                InkWell(
                  onTap: () {
                    final target = _dialedNumber.isEmpty ? '+91 9226793292' : _dialedNumber;
                    _initiateCall(context, target);
                  },
                  borderRadius: BorderRadius.circular(36),
                  child: Container(
                    width: 68,
                    height: 68,
                    decoration: BoxDecoration(
                      color: const Color(0xFF16A34A),
                      shape: BoxShape.circle,
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF16A34A).withValues(alpha: 0.35),
                          blurRadius: 16,
                          offset: const Offset(0, 6),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.phone, color: Colors.white, size: 30),
                  ),
                ),
                // Backspace button
                IconButton(
                  icon: const Icon(Icons.backspace_outlined, color: Color(0xFF64748B), size: 26),
                  onPressed: _onBackspace,
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildKeyRow(List<String> digits, List<String> subtitles) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: List.generate(3, (i) {
        return InkWell(
          onTap: () => _onKeyPress(digits[i]),
          borderRadius: BorderRadius.circular(40),
          child: Container(
            width: 66,
            height: 66,
            decoration: BoxDecoration(
              color: Colors.white,
              shape: BoxShape.circle,
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  digits[i],
                  style: const TextStyle(
                    fontSize: 22,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF0F172A),
                  ),
                ),
                if (subtitles[i].isNotEmpty)
                  Text(
                    subtitles[i],
                    style: const TextStyle(
                      fontSize: 9,
                      fontWeight: FontWeight.w700,
                      color: Color(0xFF94A3B8),
                    ),
                  ),
              ],
            ),
          ),
        );
      }),
    );
  }
}
