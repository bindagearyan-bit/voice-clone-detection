import 'dart:math';
import 'package:flutter/material.dart';

class LiveWaveform extends StatefulWidget {
  final bool isActive;
  final Color activeColor;

  const LiveWaveform({
    super.key,
    this.isActive = true,
    this.activeColor = const Color(0xFF2563EB),
  });

  @override
  State<LiveWaveform> createState() => _LiveWaveformState();
}

class _LiveWaveformState extends State<LiveWaveform> with SingleTickerProviderStateMixin {
  late AnimationController _controller;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    )..repeat();
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Row(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: List.generate(24, (index) {
            double height = 6.0;
            if (widget.isActive) {
              final wave = sin((_controller.value * 2 * pi) + (index * 0.35));
              height = 8.0 + (wave.abs() * 32.0);
            }
            return Container(
              margin: const EdgeInsets.symmetric(horizontal: 2.0),
              width: 3.5,
              height: height,
              decoration: BoxDecoration(
                color: widget.activeColor.withValues(alpha: 0.75 + (index % 4) * 0.05),
                borderRadius: BorderRadius.circular(4.0),
              ),
            );
          }),
        );
      },
    );
  }
}
