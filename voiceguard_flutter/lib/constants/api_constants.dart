class ApiConstants {
  // FastAPI Backend URL (Render Production Cloud + Local Fallback)
  static const String baseUrl = 'https://voice-clone-detection.onrender.com';
  static const String localUrl = 'http://10.0.2.2:8000'; // For Android Emulator local testing

  // Endpoints
  static const String analyzeChunk = '$baseUrl/analyze-chunk';
  static const String analyzeFile = '$baseUrl/analyze-file';
  static const String saveCall = '$baseUrl/auth/save-call';
  static const String login = '$baseUrl/auth/login';
  static const String register = '$baseUrl/auth/register';
  static const String samplesList = '$baseUrl/samples';
  static const String health = '$baseUrl/health';
}
