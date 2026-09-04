import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../constants/api_constants.dart';
import '../models/call_chunk.dart';
import '../models/call_session.dart';

class ApiService {
  static final ApiService _instance = ApiService._internal();
  factory ApiService() => _instance;
  ApiService._internal();

  // Analyze single 2-second audio chunk
  Future<CallChunk?> analyzeAudioChunk({
    required String callId,
    required String chunkId,
    required int chunkSeq,
    required String phoneNumber,
    required String callerName,
    required File audioFile,
  }) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse(ApiConstants.analyzeChunk));
      request.fields['call_id'] = callId;
      request.fields['chunk_id'] = chunkId;
      request.fields['phone_number'] = phoneNumber;
      request.fields['caller_name'] = callerName;
      request.files.add(await http.MultipartFile.fromPath('file', audioFile.path));

      var streamedResponse = await request.send().timeout(const Duration(seconds: 4));
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        var data = jsonDecode(response.body);
        return CallChunk.fromJson(data, chunkSeq);
      }
    } catch (e) {
      // Graceful fallback logging
    }
    return null;
  }

  // Analyze full audio file for Audio Lab
  Future<Map<String, dynamic>?> analyzeAudioFile({
    required File file,
    double chunkDuration = 2.0,
  }) async {
    try {
      var request = http.MultipartRequest('POST', Uri.parse(ApiConstants.analyzeFile));
      request.fields['chunk_duration_sec'] = chunkDuration.toString();
      request.fields['phone_number'] = '+91 98234 11092';
      request.files.add(await http.MultipartFile.fromPath('file', file.path));

      var streamedResponse = await request.send().timeout(const Duration(seconds: 15));
      var response = await http.Response.fromStream(streamedResponse);

      if (response.statusCode == 200) {
        return jsonDecode(response.body);
      }
    } catch (e) {
      // Fallback
    }
    return null;
  }

  // Save full call session to Supabase database
  Future<bool> saveCallSession(CallSession session, {String? userId, String? email}) async {
    try {
      var body = session.toJson();
      body['user_id'] = userId;
      body['email'] = email;

      var res = await http.post(
        Uri.parse(ApiConstants.saveCall),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode(body),
      ).timeout(const Duration(seconds: 5));

      return res.statusCode == 200;
    } catch (e) {
      return false;
    }
  }
}
