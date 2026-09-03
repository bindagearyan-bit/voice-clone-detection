import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  User, 
  Phone, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff,
  Zap,
  Activity,
  Cpu,
  Layers,
  Fingerprint
} from 'lucide-react';
import { useVoiceGuard } from '../../context/VoiceGuardContext';

export const LoginPage = () => {
  const { loginUser, registerUser } = useVoiceGuard();

  const [activeTab, setActiveTab] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '+91 98234 11092'
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setErrorMessage(null);
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (activeTab === 'signin') {
        if (!formData.email || !formData.password) {
          throw new Error('Please fill in both email and password.');
        }
        await loginUser(formData.email, formData.password);
      } else {
        if (!formData.name || !formData.email || !formData.password) {
          throw new Error('Please complete all required fields.');
        }
        await registerUser(formData.name, formData.email, formData.password, formData.phone);
        setSuccessMessage('Account created! Initializing fresh workspace...');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  // Fast Demo 1-Click Login
  const handleQuickDemoLogin = async (userType) => {
    setIsLoading(true);
    setErrorMessage(null);

    const email = userType === 'fresh' ? `user_${Date.now().toString().slice(-4)}@voiceguard.ai` : 'demo@voiceguard.ai';
    const name = userType === 'fresh' ? 'New Officer' : 'Security Analyst';

    try {
      if (userType === 'fresh') {
        await registerUser(name, email, 'password123', '+91 98234 11092');
      } else {
        // Try login first or register if doesn't exist
        try {
          await loginUser(email, 'password123');
        } catch {
          await registerUser(name, email, 'password123', '+91 98234 11092');
        }
      }
    } catch (err) {
      setErrorMessage(err.message || 'Demo login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white font-sans flex items-center justify-center p-4 relative overflow-hidden selection:bg-blue-600 selection:text-white">
      {/* Background Animated Gradient Mesh & Glows */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Grid line background overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Glassmorphic Auth Container */}
      <div className="relative z-10 w-full max-w-xl bg-slate-900/80 backdrop-blur-2xl border border-slate-800 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 animate-fadeIn">
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 text-white shadow-glow-blue mx-auto ring-4 ring-blue-500/20">
            <ShieldCheck className="w-9 h-9 stroke-[2.2]" />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-mono text-white flex items-center justify-center gap-2">
              VoiceGuard
              <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-blue-500/20 text-cyan-300 border border-blue-400/30">
                AI
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 font-medium">
              Real-Time AI Voice Clone & Audio Deepfake Shield
            </p>
          </div>
        </div>

        {/* Tab Toggle: Sign In vs Sign Up */}
        <div className="p-1 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-2 gap-1 font-mono text-xs">
          <button
            type="button"
            onClick={() => { setActiveTab('signin'); setErrorMessage(null); }}
            className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'signin'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>

          <button
            type="button"
            onClick={() => { setActiveTab('signup'); setErrorMessage(null); }}
            className={`py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
              activeTab === 'signup'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Feedback Alerts */}
        {errorMessage && (
          <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-start gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Officer Rajesh Sharma"
                  required
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="rajesh@police.gov.in"
                required
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
            </div>
          </div>

          {activeTab === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
                Phone Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98234 11092"
                  className="w-full bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 pl-10 pr-4 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider block">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full bg-slate-950/70 border border-slate-800 focus:border-blue-500 rounded-2xl py-3 pl-10 pr-10 text-xs font-mono text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-98 text-white font-mono text-xs font-bold transition-all shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 cursor-pointer mt-6"
          >
            {isLoading ? (
              <>
                <Activity className="w-4 h-4 animate-spin" />
                <span>Connecting to Database...</span>
              </>
            ) : (
              <>
                <span>{activeTab === 'signin' ? 'Sign In to Shield' : 'Create & Initialize Account'}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Isolation Note */}
        <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-500/20 text-slate-400 text-[11px] font-sans flex items-start gap-2.5">
          <Fingerprint className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <span>
            <strong className="text-slate-200">Per-User Data Isolation:</strong> When a new user creates an account, contacts, call histories, and threat telemetry are completely fresh and isolated.
          </span>
        </div>

        {/* Quick Demo Logins for Fast Evaluation */}
        <div className="pt-2 border-t border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 uppercase">
            <span>Fast One-Click Evaluation</span>
            <span className="text-cyan-400">Database Ready</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('fresh')}
              disabled={isLoading}
              className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-mono font-bold text-cyan-300 block group-hover:text-cyan-200">
                + New Clean User
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Fresh empty contacts & history
              </span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('demo')}
              disabled={isLoading}
              className="p-3 rounded-xl bg-slate-950/80 hover:bg-slate-800 border border-slate-800 text-left transition-all cursor-pointer group"
            >
              <span className="text-xs font-mono font-bold text-blue-300 block group-hover:text-blue-200">
                ⚡ Demo Analyst
              </span>
              <span className="text-[10px] text-slate-500 block mt-0.5">
                Pre-configured test suite
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
