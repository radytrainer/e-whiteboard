import { useBoardStore } from '../store/boardStore';
import { Settings, Moon, Sun, Grid, Square, List, Circle, X, FileText, RotateCcw } from 'lucide-react';

// Paper dimensions at 96 DPI (pixels). Stored here so Canvas can import the same map.
export const PAPER_SIZES = {
  a5:     { label: 'A5',     sub: '148 × 210 mm', w: 559,  h: 794  },
  a4:     { label: 'A4',     sub: '210 × 297 mm', w: 794,  h: 1123 },
  a3:     { label: 'A3',     sub: '297 × 420 mm', w: 1123, h: 1587 },
  letter: { label: 'Letter', sub: '8.5 × 11 in',  w: 816,  h: 1056 },
  legal:  { label: 'Legal',  sub: '8.5 × 14 in',  w: 816,  h: 1344 },
};

export default function SettingsPanel({ isOpen, onClose }) {
  const {
    theme, setTheme,
    background, setBackground,
    bgColor, setBgColor,
    gridSize, setGridSize,
    gridOpacity, setGridOpacity,
    paperSize, setPaperSize,
    paperOrientation, setPaperOrientation,
  } = useBoardStore();

  const backgroundTypes = [
    { id: 'plain',  name: 'Plain',  icon: Square },
    { id: 'grid',   name: 'Grid',   icon: Grid   },
    { id: 'dotted', name: 'Dotted', icon: Circle },
    { id: 'lined',  name: 'Lined',  icon: List   },
  ];

  const bgPresetColors = [
    { hex: '#ffffff', label: 'White'      },
    { hex: '#fcfbf7', label: 'Off-white'  },
    { hex: '#eef2f6', label: 'Slate'      },
    { hex: '#162e24', label: 'Chalkboard' },
    { hex: '#0f2240', label: 'Blueprint'  },
    { hex: '#121214', label: 'Charcoal'   },
  ];

  const handleBgColorChange = (hex) => {
    setBgColor(hex);
    const darkHexes = ['#162e24', '#0f2240', '#121214'];
    setTheme(darkHexes.includes(hex) ? 'dark' : 'light');
  };

  const sectionLabel = 'text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono';

  return (
    <div
      className={`fixed z-40 flex flex-col bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 transition-all duration-300
        top-16 right-4 left-4 max-h-[calc(100dvh-9rem)]
        sm:top-4 sm:right-20 sm:bottom-4 sm:left-auto sm:w-72 sm:max-h-none
        ${isOpen ? 'opacity-100 translate-y-0 sm:translate-x-0' : 'opacity-0 pointer-events-none translate-y-4 sm:translate-y-0 sm:translate-x-8'}
      `}
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-semibold">
          <Settings className="w-4 h-4" />
          <span className="text-sm">Canvas Settings</span>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-6">

        {/* ── Theme ── */}
        <div className="space-y-2">
          <label className={sectionLabel}>Theme</label>
          <div className="grid grid-cols-2 gap-2 bg-zinc-50 dark:bg-zinc-950 p-1 rounded-xl border border-zinc-200/30 dark:border-zinc-800/30">
            {[
              { id: 'light', Icon: Sun,  label: 'Light' },
              { id: 'dark',  Icon: Moon, label: 'Dark'  },
            ].map(({ id, Icon, label }) => (
              <button key={id}
                onClick={() => setTheme(id)}
                className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                  theme === id
                    ? 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-white shadow-md'
                    : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Background Type ── */}
        <div className="space-y-2">
          <label className={sectionLabel}>Background Type</label>
          <div className="grid grid-cols-2 gap-2">
            {backgroundTypes.map((bg) => {
              const BgIcon = bg.icon;
              return (
                <button key={bg.id}
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

        {/* ── Board Background Color ── */}
        <div className="space-y-2.5">
          <label className={sectionLabel}>Board Color</label>
          <div className="grid grid-cols-3 gap-2">
            {bgPresetColors.map((colorObj) => (
              <button key={colorObj.hex}
                onClick={() => handleBgColorChange(colorObj.hex)}
                className={`flex flex-col items-center justify-center p-2 rounded-xl border transition-all ${
                  bgColor.toLowerCase() === colorObj.hex.toLowerCase()
                    ? 'border-purple-600 dark:border-purple-400 bg-purple-50/50 dark:bg-purple-950/10 shadow-sm'
                    : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800/30'
                }`}
              >
                <div style={{ backgroundColor: colorObj.hex }} className="w-7 h-7 rounded-lg border border-zinc-200 dark:border-zinc-700 shadow-inner" />
                <span className="text-[10px] mt-1 font-semibold text-zinc-500 dark:text-zinc-400 text-center">{colorObj.label}</span>
              </button>
            ))}
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">Custom Color</span>
            <input
              type="color" value={bgColor}
              onChange={(e) => handleBgColorChange(e.target.value)}
              className="w-10 h-7 rounded cursor-pointer border border-zinc-300 dark:border-zinc-700 bg-transparent p-0"
            />
          </div>
        </div>

        {/* ── Grid Controls ── */}
        {background !== 'plain' && (
          <div className="space-y-4 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Grid Spacing</span>
                <span className="text-xs font-mono text-zinc-500">{gridSize}px</span>
              </div>
              <input type="range" min="20" max="80" step="5" value={gridSize}
                onChange={(e) => setGridSize(parseInt(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Grid Opacity</span>
                <span className="text-xs font-mono text-zinc-500">{Math.round(gridOpacity * 100)}%</span>
              </div>
              <input type="range" min="0.05" max="0.6" step="0.05" value={gridOpacity}
                onChange={(e) => setGridOpacity(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
            </div>
          </div>
        )}

        {/* ── Paper Size ── */}
        <div className="space-y-3 pt-2 border-t border-zinc-200/50 dark:border-zinc-800/50">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-zinc-400" />
            <label className={sectionLabel}>Paper Size</label>
          </div>

          {/* None option */}
          <button
            onClick={() => setPaperSize('none')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
              paperSize === 'none'
                ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400'
                : 'border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
            }`}
          >
            <div className="w-6 h-6 rounded border-2 border-dashed border-current opacity-50 shrink-0" />
            <span>No Paper Boundary</span>
          </button>

          {/* Paper size grid */}
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(PAPER_SIZES).map(([id, info]) => {
              const isActive = paperSize === id;
              // Preview aspect ratio
              const aspect = info.w / info.h; // portrait: < 1, landscape: > 1
              const previewW = paperOrientation === 'portrait' ? (aspect < 1 ? 16 : 20) : (aspect < 1 ? 20 : 16);
              const previewH = paperOrientation === 'portrait' ? (aspect < 1 ? 20 : 16) : (aspect < 1 ? 16 : 20);

              return (
                <button key={id}
                  onClick={() => setPaperSize(id)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-purple-400'
                      : 'border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  {/* Tiny paper icon */}
                  <div
                    className="shrink-0 rounded-sm border-2 border-current opacity-70"
                    style={{ width: previewW, height: previewH }}
                  />
                  <div>
                    <div className="text-sm font-semibold leading-tight">{info.label}</div>
                    <div className="text-[10px] opacity-60 leading-tight">{info.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Orientation toggle — only when a paper is selected */}
          {paperSize !== 'none' && (
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-zinc-500 dark:text-zinc-400 font-medium flex-1">Orientation</span>
              <div className="flex gap-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-0.5">
                {[
                  { id: 'portrait',  label: 'Portrait'  },
                  { id: 'landscape', label: 'Landscape' },
                ].map(({ id, label }) => (
                  <button key={id}
                    onClick={() => setPaperOrientation(id)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      paperOrientation === id
                        ? 'bg-white dark:bg-zinc-700 text-zinc-800 dark:text-white shadow-sm'
                        : 'text-zinc-500 dark:text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
