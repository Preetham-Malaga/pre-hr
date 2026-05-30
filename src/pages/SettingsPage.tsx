import { Header }   from '../components/layout/Header';
import { useTheme } from '../context/ThemeContext';
import { COLOR_PRESETS, type ColorPreset } from '../theme/theme';
import { Sun, Moon, Monitor, Check, Palette } from 'lucide-react';

const THEME_OPTIONS = [
  { value: 'light',  label: 'Light Mode',    icon: Sun,     desc: 'Clean white interface' },
  { value: 'dark',   label: 'Dark Mode',      icon: Moon,    desc: 'Easy on the eyes' },
  { value: 'system', label: 'System Default', icon: Monitor, desc: 'Follow OS preference' },
] as const;

const COLOR_OPTIONS: { key: ColorPreset; label: string; hex: string }[] = [
  { key: "blue", label: "Blue", hex: "#2563EB" },
  { key: "green", label: "Green", hex: "#059669" },
  { key: "purple", label: "Purple", hex: "#7C3AED" },
  { key: "orange", label: "Orange", hex: "#EA580C" },
  { key: "red", label: "Red", hex: "#DC2626" },
];


export default function SettingsPage() {
  const { mode, colorPreset, setMode, setColorPreset } = useTheme();

  return (
    <>
      <Header title="Settings" subtitle="Manage your application preferences" />
      <div className="p-4 sm:p-6 max-w-2xl space-y-6 page-enter">

        {/* Theme */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg dark:bg-slate-700/60 bg-slate-100 flex items-center justify-center">
              <Sun size={17} className="dark:text-slate-300 text-slate-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm dark:text-slate-100 text-slate-900">Theme Settings</h2>
              <p className="text-xs dark:text-slate-500 text-slate-500">Choose your preferred appearance</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {THEME_OPTIONS.map(({ value, label, icon: Icon, desc }) => {
              const active = mode === value;
              return (
                <button key={value} onClick={() => setMode(value)}
                  className={`flex flex-col items-start gap-2 p-4 rounded-xl border-2 text-left transition-all ${
                    active ? 'dark:bg-slate-700/40 bg-blue-50' : 'dark:bg-slate-800/40 bg-white dark:border-slate-700/50 border-slate-200 dark:hover:bg-slate-700/30 hover:bg-slate-50'
                  }`}
                  style={active ? { borderColor: 'var(--color-primary)', backgroundColor: 'color-mix(in srgb, var(--color-primary) 8%, transparent)' } : {}}>
                  <div className="flex items-center justify-between w-full">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${active ? 'text-white' : 'dark:bg-slate-700 bg-slate-100 dark:text-slate-400 text-slate-600'}`}
                      style={active ? { backgroundColor: 'var(--color-primary)' } : {}}>
                      <Icon size={16} />
                    </div>
                    {active && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--color-primary)' }}>
                        <Check size={11} className="text-white" />
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold" style={active ? { color: 'var(--color-primary)' } : { color: 'inherit' }}>{label}</p>
                    <p className="text-xs dark:text-slate-500 text-slate-500 mt-0.5">{desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color */}
        <div className="card">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-lg dark:bg-slate-700/60 bg-slate-100 flex items-center justify-center">
              <Palette size={17} className="dark:text-slate-300 text-slate-600" />
            </div>
            <div>
              <h2 className="font-display font-bold text-sm dark:text-slate-100 text-slate-900">Color Customization</h2>
              <p className="text-xs dark:text-slate-500 text-slate-500">Choose your primary accent color</p>
            </div>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {COLOR_OPTIONS.map(({ key, label, hex }) => {
              const active = colorPreset === key;
              return (
                <button key={key} onClick={() => setColorPreset(key)} title={label}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${
                    active ? 'dark:bg-slate-700/40 bg-slate-50' : 'dark:bg-slate-800/40 bg-white dark:border-slate-700/50 border-slate-200 dark:hover:bg-slate-700/30 hover:bg-slate-50'
                  }`}
                  style={active ? { borderColor: hex } : {}}>
                  <div className="relative w-9 h-9 rounded-full flex items-center justify-center shadow-md" style={{ backgroundColor: hex }}>
                    {active && <Check size={16} className="text-white" />}
                  </div>
                  <span className={`text-xs font-medium ${active ? 'dark:text-slate-100 text-slate-900' : 'dark:text-slate-400 text-slate-600'}`}>{label}</span>
                </button>
              );
            })}
          </div>
          <div className="mt-4 p-3 rounded-lg dark:bg-slate-700/30 bg-slate-50 border dark:border-slate-700/50 border-slate-200">
            <p className="text-xs dark:text-slate-400 text-slate-500">
              Color changes apply instantly across the entire application. Preferences persist across sessions.
            </p>
          </div>
        </div>

        {/* Preview */}
        <div className="card">
          <h2 className="font-display font-bold text-sm dark:text-slate-100 text-slate-900 mb-4">Preview</h2>
          <div className="space-y-3">
            <div className="flex gap-2 flex-wrap">
              <button className="btn-primary">Primary Button</button>
              <button className="btn-ghost">Ghost Button</button>
              <button className="btn-danger">Danger Button</button>
            </div>
            <div>
              <label className="label">Sample Input</label>
              <input className="input" placeholder="Click to see focus ring color" readOnly />
            </div>
            <div className="h-2 dark:bg-slate-700/60 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full w-2/3 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
            </div>
          </div>
        </div>

      </div>
    </>
  );
}