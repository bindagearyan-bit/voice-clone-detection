import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/voiceguard_provider.dart';
import 'home_screen.dart';
import 'audio_lab_screen.dart';
import 'dialer_screen.dart';
import 'protected_call_screen.dart';
import 'notifications_screen.dart';
import 'history_screen.dart';
import 'settings_screen.dart';
import 'about_screen.dart';

class MainShell extends StatefulWidget {
  const MainShell({super.key});

  @override
  State<MainShell> createState() => _MainShellState();
}

class _MainShellState extends State<MainShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();

  final List<Widget> _pages = const [
    HomeScreen(),
    AudioLabScreen(),
    DialerScreen(),
    ProtectedCallScreen(),
    NotificationsScreen(),
    HistoryScreen(),
    SettingsScreen(),
    AboutScreen(),
  ];

  final List<Map<String, dynamic>> _navItems = [
    {'label': 'HOME', 'icon': Icons.home_outlined, 'activeIcon': Icons.home, 'badge': null},
    {'label': 'AUDIO LAB (WAV)', 'icon': Icons.graphic_eq_outlined, 'activeIcon': Icons.graphic_eq, 'badge': 'TESTER', 'badgeColor': Color(0xFF0891B2)},
    {'label': 'DIALER & PHONE', 'icon': Icons.dialpad_outlined, 'activeIcon': Icons.dialpad, 'badge': 'KEYPAD', 'badgeColor': Color(0xFF059669)},
    {'label': 'UNKNOWN CALLS', 'icon': Icons.phone_in_talk_outlined, 'activeIcon': Icons.phone_in_talk, 'badge': null},
    {'label': 'NOTIFICATIONS', 'icon': Icons.notifications_none_outlined, 'activeIcon': Icons.notifications, 'badge': null},
    {'label': 'HISTORY', 'icon': Icons.history_outlined, 'activeIcon': Icons.history, 'badge': null},
    {'label': 'SETTINGS', 'icon': Icons.settings_outlined, 'activeIcon': Icons.settings, 'badge': null},
    {'label': 'ABOUT VOICEGUARD', 'icon': Icons.info_outline, 'activeIcon': Icons.info, 'badge': null},
  ];

  @override
  Widget build(BuildContext context) {
    final provider = context.watch<VoiceGuardProvider>();
    final currentIndex = provider.currentTabIndex;
    final unreadCount = provider.unreadNotificationCount;
    final isCallActive = provider.callState == 'monitoring';

    return LayoutBuilder(
      builder: (context, constraints) {
        final isDesktop = constraints.maxWidth >= 850;

        return Scaffold(
          key: _scaffoldKey,
          backgroundColor: const Color(0xFFF8FAFC),
          drawer: !isDesktop ? Drawer(child: _buildSidebar(provider, currentIndex, unreadCount, isCallActive, isDrawer: true)) : null,
          appBar: !isDesktop
              ? AppBar(
                  backgroundColor: const Color(0xFF0F172A),
                  elevation: 0,
                  leading: IconButton(
                    icon: const Icon(Icons.menu, color: Colors.white),
                    onPressed: () => _scaffoldKey.currentState?.openDrawer(),
                  ),
                  title: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(6),
                        decoration: BoxDecoration(
                          color: const Color(0xFF2563EB),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: const Icon(Icons.shield, color: Colors.white, size: 16),
                      ),
                      const SizedBox(width: 8),
                      const Text(
                        'VoiceGuard AI',
                        style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16),
                      ),
                    ],
                  ),
                  actions: [
                    if (unreadCount > 0)
                      Stack(
                        alignment: Alignment.center,
                        children: [
                          IconButton(
                            icon: const Icon(Icons.notifications_outlined, color: Colors.white),
                            onPressed: () => provider.setTabIndex(4),
                          ),
                          Positioned(
                            top: 10,
                            right: 10,
                            child: Container(
                              padding: const EdgeInsets.all(4),
                              decoration: const BoxDecoration(color: Color(0xFFDC2626), shape: BoxShape.circle),
                              child: Text('$unreadCount', style: const TextStyle(color: Colors.white, fontSize: 9, fontWeight: FontWeight.bold)),
                            ),
                          ),
                        ],
                      ),
                  ],
                )
              : null,
          body: Row(
            children: [
              // Left Dark Navy Sidebar (Visible on Desktop / Tablets)
              if (isDesktop)
                SizedBox(
                  width: 270,
                  child: _buildSidebar(provider, currentIndex, unreadCount, isCallActive, isDrawer: false),
                ),

              // Main Workspace Area
              Expanded(
                child: Column(
                  children: [
                    // Top Header Bar (Desktop only)
                    if (isDesktop) _buildDesktopTopHeader(provider, currentIndex),

                    // Active Tab Content
                    Expanded(
                      child: IndexedStack(
                        index: currentIndex,
                        children: _pages,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          // Sleek Mobile Bottom Navigation Bar (Visible only on mobile devices)
          bottomNavigationBar: !isDesktop
              ? Container(
                  decoration: const BoxDecoration(
                    color: Color(0xFF0F172A),
                    border: Border(top: BorderSide(color: Color(0xFF1E293B))),
                  ),
                  child: BottomNavigationBar(
                    currentIndex: currentIndex > 4 ? 0 : currentIndex,
                    onTap: (index) => provider.setTabIndex(index),
                    backgroundColor: const Color(0xFF0F172A),
                    selectedItemColor: const Color(0xFF38BDF8),
                    unselectedItemColor: const Color(0xFF94A3B8),
                    type: BottomNavigationBarType.fixed,
                    selectedFontSize: 11,
                    unselectedFontSize: 10,
                    items: const [
                      BottomNavigationBarItem(icon: Icon(Icons.home_outlined), activeIcon: Icon(Icons.home), label: 'Home'),
                      BottomNavigationBarItem(icon: Icon(Icons.graphic_eq_outlined), activeIcon: Icon(Icons.graphic_eq), label: 'Audio Lab'),
                      BottomNavigationBarItem(icon: Icon(Icons.dialpad_outlined), activeIcon: Icon(Icons.dialpad), label: 'Dialer'),
                      BottomNavigationBarItem(icon: Icon(Icons.phone_in_talk_outlined), activeIcon: Icon(Icons.phone_in_talk), label: 'Live Shield'),
                      BottomNavigationBarItem(icon: Icon(Icons.history_outlined), activeIcon: Icon(Icons.history), label: 'History'),
                    ],
                  ),
                )
              : null,
        );
      },
    );
  }

  Widget _buildDesktopTopHeader(VoiceGuardProvider provider, int currentIndex) {
    return Container(
      height: 64,
      padding: const EdgeInsets.symmetric(horizontal: 24),
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(bottom: BorderSide(color: Color(0xFFE2E8F0))),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              Text(
                _navItems[currentIndex]['label'],
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w900,
                  color: Color(0xFF0F172A),
                  fontFamily: 'monospace',
                  letterSpacing: 0.5,
                ),
              ),
              const SizedBox(width: 8),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFEFF6FF),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: const Text(
                  'ENGINE 16KHZ ACTIVE',
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFF2563EB),
                    fontFamily: 'monospace',
                  ),
                ),
              ),
            ],
          ),
          Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                decoration: BoxDecoration(
                  color: const Color(0xFFECFDF5),
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: const Color(0xFFA7F3D0)),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.circle, color: Color(0xFF10B981), size: 8),
                    SizedBox(width: 6),
                    Text(
                      'Zero-Retention Active',
                      style: TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: Color(0xFF065F46)),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 14),
              ElevatedButton.icon(
                onPressed: () => provider.setTabIndex(2),
                icon: const Icon(Icons.phone, size: 14, color: Colors.white),
                label: const Text('Open Dialer', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Colors.white)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF2563EB),
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  elevation: 0,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildSidebar(VoiceGuardProvider provider, int currentIndex, int unreadCount, bool isCallActive, {required bool isDrawer}) {
    return Container(
      color: const Color(0xFF0F172A),
      child: SafeArea(
        child: Column(
          children: [
            // Branding Logo Header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 20),
              child: Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF2563EB), Color(0xFF38BDF8)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(12),
                      boxShadow: [
                        BoxShadow(
                          color: const Color(0xFF2563EB).withValues(alpha: 0.4),
                          blurRadius: 12,
                          offset: const Offset(0, 4),
                        ),
                      ],
                    ),
                    child: const Icon(Icons.shield, color: Colors.white, size: 24),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'VoiceGuard AI',
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: -0.5,
                        ),
                      ),
                      Text(
                        'CYBER DEFENSE CORE',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF38BDF8),
                          fontFamily: 'monospace',
                          letterSpacing: 0.8,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
            const Divider(color: Color(0xFF1E293B), height: 1),
            const SizedBox(height: 12),

            // Navigation Links
            Expanded(
              child: ListView.builder(
                padding: const EdgeInsets.symmetric(horizontal: 12),
                itemCount: _navItems.length,
                itemBuilder: (context, idx) {
                  final item = _navItems[idx];
                  final isSelected = currentIndex == idx;
                  String? badgeText = item['badge'];
                  Color badgeColor = item['badgeColor'] ?? const Color(0xFF2563EB);

                  if (idx == 3 && isCallActive) {
                    badgeText = 'ACTIVE';
                    badgeColor = const Color(0xFFDC2626);
                  } else if (idx == 4 && unreadCount > 0) {
                    badgeText = '$unreadCount';
                    badgeColor = const Color(0xFF2563EB);
                  }

                  return Container(
                    margin: const EdgeInsets.only(bottom: 4),
                    child: InkWell(
                      onTap: () {
                        provider.setTabIndex(idx);
                        if (isDrawer) Navigator.pop(context);
                      },
                      borderRadius: BorderRadius.circular(14),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 11),
                        decoration: BoxDecoration(
                          color: isSelected ? const Color(0xFF1E293B) : Colors.transparent,
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: isSelected ? const Color(0xFF334155) : Colors.transparent,
                          ),
                        ),
                        child: Row(
                          children: [
                            Icon(
                              isSelected ? item['activeIcon'] : item['icon'],
                              color: isSelected ? const Color(0xFF38BDF8) : const Color(0xFF94A3B8),
                              size: 19,
                            ),
                            const SizedBox(width: 12),
                            Expanded(
                              child: Text(
                                item['label'],
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                                  color: isSelected ? Colors.white : const Color(0xFF94A3B8),
                                  fontFamily: 'monospace',
                                  letterSpacing: 0.3,
                                ),
                              ),
                            ),
                            if (badgeText != null)
                              Container(
                                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                                decoration: BoxDecoration(
                                  color: badgeColor,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  badgeText,
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 9.5,
                                    fontWeight: FontWeight.w800,
                                    fontFamily: 'monospace',
                                  ),
                                ),
                              ),
                          ],
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            // Bottom Profile & Status
            Padding(
              padding: const EdgeInsets.all(16.0),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFF1E293B),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFF334155)),
                ),
                child: Row(
                  children: [
                    CircleAvatar(
                      radius: 16,
                      backgroundColor: const Color(0xFF2563EB),
                      child: const Text('AB', style: TextStyle(color: Colors.white, fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 10),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Aryan Bindage',
                            style: TextStyle(color: Colors.white, fontSize: 12, fontWeight: FontWeight.w700),
                            overflow: TextOverflow.ellipsis,
                          ),
                          Text(
                            'Administrator',
                            style: TextStyle(color: Color(0xFF94A3B8), fontSize: 10),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: 8,
                      height: 8,
                      decoration: const BoxDecoration(
                        color: Color(0xFF10B981),
                        shape: BoxShape.circle,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
