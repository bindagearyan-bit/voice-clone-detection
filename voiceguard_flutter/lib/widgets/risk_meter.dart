import 'package:flutter/material.dart';

class RiskMeter extends StatelessWidget {
  final int score;
  final double size;

  const RiskMeter({
    super.key,
    required this.score,
    this.size = 140.0,
  });

  Color get scoreColor {
    if (score >= 80) return const Color(0xFFEF4444);
    if (score >= 45) return const Color(0xFFF59E0B);
    return const Color(0xFF10B981);
  }

  String get riskLabel {
    if (score >= 80) return 'HIGH RISK';
    if (score >= 45) return 'MODERATE';
    return 'LOW RISK';
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: size,
      height: size,
      child: Stack(
        alignment: Alignment.center,
        children: [
          // Circular Progress Track
          SizedBox(
            width: size,
            height: size,
            child: CircularProgressIndicator(
              value: (score / 100.0).clamp(0.0, 1.0),
              strokeWidth: 10.0,
              backgroundColor: Colors.slate.shade100,
              valueColor: AlwaysStoppedAnimation<Color>(scoreColor),
              strokeCap: StrokeCap.round,
            ),
          ),
          // Inner text readout
          Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text(
                '$score%',
                style: TextStyle(
                  fontSize: size * 0.26,
                  fontWeight: FontWeight.w900,
                  fontFamily: 'monospace',
                  color: scoreColor,
                ),
              ),
              Text(
                riskLabel,
                style: TextStyle(
                  fontSize: size * 0.085,
                  fontWeight: FontWeight.w700,
                  fontFamily: 'monospace',
                  color: scoreColor,
                  letterSpacing: 0.5,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
