import { useBoardStore } from '../store/boardStore';
import { Settings, Moon, Sun, Grid, Square, List, Circle, X } from 'lucide-react';

export default function SettingsPanel({ isOpen, onClose }) {
  const {
    theme,
    setTheme,
    background,
    setBackground,
    bgColor,
    setBgColor,
    gridSize,
    setGridSize,
    gridOpacity,
    setGridOpacity,
  } = useBoardStore();

  const backgroundTypes = [
    { id: 'plain', name: 'Plain', icon: Square },
    { id: 'grid', name: 'Grid', icon: Grid },
    { id: 'dotted', name: 'Dotted', icon: Circle },
    { id: 'lined', name: 'Lined', icon: List },
  ];

  const bgPresetColors = [
    // Light Presets
    { hex: '#ffffff', label: 'White' },
    { hex: '#fcfbf7', label: 'Off-white' },
    { hex: '#eef2f6', label: 'Slate' },
    // Creative Presets
    { hex: '#162e24', label: 'Chalkboard' },
    { hex: '#0f2240', label: 'Blueprint' },
    // Dark Presets
    { hex: '#121214', label: 'Dark Charcoal' },
  ];

  const handleBgColorChange = (hex) => {
    setBgColor(hex);
    // Automatically match the theme for Chalkboard/Blueprint/Dark Charcoal as dark mode
    const darkHexes = ['#162e24', '#0f2240', '#121214'];
    if (darkHexes.includes(hex)) {
      setTheme('dark');
    } else {
      setTheme('light');
    }
  };

  return (
    <div
      className={`fixed top-20 right-4 bottom-28 w-80 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 z-40 flex flex-col transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-96 opacity-0 pointer-events-none'
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
          <Settings className="w-5 h-5" />
          <span>Canvas Settings</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Settings body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Theme Toggle */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
            <button
              onClick={() => setTheme('light')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'light'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Sun className="w-4 h-4" />
              Light
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                theme === 'dark'
                  ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white shadow-md'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              <Moon className="w-4 h-4" />
              Dark
            </button>
          </div>
        </div>

        {/* Background Style */}
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Background Type
          </label>
          <div className="grid grid-cols-2 gap-2">
            {backgroundTypes.map((bg) => {
              const BgIcon = bg.icon;
              return (
                <button
                  key={bg.id}
                  onClick={() => setBackground(bg.id)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-sm font-medium ${
                    background === bg.id
                      ? 'border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400 shadow-sm'
                      : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/20 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <BgIcon className="w-4 h-4" />
                  {bg.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Canvas Background Color */}
        <div className="space-y-2.5">
          <label className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
            Board Background
          </label>
          <div className="grid grid-cols-3 gap-2">
            {bgPresetColors.map((colorObj) => (
              <button
                key={colorObj.hex}
                onClick={() => handleBgColorChange(colorObj.hex)}
                className={`group flex flex-col items-center justify-center p-2 rounded-xl border transition-all relative ${
                  bgColor.toLowerCase() === colorObj.hex.toLowerCase()
                    ? 'border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50/20 dark:bg-zinc-950/10 hover:bg-zinc-100 dark:hover:bg-zinc-800/30'
                }`}
              >
                <div
                  style={{ backgroundColor: colorObj.hex }}
                  className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-inner"
                />
                <span className="text-[10px] mt-1 font-semibold text-zinc-500 dark:text-zinc-400 text-center">
                  {colorObj.label}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between gap-4 mt-2">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Custom Color</span>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-10 h-7 rounded cursor-pointer border border-zinc-300 dark:border-zinc-700 bg-transparent p-0"
            />
          </div>
        </div>

        {/* Grid Density & Opacity */}
        {background !== 'plain' && (
          <div className="space-y-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
            {/* Grid Size */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Grid Spacing</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">{gridSize}px</span>
              </div>
              <input
                type="range"
                min="20"
                max="80"
                step="5"
                value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>

            {/* Grid Opacity */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Grid Opacity</span>
                <span className="text-xs text-zinc-600 dark:text-zinc-400 font-mono">
                  {Math.round(gridOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.05"
                max="0.6"
                step="0.05"
                value={gridOpacity}
                onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
