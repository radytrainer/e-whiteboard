import { useRef } from 'react';
import { 
  MousePointer, 
  Hand, 
  Pencil, 
  Eraser, 
  Type, 
  StickyNote, 
  Image as ImageIcon,
  Shapes
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function Toolbar() {
  const {
    tool,
    setTool,
    pencilColor,
    setPencilColor,
    pencilWidth,
    setPencilWidth,
    eraserWidth,
    setEraserWidth,
    addObject,
  } = useBoardStore();

  const fileInputRef = useRef(null);

  const tools = [
    { id: 'select', name: 'Select',       icon: MousePointer, shortcut: 'V' },
    { id: 'pan',    name: 'Pan Board',    icon: Hand,         shortcut: 'Space' },
    { id: 'pencil', name: 'Pencil',       icon: Pencil,       shortcut: 'P' },
    { id: 'eraser', name: 'Eraser',       icon: Eraser,       shortcut: 'E' },
    { id: 'text',   name: 'Text Tool',    icon: Type,         shortcut: 'T' },
    { id: 'sticky', name: 'Sticky Note',  icon: StickyNote,   shortcut: 'N' },
    { id: 'image',  name: 'Insert Image', icon: ImageIcon,    shortcut: 'I' },
    { id: 'shape',  name: 'Shapes',       icon: Shapes,       shortcut: 'S' },
  ];

  const colorPalette = [
    '#000000', '#aa3bff', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899',
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const maxDim = 300;
        let w = img.width, h = img.height;
        if (w > maxDim || h > maxDim) {
          const r = Math.min(maxDim / w, maxDim / h);
          w *= r; h *= r;
        }
        addObject({ type: 'image', src: event.target.result,
          x: window.innerWidth / 2 - w / 2, y: window.innerHeight / 2 - h / 2,
          width: w, height: h, rotation: 0, scaleX: 1, scaleY: 1 });
      };
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const panelCls = 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-4 flex flex-col gap-3 transition-all animate-in slide-in-from-left-4 duration-200';
  const labelCls = 'text-xs font-semibold text-zinc-500 dark:text-zinc-400 block mb-1.5';

  return (
    <div className="flex flex-col gap-4">
      <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />

      {/* ── Main tool selector ── */}
      <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-2 flex flex-col items-center gap-1.5">
        {tools.map((t) => {
          const Icon = t.icon;
          const isActive = tool === t.id;
          return (
            <button
              key={t.id}
              onClick={() => t.id === 'image' ? fileInputRef.current?.click() : setTool(t.id)}
              title={`${t.name} (${t.shortcut})`}
              className={`relative p-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-purple-600 text-white shadow-md scale-105'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="absolute left-14 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
                {t.name}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Pencil options ── */}
      {tool === 'pencil' && (
        <div className={`${panelCls} w-44`}>
          <div>
            <label className={labelCls}>Color</label>
            <div className="grid grid-cols-5 gap-1.5">
              {colorPalette.map((c) => (
                <button key={c} onClick={() => setPencilColor(c)} style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border transition-all ${
                    pencilColor === c ? 'border-zinc-800 dark:border-white scale-110 ring-2 ring-purple-600/30'
                                     : 'border-zinc-300 dark:border-zinc-700 hover:scale-105'}`} />
              ))}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Brush Size</label>
              <span className="text-xs font-mono text-zinc-500">{pencilWidth}px</span>
            </div>
            <input type="range" min="1" max="20" value={pencilWidth}
              onChange={(e) => setPencilWidth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>
        </div>
      )}

      {/* ── Eraser options ── */}
      {tool === 'eraser' && (
        <div className={`${panelCls} w-44`}>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">Eraser Size</label>
              <span className="text-xs font-mono text-zinc-500">{eraserWidth}px</span>
            </div>
            <input type="range" min="10" max="100" value={eraserWidth}
              onChange={(e) => setEraserWidth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>
        </div>
      )}
    </div>
  );
}
