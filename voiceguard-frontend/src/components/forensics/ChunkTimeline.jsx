import React, { useState } from 'react';
import { 
  Layers, 
  Clock, 
  ShieldAlert, 
  ShieldCheck, 
  Code, 
  ChevronRight, 
  FileCode, 
  Radio,
  CheckCircle2
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const ChunkTimeline = () => {
  const { processedChunks, activeCallId, activeCaller } = useCall();
  const [inspectedChunk, setInspectedChunk] = useState(null);

  return (
    <div className="neumorph-card p-5 rounded-3xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-cyber-border/60 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-cyber-card border border-cyber-border text-cyber-teal shadow-glow-teal">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
              Real-Time 2-Second Audio Chunks Stream
            </h3>
            <p className="text-[11px] text-cyber-muted">
              Continuous WebSocket chunk analysis pipeline (16kHz WAV format)
            </p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] font-mono text-cyber-muted uppercase block">
            Chunks Processed
          </span>
          <span className="text-lg font-bold font-mono text-cyber-cyan">
            {processedChunks.length} Chunks
          </span>
        </div>
      </div>

      {/* Chunks Stream List */}
      {processedChunks.length === 0 ? (
        <div className="p-8 text-center rounded-2xl bg-cyber-surface border border-cyber-border/40 text-cyber-muted text-xs font-mono space-y-2">
          <Radio className="w-6 h-6 mx-auto text-cyber-muted animate-pulse" />
          <p>No active audio stream. Answer a call or start live mic to view chunks.</p>
        </div>
      ) : (
        <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
          {processedChunks.map((chunk, idx) => {
            const isFake = (chunk.spoofScore || 0) >= 0.8;
            const isModerate = (chunk.spoofScore || 0) >= 0.4 && (chunk.spoofScore || 0) < 0.8;
            const isSelected = inspectedChunk?.chunkId === chunk.chunkId;

            return (
              <div
                key={chunk.chunkId || idx}
                onClick={() => setInspectedChunk(isSelected ? null : chunk)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-cyber-cardElevated border-cyber-cyan shadow-glow-cyan'
                    : isFake
                    ? 'bg-red-950/20 border-red-900/40 hover:border-red-500/60'
                    : isModerate
                    ? 'bg-amber-950/20 border-amber-900/40 hover:border-amber-500/60'
                    : 'bg-cyber-surface border-cyber-border/60 hover:border-cyber-teal/60'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyber-bg border border-cyber-border text-white font-bold">
                      {chunk.chunkId} [{chunk.timeRange}]
                    </span>
                    <span className="text-cyber-muted text-[11px] hidden sm:inline">
                      16kHz WAV (32KB)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isFake
                          ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                          : isModerate
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      }`}
                    >
                      {isFake ? 'AI SPOOF' : isModerate ? 'SUSPICIOUS' : 'HUMAN'} (
                      {Math.round((chunk.spoofScore || 0) * 100)}%)
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 text-cyber-muted transition-transform ${
                        isSelected ? 'rotate-90 text-cyber-cyan' : ''
                      }`}
                    />
                  </div>
                </div>

                {/* Speech Transcript */}
                <p className="mt-2 text-xs text-cyber-text italic bg-cyber-bg/60 p-2 rounded-xl border border-cyber-border/40 font-mono">
                  "{chunk.transcript}"
                </p>

                {/* Reason */}
                <div className="mt-1.5 flex items-center justify-between text-[10px] font-mono text-cyber-muted">
                  <span className="truncate max-w-[280px]">
                    <strong>Reason:</strong> {chunk.reason}
                  </span>
                  <span className="text-cyber-lightMuted">
                    Conf: {Math.round((chunk.confidence || 0.94) * 100)}%
                  </span>
                </div>

                {/* Expanded JSON WebSocket Payload Inspection (Step 3 & Step 7) */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-cyber-border space-y-2 animate-fadeIn">
                    <div className="flex items-center justify-between text-[11px] font-mono text-cyber-cyan">
                      <span className="flex items-center gap-1">
                        <Code className="w-3.5 h-3.5" />
                        WebSocket JSON Exchange (Step 3 & 7)
                      </span>
                    </div>

                    <div className="bg-cyber-bg p-2.5 rounded-xl border border-cyber-border font-mono text-[10px] text-cyber-teal overflow-x-auto">
                      <pre>
{JSON.stringify(
  {
    client_payload: {
      chunk_id: chunk.chunkId,
      call_id: activeCallId || 'call_20250118_143052',
      audio_data: "UklGRiQAAABXQVZFZm10IBAAAAABAAEA...",
      timestamp: new Date().toISOString(),
      phone_number: activeCaller.number,
    },
    backend_voiceguard_response: {
      chunk_id: chunk.chunkId,
      risk_score: Math.round(chunk.spoofScore * 100),
      risk_level: isFake ? 'HIGH' : isModerate ? 'MODERATE' : 'LOW',
      is_fake: isFake,
      reason: chunk.reason,
      confidence: chunk.confidence || 0.94,
      latency_ms: 820,
    },
  },
  null,
  2
)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
