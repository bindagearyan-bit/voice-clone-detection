import 'call_chunk.dart';

class CallSession {
  final String callId;
  final String phoneNumber;
  final String callerTag;
  final int averageRiskScore;
  final int maxRiskScore;
  final String finalRiskLevel;
  final String classification;
  final String statusLabel;
  final int durationSec;
  final int chunksAnalyzed;
  final double confidence;
  final String modelUsed;
  final String timestamp;
  final bool isBlocked;
  final List<CallChunk> chunks;

  CallSession({
    required this.callId,
    required this.phoneNumber,
    required this.callerTag,
    required this.averageRiskScore,
    required this.maxRiskScore,
    required this.finalRiskLevel,
    required this.classification,
    required this.statusLabel,
    required this.durationSec,
    required this.chunksAnalyzed,
    required this.confidence,
    required this.modelUsed,
    required this.timestamp,
    required this.isBlocked,
    required this.chunks,
  });

  factory CallSession.fromJson(Map<String, dynamic> json) {
    var rawChunks = json['chunks'] as List? ?? [];
    List<CallChunk> chunkList = rawChunks.asMap().entries.map((e) => CallChunk.fromJson(e.value, e.key + 1)).toList();

    return CallSession(
      callId: json['call_id'] ?? json['id'] ?? 'call_${DateTime.now().millisecondsSinceEpoch}',
      phoneNumber: json['phone_number'] ?? json['phoneNumber'] ?? 'Unknown',
      callerTag: json['caller_tag'] ?? json['callerTag'] ?? 'Caller',
      averageRiskScore: json['risk_score'] ?? json['averageRiskScore'] ?? 10,
      maxRiskScore: json['max_risk_score'] ?? json['maxRiskScore'] ?? 10,
      finalRiskLevel: json['risk_level'] ?? json['finalRiskLevel'] ?? 'LOW',
      classification: json['classification'] ?? 'Voice Appears Natural',
      statusLabel: json['statusLabel'] ?? (json['risk_level'] == 'HIGH' ? 'HIGH SPOOF RISK' : 'LOW SPOOF RISK'),
      durationSec: json['duration_sec'] ?? json['durationSec'] ?? 10,
      chunksAnalyzed: json['chunksAnalyzed'] ?? (chunkList.isNotEmpty ? chunkList.length : 5),
      confidence: (json['confidence'] ?? 0.95).toDouble(),
      modelUsed: json['modelUsed'] ?? 'VoiceGuard-v1.2 (Neural Core)',
      timestamp: json['timestamp'] ?? 'Just now',
      isBlocked: json['is_blocked'] ?? json['isBlocked'] ?? false,
      chunks: chunkList,
    );
  }

  Map<String, dynamic> toJson() => {
    'call_id': callId,
    'phone_number': phoneNumber,
    'caller_tag': callerTag,
    'risk_score': averageRiskScore,
    'max_risk_score': maxRiskScore,
    'risk_level': finalRiskLevel,
    'classification': classification,
    'duration_sec': durationSec,
    'confidence': confidence,
    'is_blocked': isBlocked,
    'timestamp': timestamp,
  };
}
