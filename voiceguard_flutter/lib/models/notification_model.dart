class SecurityNotification {
  final String id;
  final String severity; // 'HIGH', 'MODERATE', 'LOW'
  final String title;
  final String message;
  final String timestamp;
  bool isRead;
  final String? callId;

  SecurityNotification({
    required this.id,
    required this.severity,
    required this.title,
    required this.message,
    required this.timestamp,
    this.isRead = false,
    this.callId,
  });

  factory SecurityNotification.fromJson(Map<String, dynamic> json) => SecurityNotification(
    id: json['id'] ?? 'notif_${DateTime.now().millisecondsSinceEpoch}',
    severity: json['severity'] ?? 'LOW',
    title: json['title'] ?? 'Security Notice',
    message: json['message'] ?? '',
    timestamp: json['timestamp'] ?? 'Just now',
    isRead: json['isRead'] ?? false,
    callId: json['callId'],
  );

  Map<String, dynamic> toJson() => {
    'id': id,
    'severity': severity,
    'title': title,
    'message': message,
    'timestamp': timestamp,
    'isRead': isRead,
    'callId': callId,
  };
}
