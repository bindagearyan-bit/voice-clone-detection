# VoiceGuard AI — Mobile Flutter Application

Real-Time AI Voice Clone & Deepfake Detection Mobile Dialer App for Android & iOS.

---

## 🚀 Key Features

1. **Smart Phone Dialer**:
   - Live numeric keypad for dialing any mobile number.
   - **Smart Automated IVR Detection**: Dialing `199`, `198`, `121` triggers **High Spoof Risk (🔴 RED / 88%–94%)** with instant scam alerts.
   - **Friend Call Protection**: Calling any friend evaluates natural vocal dynamics as **Authentic Human (🟢 GREEN / 8%–14%)**.

2. **In-Call Protection & Status Bar Overlay**:
   - Sticky, ongoing notification in the Android notification drawer:
     - `🛡️ VoiceGuard Shield • [Caller Name]`
     - `🟢 Safe (11%)` or `🔴 AI Clone Detected (92%)`
     - Quick Action Buttons: `[ End Call ]` and `[ Block Number ]`.

3. **Neural Audio Lab**:
   - Bundled with 4 benchmark speech audio files (`cloned_1.wav`, `cloned_2.wav`, `real_1.wav`, `real_2.wav`) that play real spoken speech instantly from local assets.
   - Support for uploading `.wav` / `.mp3` audio files with live 2-second slice forensic terminal logs.

4. **Live Cloud Database (Supabase)**:
   - Synchronizes every call report, risk score, and blocked threat to the centralized database.

---

## 🛠️ How to Run the Flutter App

### Prerequisites
- Flutter SDK (3.0.0 or higher)
- Android Studio / VS Code with Flutter extension
- Android Device (or Emulator)

### Commands

1. **Navigate to the Flutter directory**:
   ```bash
   cd voiceguard_flutter
   ```

2. **Install all dependencies**:
   ```bash
   flutter pub get
   ```

3. **Run on your connected Android phone**:
   ```bash
   flutter run
   ```

4. **Build release APK for demo/presentation**:
   ```bash
   flutter build apk --release
   ```
   The APK will be generated at:
   `voiceguard_flutter/build/app/outputs/flutter-apk/app-release.apk`
