export const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif_001',
    severity: 'HIGH', // HIGH | MODERATE | LOW / INFO
    title: 'High spoof risk detected',
    message: 'AI voice suspected during unknown call from +91 98234 11092. Spoof probability: 89%.',
    timestamp: '12 minutes ago',
    isRead: false,
    callId: 'call_20250118_143052'
  },
  {
    id: 'notif_002',
    severity: 'HIGH',
    title: 'High spoof risk detected',
    message: 'AI voice suspected during unknown call from +91 70112 84920. Synthetic voice clone characteristics detected.',
    timestamp: '3 hours ago',
    isRead: false,
    callId: 'call_20250118_112015'
  },
  {
    id: 'notif_003',
    severity: 'MODERATE',
    title: 'Moderate spoof risk',
    message: 'Unusual synthetic speech characteristics detected from +91 88002 91100. Spoof probability: 65%.',
    timestamp: 'Yesterday',
    isRead: true,
    callId: 'call_20250117_184510'
  },
  {
    id: 'notif_004',
    severity: 'LOW',
    title: 'Call analysis completed',
    message: 'Call analysis for +91 98110 54321 completed (Voice appears natural). Report saved to History.',
    timestamp: 'Yesterday',
    isRead: true,
    callId: 'call_20250117_141022'
  },
  {
    id: 'notif_005',
    severity: 'LOW',
    title: 'Protection active',
    message: 'VoiceGuard-v1.2 real-time 16kHz audio monitoring engine is active on incoming unknown calls.',
    timestamp: '2 days ago',
    isRead: true,
    callId: null
  }
];
