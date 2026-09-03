import React, { useState } from 'react';
import { 
  Database, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Play, 
  Download, 
  ExternalLink,
  Trash2
} from 'lucide-react';
import { useCall } from '../../context/CallContext';

export const CallHistoryTable = () => {
  const { 
    callLogs, 
    setCallLogs, 
    setCallSummaryData, 
    setIncidentReportModalOpen 
  } = useCall();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('all'); // 'all' | 'high' | 'low'

  const filteredLogs = callLogs.filter((log) => {
    const matchesSearch =
      log.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.callerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.reason.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterRisk === 'high') return matchesSearch && log.riskScore >= 80;
    if (filterRisk === 'low') return matchesSearch && log.riskScore < 40;
    return matchesSearch;
  });

  const openDossierForLog = (log) => {
    setCallSummaryData({
      callId: log.id,
      phoneNumber: log.phoneNumber,
      callerTag: log.callerTag,
      totalDuration: `${log.durationSec}s`,
      chunksAnalyzed: log.chunksAnalyzed,
      averageRisk: log.riskScore,
      decision: log.riskScore >= 80 ? 'AI Voice Detected - Call Blocked' : 'Human Voice - Verified Clean',
      status: log.status,
      timestamp: log.timestamp,
      isFake: log.isFake,
      reason: log.reason,
      sha256: log.sha256,
    });
    setIncidentReportModalOpen(true);
  };

  return (
    <div className="neumorph-card p-6 rounded-3xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-cyber-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyber-card border border-cyber-border text-cyber-cyan shadow-glow-cyan">
            <Database className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
              Supabase Telemetry & Call Logs Database
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal">
                Step 6: call_logs Table
              </span>
            </h2>
            <p className="text-xs text-cyber-muted">
              Immutable digital ledger of all scanned audio streams, hashes, and model verdicts
            </p>
          </div>
        </div>

        <span className="text-xs font-mono text-cyber-lightMuted bg-cyber-surface px-3 py-1.5 rounded-xl border border-cyber-border">
          Total Logged: <strong className="text-white">{callLogs.length} Records</strong>
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyber-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone number, tag, or reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-cyber-surface border border-cyber-border text-xs font-mono text-white placeholder-cyber-muted focus:outline-none focus:border-cyber-cyan transition-all"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-cyber-surface rounded-2xl border border-cyber-border text-xs font-mono">
          <button
            onClick={() => setFilterRisk('all')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterRisk === 'all'
                ? 'bg-cyber-card text-white font-bold shadow'
                : 'text-cyber-muted hover:text-white'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setFilterRisk('high')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterRisk === 'high'
                ? 'bg-red-500/20 text-red-400 font-bold border border-red-500/40'
                : 'text-cyber-muted hover:text-red-400'
            }`}
          >
            Fake AI Calls (>80%)
          </button>
          <button
            onClick={() => setFilterRisk('low')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
              filterRisk === 'low'
                ? 'bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/40'
                : 'text-cyber-muted hover:text-emerald-400'
            }`}
          >
            Clean Human Calls
          </button>
        </div>
      </div>

      {/* Database Table */}
      <div className="overflow-x-auto rounded-2xl border border-cyber-border/80 shadow-neumorph-inset">
        <table className="w-full text-left text-xs font-mono">
          <thead className="bg-cyber-surface text-cyber-muted border-b border-cyber-border/80">
            <tr>
              <th className="p-3.5 font-bold uppercase tracking-wider">Timestamp / ID</th>
              <th className="p-3.5 font-bold uppercase tracking-wider">Caller Details</th>
              <th className="p-3.5 font-bold uppercase tracking-wider">Spoof Risk</th>
              <th className="p-3.5 font-bold uppercase tracking-wider">Reason / Findings</th>
              <th className="p-3.5 font-bold uppercase tracking-wider">Status / Action</th>
              <th className="p-3.5 font-bold uppercase tracking-wider text-right">Dossier</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-cyber-border/40">
            {filteredLogs.map((log) => {
              const isHigh = log.riskScore >= 80;
              const isModerate = log.riskScore >= 40 && log.riskScore < 80;

              return (
                <tr
                  key={log.id}
                  className="hover:bg-cyber-card/40 transition-colors"
                >
                  {/* Timestamp & ID */}
                  <td className="p-3.5 space-y-1">
                    <div className="font-bold text-white">{log.timestamp}</div>
                    <div className="text-[10px] text-cyber-muted truncate max-w-[120px]">
                      {log.id}
                    </div>
                  </td>

                  {/* Caller */}
                  <td className="p-3.5 space-y-1">
                    <div className="font-bold text-cyber-text">{log.phoneNumber}</div>
                    <div className="text-[11px] text-cyber-lightMuted">{log.callerTag}</div>
                  </td>

                  {/* Spoof Risk */}
                  <td className="p-3.5">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border">
                      {isHigh ? (
                        <span className="flex items-center gap-1 text-cyber-danger bg-red-950/40 border-red-500/30 px-2 py-0.5 rounded-full">
                          <ShieldAlert className="w-3.5 h-3.5" />
                          {log.riskScore}% FAKE
                        </span>
                      ) : isModerate ? (
                        <span className="flex items-center gap-1 text-cyber-warning bg-amber-950/40 border-amber-500/30 px-2 py-0.5 rounded-full">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          {log.riskScore}% SUSP
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-cyber-teal bg-emerald-950/40 border-emerald-500/30 px-2 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" />
                          {log.riskScore}% HUMAN
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Reason */}
                  <td className="p-3.5 max-w-[260px]">
                    <p className="text-cyber-lightMuted truncate text-[11px]" title={log.reason}>
                      {log.reason}
                    </p>
                    <span className="text-[10px] text-cyber-muted block mt-0.5">
                      {log.chunksAnalyzed} Chunks • {log.durationSec}s
                    </span>
                  </td>

                  {/* Status / Action */}
                  <td className="p-3.5">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                        isHigh
                          ? 'bg-red-500/10 text-red-400 border border-red-500/30'
                          : 'bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/30'
                      }`}
                    >
                      {log.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="p-3.5 text-right">
                    <button
                      onClick={() => openDossierForLog(log)}
                      className="px-3 py-1.5 rounded-xl bg-cyber-surface hover:bg-cyber-cardElevated border border-cyber-border text-cyber-cyan hover:text-white transition-all cursor-pointer inline-flex items-center gap-1"
                      title="Open Police / Bank Incident Report"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Report</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
