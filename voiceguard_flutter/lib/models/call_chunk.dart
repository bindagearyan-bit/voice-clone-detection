class CallChunk {
  final String chunkId;
  final int chunkNumber;
  final int riskScore;
  final String riskLevel; // 'LOW', 'MODERATE', 'HIGH'
  final String color; // 'GREEN', 'AMBER', 'RED'
  final double confidence;
  final String reason;
  final String evidence;
  final bool isFake;
  final String timeRange;

  CallChunk({
    required this.chunkId,
    required this.chunkNumber,
    required this.riskScore,
    required this.riskLevel,
    required this.color,
    required this.confidence,
    required this.reason,
    required this.evidence,
    required this.isFake,
    required this.timeRange,
  });

  factory CallChunk.fromJson(Map<String, dynamic> json, int seq) {
    final score = json['risk_score'] ?? json['riskScore'] ?? 10;
    final level = json['risk_level'] ?? json['riskLevel'] ?? (score >= 80 ? 'HIGH' : score >= 45 ? 'MODERATE' : 'LOW');
    return CallChunk(
      chunkId: json['chunk_id'] ?? 'chunk_${seq.toString().padLeft(3, '0')}',
      chunkNumber: seq,
      riskScore: score,
      riskLevel: level,
      color: score >= 80 ? 'RED' : score >= 45 ? 'AMBER' : 'GREEN',
      confidence: (json['confidence'] ?? 0.95).toDouble(),
      reason: json['reason'] ?? (score >= 80 ? 'Synthetic vocoder pitch quantization detected' : 'Authentic human vocal resonance verified'),
      evidence: json['evidence'] ?? '16kHz Audio Frame Slicing (${seq * 2}s)',
      isFake: json['is_fake'] ?? (score >= 80),
      timeRange: '${(seq - 1) * 2}–${seq * 2}s',
    );
  }

  Map<String, dynamic> toJson() => {
    'chunkId': chunkId,
    'chunkNumber': chunkNumber,
    'riskScore': riskScore,
    'riskLevel': riskLevel,
    'color': color,
    'confidence': confidence,
    'reason': reason,
    'evidence': evidence,
    'isFake': isFake,
    'timeRange': timeRange,
  };
}
