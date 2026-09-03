import React, { useState, useRef, useEffect } from 'react';
import { 
  UploadCloud, 
  FileAudio, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check, 
  Cpu, 
  Zap, 
  Activity, 
  Radio, 
  PhoneOutgoing, 
  Sparkles,
  Volume2,
  FileCode,
  Layers,
  Clock,
  BarChart3
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const AudioLabPage = () => {
  const { navigateTo, startProtectedCall } = useVoiceGuard();

  const [selectedFile, setSelectedFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copiedTerminal, setCopiedTerminal] = useState(false);
  const [chunkDuration, setChunkDuration] = useState(2.0);

  const [availableSamples, setAvailableSamples] = useState([
    { filename: 'cloned_1.wav', label: 'AI Cloned Voice 1', type: 'cloned', desc: 'Synthetic neural speech clone sample' },
    { filename: 'cloned_2.wav', label: 'AI Cloned Voice 2', type: 'cloned', desc: 'AI vocoder cloned audio sample' },
    { filename: 'real_1.wav', label: 'Authentic Voice 1', type: 'real', desc: 'Natural human biological speech' },
    { filename: 'real_2.wav', label: 'Authentic Voice 2', type: 'real', desc: 'Natural human conversational speech' }
  ]);

  const audioRef = useRef(null);
  const fileInputRef = useRef(null);
  const terminalRef = useRef(null);

  // Auto-scroll terminal when analysis updates
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [analysisResult, isAnalyzing]);

  // Handle File Upload
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.wav') && !file.type.includes('audio')) {
      setErrorMsg('Please select a valid .wav audio file.');
      return;
    }

    setErrorMsg(null);
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setAudioUrl(url);
    setAnalysisResult(null);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Drag and drop handlers
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!file.name.toLowerCase().endsWith('.wav') && !file.type.includes('audio')) {
        setErrorMsg('Please drop a valid .wav audio file.');
        return;
      }
      setErrorMsg(null);
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setAudioUrl(url);
      setAnalysisResult(null);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Load a preset sample file
  const handleLoadSample = async (sample) => {
    try {
      setIsAnalyzing(true);
      setErrorMsg(null);
      setAnalysisResult(null);

      const res = await fetch(`http://localhost:8000/samples/${sample.filename}`);
      if (!res.ok) {
        throw new Error(`Failed to fetch sample audio (${res.statusText})`);
      }
      const blob = await res.blob();
      const file = new File([blob], sample.filename, { type: 'audio/wav' });
      
      setSelectedFile(file);
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      // Automatically trigger analysis
      await runAnalysis(file);
    } catch (err) {
      console.error(err);
      setErrorMsg(`Error loading sample: ${err.message}. Make sure backend server is running on port 8000.`);
      setIsAnalyzing(false);
    }
  };

  // Run Backend AI Analysis
  const runAnalysis = async (fileToAnalyze = selectedFile) => {
    if (!fileToAnalyze) {
      setErrorMsg('Please select or upload a .wav audio file first.');
      return;
    }

    setIsAnalyzing(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append('file', fileToAnalyze);
    formData.append('chunk_duration_sec', chunkDuration.toString());
    formData.append('phone_number', '+91 98234 11092');

    try {
      const apiBase = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:8000' : 'https://voice-clone-detection.onrender.com');
      const response = await fetch(`${apiBase}/analyze-file`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        throw new Error(errorData.detail || 'Analysis request failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg(`Analysis failed: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Copy terminal logs
  const handleCopyTerminal = () => {
    if (!analysisResult?.terminal_output) return;
    navigator.clipboard.writeText(analysisResult.terminal_output);
    setCopiedTerminal(true);
    setTimeout(() => setCopiedTerminal(false), 2000);
  };

  // Audio player controls
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration || 0);
    }
  };

  const handleAudioEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-fadeIn">
      {/* Hidden audio element */}
      {audioUrl && (
        <audio
          ref={audioRef}
          src={audioUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        />
      )}

      {/* Top Banner & Header */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-500/20 text-cyan-300 border border-blue-400/30 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                NEURAL AUDIO LAB
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                16kHz Slicing Engine
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-mono text-white">
              WAV Audio Deepfake Inspection Machine
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl">
              Upload any <code className="text-cyan-300 font-mono font-bold">.wav</code> voice recording or choose pre-packaged audio to perform 2-second acoustic chunk slicing, neural vocoder analysis, and inspect instant live terminal forensics.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs font-bold transition-all shadow-md hover:shadow-blue-500/25 flex items-center gap-2 cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              Upload .WAV Audio
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".wav,audio/wav"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {/* Preset Sample Audio Fast Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            Quick Test With Built-in Samples
          </h2>
          <span className="text-xs font-mono text-slate-400">
            Click any sample to load & inspect instantly
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {availableSamples.map((sample) => {
            const isCloned = sample.type === 'cloned';
            const isCurrent = selectedFile?.name === sample.filename;

            return (
              <div
                key={sample.filename}
                onClick={() => handleLoadSample(sample)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left relative overflow-hidden group ${
                  isCurrent
                    ? 'border-blue-500 bg-blue-50/50 shadow-md ring-2 ring-blue-500/20'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                      isCloned
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {isCloned ? 'AI Clone' : 'Real Human'}
                  </span>
                  <FileAudio className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>

                <h3 className="text-xs font-mono font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  {sample.label}
                </h3>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                  {sample.filename}
                </p>
                <p className="text-[11px] text-slate-600 mt-2 line-clamp-1">
                  {sample.desc}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono font-semibold text-blue-600">
                  <span>Load & Run AI</span>
                  <Zap className="w-3.5 h-3.5 text-blue-500 group-hover:scale-110 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Upload Zone & Audio Player Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 1/3: Upload & File Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 text-center cursor-pointer transition-all ${
              selectedFile
                ? 'border-blue-400 bg-blue-50/30'
                : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'
            }`}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-4 shadow-sm">
              <UploadCloud className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-mono font-bold text-slate-800">
              {selectedFile ? selectedFile.name : 'Drop .WAV audio file here'}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Supports 16kHz WAV format (or auto-resampled)
            </p>
            <div className="mt-4">
              <span className="inline-block px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-mono font-semibold border border-slate-200">
                {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB` : 'Browse Computer'}
              </span>
            </div>
          </div>

          {/* Chunk duration configuration */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-2">
                <Layers className="w-4 h-4 text-slate-500" />
                Chunk Window Slicing
              </span>
              <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                {chunkDuration}s Chunks
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1.0, 2.0, 3.0].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setChunkDuration(dur)}
                  className={`py-1.5 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                    chunkDuration === dur
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {dur}s Window
                </button>
              ))}
            </div>

            {/* Run Analysis Action Button */}
            <button
              onClick={() => runAnalysis()}
              disabled={!selectedFile || isAnalyzing}
              className={`w-full py-3 rounded-xl font-mono text-xs font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                !selectedFile
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : isAnalyzing
                  ? 'bg-indigo-700 text-white opacity-80 cursor-wait animate-pulse'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white hover:shadow-blue-500/25'
              }`}
            >
              {isAnalyzing ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  Running Neural Inference...
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  Run AI Deepfake Analysis
                </>
              )}
            </button>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-mono text-red-700 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right 2/3: Audio Player & Waveform & Inspection Dossier */}
        <div className="lg:col-span-2 space-y-6">
          {/* Audio Player Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Volume2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-mono font-bold text-slate-900">
                    {selectedFile ? selectedFile.name : 'No Audio Loaded'}
                  </h3>
                  <p className="text-xs text-slate-500 font-mono">
                    {selectedFile ? `${(selectedFile.size / 1024).toFixed(1)} KB • WAV format` : 'Select or upload a file'}
                  </p>
                </div>
              </div>

              {audioUrl && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={togglePlay}
                    className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-md transition-all cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                  </button>
                </div>
              )}
            </div>

            {/* Waveform track representation */}
            <div className="space-y-2 pt-2">
              <div className="h-16 bg-slate-900 rounded-2xl p-3 flex items-center gap-1 overflow-hidden relative">
                {/* Visual waveform bars */}
                {Array.from({ length: 48 }).map((_, i) => {
                  const progress = duration > 0 ? currentTime / duration : 0;
                  const barProgress = i / 48;
                  const isActive = barProgress <= progress;
                  const heightPercent = 20 + Math.abs(Math.sin(i * 0.45)) * 75;

                  return (
                    <div
                      key={i}
                      className="flex-1 flex items-center justify-center h-full"
                    >
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`w-full rounded-full transition-all duration-75 ${
                          isActive
                            ? 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]'
                            : 'bg-slate-700'
                        }`}
                      />
                    </div>
                  );
                })}

                {/* Playhead position */}
                {duration > 0 && (
                  <div
                    style={{ left: `${(currentTime / duration) * 100}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-white pointer-events-none shadow-md"
                  />
                )}
              </div>

              {/* Time display */}
              <div className="flex items-center justify-between text-xs font-mono text-slate-500">
                <span>{currentTime.toFixed(1)}s</span>
                <span>{duration.toFixed(1)}s</span>
              </div>
            </div>
          </div>

          {/* Quick Summary Dossier If Analysis Completed */}
          {analysisResult && (
            <div className={`p-6 rounded-3xl border shadow-md space-y-4 transition-all ${
              analysisResult.is_fake
                ? 'bg-red-950/20 border-red-400/40'
                : 'bg-emerald-950/20 border-emerald-400/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white ${
                    analysisResult.is_fake ? 'bg-red-600 shadow-glow-red' : 'bg-emerald-600 shadow-glow-emerald'
                  }`}>
                    {analysisResult.is_fake ? <ShieldAlert className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase ${
                      analysisResult.is_fake ? 'bg-red-500/20 text-red-600 border border-red-400/30' : 'bg-emerald-500/20 text-emerald-600 border border-emerald-400/30'
                    }`}>
                      {analysisResult.final_color} RISK VERDICT
                    </span>
                    <h3 className="text-base font-mono font-extrabold text-slate-900">
                      {analysisResult.final_verdict}
                    </h3>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Peak Risk Score</span>
                    <span className={`text-xl font-mono font-extrabold ${analysisResult.is_fake ? 'text-red-600' : 'text-emerald-600'}`}>
                      {analysisResult.max_risk_score}/100
                    </span>
                  </div>
                  <div className="h-8 w-px bg-slate-300" />
                  <div className="text-right">
                    <span className="text-[10px] font-mono uppercase text-slate-500 block">Total Chunks</span>
                    <span className="text-xl font-mono font-extrabold text-slate-800">
                      {analysisResult.total_chunks}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Transfer to Live Dialer */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
                <span className="text-xs font-mono text-slate-600">
                  Avg Latency: <strong className="text-slate-900">{analysisResult.avg_latency_ms} ms</strong>/chunk • Total Processing: <strong className="text-slate-900">{analysisResult.total_latency_ms} ms</strong>
                </span>

                <button
                  onClick={() => {
                    startProtectedCall({
                      scenarioId: analysisResult.is_fake ? 'sc_01_urgency_deepfake' : 'sc_04_authentic_call',
                      phoneNumber: '+91 98234 11092',
                      callerLabel: `Uploaded: ${analysisResult.filename}`
                    });
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-mono text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <PhoneOutgoing className="w-3.5 h-3.5 text-cyan-400" />
                  Test in Live Dialer Call
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Live Terminal Output Console (Matching Terminal Output Screenshot) */}
      <div className="bg-slate-950 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl space-y-0">
        {/* Terminal Header Bar */}
        <div className="px-5 py-3.5 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
            </div>
            <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              terminal — python tests/test_stream.py --wav {selectedFile?.name || 'input.wav'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyTerminal}
              disabled={!analysisResult}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
              title="Copy terminal logs"
            >
              {copiedTerminal ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTerminal ? 'Copied' : 'Copy Output'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Console Body */}
        <div
          ref={terminalRef}
          className="p-6 font-mono text-xs text-slate-200 overflow-x-auto max-h-96 leading-relaxed select-text space-y-2"
        >
          {!analysisResult && !isAnalyzing && (
            <div className="text-slate-500 space-y-1">
              <p className="text-cyan-400 font-bold">$ python tests/test_stream.py --url ws://localhost:8000/ws/detect --wav sample.wav</p>
              <p>Waiting for audio upload or sample selection...</p>
              <p className="text-slate-600">Select any sample above or drop a .wav file and click "Run AI Deepfake Analysis" to execute real-time 16kHz chunk stream evaluation.</p>
            </div>
          )}

          {isAnalyzing && (
            <div className="text-cyan-400 space-y-2 animate-pulse">
              <p className="font-bold">$ python tests/test_stream.py --wav {selectedFile?.name}</p>
              <p>⚡ Connecting to FastAPI Inference Engine on http://localhost:8000 ...</p>
              <p>Loading audio buffer, resampling to 16000 Hz mono...</p>
              <p>Extracting acoustic spectrograms and computing neural embeddings...</p>
            </div>
          )}

          {analysisResult && (
            <pre className="text-xs font-mono whitespace-pre-wrap text-slate-300">
              {analysisResult.terminal_output}
            </pre>
          )}
        </div>
      </div>

      {/* Detailed Chunk-by-Chunk Diagnostic Cards */}
      {analysisResult?.chunks && analysisResult.chunks.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              Chunk-by-Chunk Forensic Breakdown ({analysisResult.chunks.length} Segments)
            </h2>
            <span className="text-xs font-mono text-slate-500">
              Evaluated sequentially at {analysisResult.chunk_duration_sec}s intervals
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {analysisResult.chunks.map((chunk) => {
              const isHigh = chunk.risk_level === 'HIGH';
              const isMod = chunk.risk_level === 'MODERATE';

              return (
                <div
                  key={chunk.chunk_id}
                  className={`p-5 rounded-2xl border bg-white shadow-sm space-y-3 transition-all ${
                    isHigh
                      ? 'border-red-300 hover:border-red-400 bg-red-50/10'
                      : isMod
                      ? 'border-amber-300 hover:border-amber-400 bg-amber-50/10'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                      Chunk {chunk.chunk_index} ({chunk.start_time_sec}s - {chunk.end_time_sec}s)
                    </span>

                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-mono font-extrabold uppercase ${
                        isHigh
                          ? 'bg-red-100 text-red-700 border border-red-200'
                          : isMod
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {chunk.risk_level} • {chunk.risk_score}/100
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Inference Latency</span>
                      <span className="font-bold text-slate-900">{chunk.latency_ms} ms</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Confidence</span>
                      <span className="font-bold text-slate-900">{(chunk.confidence * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span className="text-slate-500">Is Fake Flag</span>
                      <span className={`font-bold ${chunk.is_fake ? 'text-red-600' : 'text-emerald-600'}`}>
                        {chunk.is_fake ? 'TRUE (AI Detected)' : 'FALSE (Organic)'}
                      </span>
                    </div>
                  </div>

                  {chunk.acoustic_metrics && (
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-3 gap-1 text-[10px] font-mono text-slate-600">
                      <div>
                        <span className="text-slate-400 block">F0 Pitch</span>
                        <strong>{chunk.acoustic_metrics.mean_f0 ? `${Math.round(chunk.acoustic_metrics.mean_f0)} Hz` : '145 Hz'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Centroid</span>
                        <strong>{chunk.acoustic_metrics.centroid ? `${Math.round(chunk.acoustic_metrics.centroid)} Hz` : '1850 Hz'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Jitter</span>
                        <strong>{chunk.acoustic_metrics.jitter ? `${chunk.acoustic_metrics.jitter.toFixed(2)}%` : '1.2%'}</strong>
                      </div>
                    </div>
                  )}

                  <p className="text-xs text-slate-700 font-sans leading-relaxed pt-1 border-t border-slate-100">
                    <strong className="font-mono text-slate-500 text-[10px] uppercase block mb-0.5">Diagnostic Rationale:</strong>
                    {chunk.reason}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
