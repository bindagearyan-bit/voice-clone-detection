/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Navy Sidebar Tokens
        sidebar: {
          bg: '#090d16',
          card: '#111827',
          hover: '#1e293b',
          border: '#1f293d',
          text: '#94a3b8',
          textActive: '#ffffff',
          accent: '#3b82f6',
        },
        // Light Enterprise Workspace Tokens
        workspace: {
          bg: '#f8fafc',
          bgAlt: '#f1f5f9',
          card: '#ffffff',
          cardMuted: '#f8fafc',
          border: '#e2e8f0',
          borderLight: '#f1f5f9',
          textPrimary: '#0f172a',
          textSecondary: '#475569',
          textMuted: '#94a3b8',
        },
        // Cybersecurity Brand & Status Colors
        vg: {
          blue: '#2563eb',
          blueHover: '#1d4ed8',
          blueLight: '#eff6ff',
          indigo: '#4f46e5',
          purple: '#7c3aed',
          cyan: '#06b6d4',
          // Severity Status
          safe: '#16a34a',       // Green for Low Spoof Risk
          safeLight: '#f0fdf4',
          safeBorder: '#bbf7d0',
          warning: '#d97706',    // Amber for Moderate
          warningLight: '#fffbeb',
          warningBorder: '#fde68a',
          danger: '#dc2626',     // Red ONLY for High Risk / AI Detected
          dangerLight: '#fef2f2',
          dangerBorder: '#fecaca',
        }
      },
      boxShadow: {
        'card-subtle': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-elevated': '0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04)',
        'card-glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glow-blue': '0 0 25px rgba(37, 99, 235, 0.25)',
        'glow-cyan': '0 0 20px rgba(6, 182, 212, 0.25)',
        'glow-danger': '0 0 30px rgba(220, 38, 38, 0.3)',
        'glow-safe': '0 0 20px rgba(22, 163, 74, 0.25)',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'spin 4s linear infinite',
      }
    },
  },
  plugins: [],
}
