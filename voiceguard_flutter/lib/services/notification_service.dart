import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:permission_handler/permission_handler.dart';

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin _notificationsPlugin = FlutterLocalNotificationsPlugin();
  bool _isInitialized = false;

  Future<void> initialize() async {
    if (_isInitialized) return;

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
    );

    await _notificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse response) {
        // Handle notification click or action button press
      },
    );

    _isInitialized = true;
  }

  Future<bool> requestPermissions() async {
    final status = await Permission.notification.request();
    return status.isGranted;
  }

  // Live In-Call Status Bar Overlay
  Future<void> showInCallOverlay({
    required String callerName,
    required String phoneNumber,
    required int riskScore,
    required String riskLevel,
    required String reason,
  }) async {
    final isHigh = riskLevel == 'HIGH' || riskScore >= 80;

    final AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'voiceguard_call_channel',
      'VoiceGuard Call Protection',
      channelDescription: 'Real-time in-call deepfake detection overlay',
      importance: Importance.max,
      priority: Priority.high,
      ongoing: true, // Sticky notification
      autoCancel: false,
      color: isHigh ? const Color(0xFFDC2626) : const Color(0xFF16A34A),
      styleInformation: BigTextStyleInformation(
        isHigh 
          ? '⚠️ HIGH SPOOF RISK: $riskScore% • Synthetic AI Voice Detected!\n$reason'
          : '🟢 SAFE CALL: $riskScore% Spoof Risk • Natural Human Voice Verified\n$reason',
        contentTitle: '🛡️ VoiceGuard Shield • $callerName ($phoneNumber)',
      ),
      actions: <AndroidNotificationAction>[
        const AndroidNotificationAction(
          'end_call',
          '🔴 End Call',
          showsUserInterface: true,
        ),
        if (isHigh)
          const AndroidNotificationAction(
            'block_scam',
            '⛔ Block Number',
            showsUserInterface: true,
          ),
      ],
    );

    final NotificationDetails platformDetails = NotificationDetails(android: androidDetails);

    await _notificationsPlugin.show(
      8888, // Constant ID for in-call sticky notification
      '🛡️ VoiceGuard Call Protection',
      isHigh ? '⚠️ AI Clone Detected ($riskScore%)' : '🟢 Call Verified Clean ($riskScore%)',
      platformDetails,
    );
  }

  Future<void> cancelInCallOverlay() async {
    await _notificationsPlugin.cancel(8888);
  }

  // Instant High Risk Heads-up Warning
  Future<void> showHighRiskAlert({
    required String callerName,
    required int riskScore,
    required String warningText,
  }) async {
    const AndroidNotificationDetails androidDetails = AndroidNotificationDetails(
      'voiceguard_threat_channel',
      'VoiceGuard Threat Alerts',
      channelDescription: 'Emergency warnings for detected voice spoofing',
      importance: Importance.max,
      priority: Priority.max,
      enableVibration: true,
      playSound: true,
    );

    const NotificationDetails platformDetails = NotificationDetails(android: androidDetails);

    await _notificationsPlugin.show(
      DateTime.now().millisecondsSinceEpoch ~/ 1000,
      '🚨 VOICEGUARD ALERT: AI CLONE DETECTED ($riskScore%)',
      'Potential deepfake impersonation from $callerName. Do NOT share OTPs or transfer funds!',
      platformDetails,
    );
  }
}
