import React, { useState } from 'react';
import { 
  History, 
  Search, 
  Filter, 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  FileText, 
  Calendar, 
  Clock, 
  ChevronRight,
  ArrowUpDown,
  PhoneCall
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const HistoryPage = () => {
  const { callHistory, viewCallDetails } = useVoiceGuard();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState('ALL'); // ALL | HIGH | MODERATE | LOW
  const [sortBy, setSortBy] = useState('newest'); // newest | highest_risk

  const filteredLogs = callHistory
    .filter((log) => {
      const matchesSearch =
        log.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.callerTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (log.classification && log.classification.toLowerCase().includes(searchQuery.toLowerCase()));

      if (filterRisk === 'HIGH') return matchesSearch && log.riskLevel === 'HIGH';
      if (filterRisk === 'MODERATE') return matchesSearch && log.riskLevel === 'MODERATE';
      if (filterRisk === 'LOW') return matchesSearch && log.riskLevel === 'LOW';
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'highest_risk') return b.riskScore - a.riskScore;
      return 0; // default newest
    });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
            Telemetry Database
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Unknown Calls History
          </h1>
          <p className="text-xs text-slate-500 font-medium">
            Search and review past unknown calls, real-time risk scores, and forensic indicators
          </p>
        </div>

        <span className="text-xs font-mono font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm">
          Total Logged: {callHistory.length} Calls
        </span>
      </div>

      {/* Search, Filter & Sort Controls */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by phone number, tag, or classification..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-xs font-mono text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 p-1 bg-white rounded-2xl border border-slate-200 text-xs font-mono shadow-sm overflow-x-auto">
          <button
            onClick={() => setFilterRisk('ALL')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              filterRisk === 'ALL'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Calls
          </button>
          <button
            onClick={() => setFilterRisk('HIGH')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              filterRisk === 'HIGH'
                ? 'bg-red-600 text-white shadow-sm'
                : 'text-red-700 hover:bg-red-50'
            }`}
          >
            🔴 High Spoof Risk
          </button>
          <button
            onClick={() => setFilterRisk('MODERATE')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              filterRisk === 'MODERATE'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-amber-700 hover:bg-amber-50'
            }`}
          >
            🟡 Moderate Risk
          </button>
          <button
            onClick={() => setFilterRisk('LOW')}
            className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer font-bold ${
              filterRisk === 'LOW'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-emerald-700 hover:bg-emerald-50'
            }`}
          >
            🟢 Low Spoof Risk
          </button>
        </div>

        {/* Sort */}
        <div className="flex items-center gap-1.5 bg-white px-3 py-2 rounded-2xl border border-slate-200 text-xs font-mono shadow-sm">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
          >
            <option value="newest">Sort: Most Recent</option>
            <option value="highest_risk">Sort: Highest Risk</option>
          </select>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-card-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-50 text-slate-500 border-b border-slate-200">
              <tr>
                <th className="p-4 font-bold uppercase tracking-wider">Date / Time</th>
                <th className="p-4 font-bold uppercase tracking-wider">Caller Details</th>
                <th className="p-4 font-bold uppercase tracking-wider">Duration</th>
                <th className="p-4 font-bold uppercase tracking-wider">Spoof Risk</th>
                <th className="p-4 font-bold uppercase tracking-wider">Classification Status</th>
                <th className="p-4 font-bold uppercase tracking-wider text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 font-mono">
                    No call records match your search or filter.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const isHigh = log.riskLevel === 'HIGH';
                  const isModerate = log.riskLevel === 'MODERATE';

                  return (
                    <tr
                      key={log.id}
                      onClick={() => viewCallDetails(log.id)}
                      className="hover:bg-slate-50/80 transition-colors cursor-pointer"
                    >
                      {/* Date / Time */}
                      <td className="p-4">
                        <span className="font-bold text-slate-800 block">
                          {log.timestamp}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {log.id}
                        </span>
                      </td>

                      {/* Caller */}
                      <td className="p-4">
                        <span className="font-bold text-slate-900 block">
                          {log.phoneNumber}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {log.callerTag}
                        </span>
                      </td>

                      {/* Duration */}
                      <td className="p-4 text-slate-700">
                        <span className="font-bold">{log.durationSec}s</span>
                        <span className="text-[10px] text-slate-400 block font-mono">
                          {log.chunksAnalyzed} Chunks (16kHz)
                        </span>
                      </td>

                      {/* Spoof Risk */}
                      <td className="p-4">
                        <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${isHigh ? 'bg-red-50 text-red-700 border-red-200' : isModerate ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                          {isHigh ? <ShieldAlert className="w-3.5 h-3.5" /> : isModerate ? <AlertTriangle className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                          <span>{log.riskScore}%</span>
                        </div>
                      </td>

                      {/* Classification */}
                      <td className="p-4">
                        <span className={`font-bold block ${isHigh ? 'text-red-700' : isModerate ? 'text-amber-700' : 'text-emerald-700'}`}>
                          {log.classification}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {log.statusLabel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="p-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            viewCallDetails(log.id);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-blue-700 border border-slate-200 text-xs font-mono font-bold inline-flex items-center gap-1 transition-all cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Report</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
