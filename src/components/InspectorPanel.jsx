import { useMemo } from 'react';
import { 
  Square, 
  Circle, 
  Triangle, 
  Minus, 
  Hexagon, 
  ArrowRight,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function InspectorPanel() {
  const {
    tool,
    selectedId,
    eraserWidth,
    setEraserWidth,
    textColor,
    setTextColor,
    textSize,
    setTextSize,
    textFont,
    setTextFont,
    updateObject,
    objects,
    shapeType,
    setShapeType,
    shapeSides,
    setShapeSides,
    shapeStroke,
    setShapeStroke,
    shapeFill,
    setShapeFill,
    stickyColor,
    setStickyColor,
  } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  // --- Context-aware panel visibility ---
  const showEraserPanel  = tool === 'eraser';
  const showTextPanel    = tool === 'text'   || (tool === 'select' && selectedObj?.type === 'text');
  const showShapePanel   = tool === 'shape'  || (tool === 'select' && selectedObj?.type === 'shape');

  if (!showEraserPanel && !showTextPanel && !showShapePanel) {
    return null;
  }

  const colorPalette = [
    '#000000', '#aa3bff', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899',
  ];

  const fontOptions = [
    { label: 'Inter',    value: 'Inter'           },
    { label: 'ខ្មែរ',   value: 'Kantumruy Pro'    },
    { label: 'Serif',    value: 'Georgia'          },
    { label: 'Mono',     value: 'monospace'        },
  ];

  // --- Active values (fallback to store settings if no active selected object) ---
  const activeTextColor   = (selectedObj?.type === 'text' ? selectedObj.fontColor    : undefined) ?? textColor;
  const activeTextSize    = (selectedObj?.type === 'text' ? selectedObj.fontSize     : undefined) ?? textSize;
  const activeFontFamily  = (selectedObj?.type === 'text' ? selectedObj.fontFamily   : undefined) ?? textFont;
  const activeIsBold      = selectedObj?.type === 'text' ? !!selectedObj.isBold      : false;
  const activeIsItalic    = selectedObj?.type === 'text' ? !!selectedObj.isItalic    : false;
  const activeIsUnderline = selectedObj?.type === 'text' ? !!selectedObj.isUnderline : false;
  const activeAlign       = selectedObj?.type === 'text' ? (selectedObj.align || 'left') : 'left';

  const activeShapeType   = (selectedObj?.type === 'shape' ? selectedObj.shapeType : undefined) ?? shapeType;
  const activeShapeSides  = (selectedObj?.type === 'shape' ? selectedObj.sides     : undefined) ?? shapeSides;
  const activeShapeStroke = (selectedObj?.type === 'shape' ? selectedObj.stroke    : undefined) ?? shapeStroke;
  const activeShapeFill   = (selectedObj?.type === 'shape' ? selectedObj.fill      : undefined) ?? shapeFill;

  const applyText = (updates) => {
    if (updates.fontColor  !== undefined) setTextColor(updates.fontColor);
    if (updates.fontSize   !== undefined) setTextSize(updates.fontSize);
    if (updates.fontFamily !== undefined) setTextFont(updates.fontFamily);
    if (selectedId && selectedObj?.type === 'text') {
      updateObject(selectedId, updates);
    }
  };

  const applyShape = (strokeColor, fillValue) => {
    if (strokeColor !== undefined) setShapeStroke(strokeColor);
    if (fillValue   !== undefined) setShapeFill(fillValue);
    if (selectedId && selectedObj?.type === 'shape') {
      const patch = {};
      if (strokeColor !== undefined) patch.stroke = strokeColor;
      if (fillValue   !== undefined) patch.fill   = fillValue;
      updateObject(selectedId, patch);
    }
  };

  const deriveFill = (choice) => {
    if (choice === 'none')  return 'transparent';
    if (choice === 'light') return `${activeShapeStroke}26`;
    return activeShapeStroke;
  };

  const currentFillChoice =
    activeShapeFill === 'transparent'                                       ? 'none'
    : (activeShapeFill.length > 7 && activeShapeFill.endsWith('26'))       ? 'light'
    : 'solid';

  const panelCls = 'bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 p-3 flex flex-col gap-2.5 transition-all animate-in slide-in-from-right-4 duration-200';
  const labelCls = 'text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 block mb-1';

  return (
    <div className={`${panelCls} w-44`}>
      {/* ── ERASER PROPERTIES ── */}
      {showEraserPanel && (
        <>
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 font-mono">
            Eraser Tools
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Eraser Size</label>
              <span className="text-xs font-mono text-zinc-500">{eraserWidth}px</span>
            </div>
            <input type="range" min="10" max="100" value={eraserWidth}
              onChange={(e) => setEraserWidth(parseInt(e.target.value))}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>
        </>
      )}

      {/* ── TEXT PROPERTIES ── */}
      {showTextPanel && (
        <>
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 font-mono">
            Text Style
          </div>

          {/* Font size */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400">Font Size</label>
              <span className="text-xs font-mono text-zinc-500">{activeTextSize}px</span>
            </div>
            <input type="range" min="12" max="80" value={activeTextSize}
              onChange={(e) => applyText({ fontSize: parseInt(e.target.value) })}
              className="w-full h-1 bg-zinc-200 dark:bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-purple-600" />
          </div>

          {/* Bold / Italic / Underline */}
          <div>
            <label className={labelCls}>Style</label>
            <div className="flex gap-1">
              {[
                { icon: Bold,      key: 'isBold',      active: activeIsBold      },
                { icon: Italic,    key: 'isItalic',    active: activeIsItalic    },
                { icon: Underline, key: 'isUnderline', active: activeIsUnderline },
              ].map(({ icon: Icon, key, active }) => (
                <button key={key}
                  disabled={!selectedId || selectedObj?.type !== 'text'}
                  onClick={() => {
                    if (selectedId && selectedObj?.type === 'text') {
                      updateObject(selectedId, { [key]: !active });
                    }
                  }}
                  className={`flex-1 py-1 rounded-lg border flex items-center justify-center transition-all disabled:opacity-40 ${
                    active ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                           : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Alignment */}
          <div>
            <label className={labelCls}>Align</label>
            <div className="flex gap-1">
              {[
                { icon: AlignLeft,   val: 'left'   },
                { icon: AlignCenter, val: 'center' },
                { icon: AlignRight,  val: 'right'  },
              ].map(({ icon: Icon, val }) => (
                <button key={val}
                  disabled={!selectedId || selectedObj?.type !== 'text'}
                  onClick={() => {
                    if (selectedId && selectedObj?.type === 'text') {
                      updateObject(selectedId, { align: val });
                    }
                  }}
                  className={`flex-1 py-1 rounded-lg border flex items-center justify-center transition-all disabled:opacity-40 ${
                    activeAlign === val ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                                       : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>

          {/* Font family */}
          <div>
            <label className={labelCls}>Font</label>
            <div className="grid grid-cols-2 gap-1">
              {fontOptions.map((f) => (
                <button key={f.value}
                  onClick={() => applyText({ fontFamily: f.value })}
                  style={{ fontFamily: f.value }}
                  className={`py-1 text-[9px] font-semibold rounded-md border text-center transition-all ${
                    activeFontFamily === f.value
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ── SHAPE PROPERTIES ── */}
      {showShapePanel && (
        <>
          <div className="text-[10px] font-bold uppercase tracking-wider text-purple-500 dark:text-purple-400 font-mono">
            Shape Style
          </div>

          {/* Shape type grid */}
          <div>
            <label className={labelCls}>Shape</label>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'square',    label: 'Square',   icon: Square    },
                { id: 'circle',    label: 'Circle',   icon: Circle    },
                { id: 'triangle',  label: 'Triangle', icon: Triangle  },
                { id: 'arrow',     label: 'Arrow',    icon: ArrowRight},
                { id: 'line',      label: 'Line',     icon: Minus     },
                { id: 'polygon-5', label: 'Pentagon', icon: Hexagon, sides: 5 },
                { id: 'polygon-6', label: 'Hexagon',  icon: Hexagon, sides: 6 },
              ].map((s) => {
                const ShapeIcon = s.icon;
                const isActiveSel = s.id.startsWith('polygon')
                  ? activeShapeType === 'polygon' && activeShapeSides === s.sides
                  : activeShapeType === s.id;

                return (
                  <button key={s.id}
                    onClick={() => {
                      const updates = s.id.startsWith('polygon')
                        ? { shapeType: 'polygon', sides: s.sides }
                        : { shapeType: s.id };
                      
                      if (s.id.startsWith('polygon')) {
                        setShapeType('polygon');
                        setShapeSides(s.sides);
                      } else {
                        setShapeType(s.id);
                      }
                      if (selectedId && selectedObj?.type === 'shape') {
                        updateObject(selectedId, updates);
                      }
                    }}
                    title={s.label}
                    className={`p-1 rounded-lg border flex flex-col items-center justify-center gap-0.5 transition-all ${
                      isActiveSel
                        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 ring-2 ring-purple-600/20'
                        : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}>
                    <ShapeIcon className="w-4 h-4" />
                    <span className="text-[8px] font-medium leading-none">{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Fill type */}
          <div>
            <label className={labelCls}>Fill</label>
            <div className="grid grid-cols-3 gap-1">
              {['none', 'light', 'solid'].map((choice) => (
                <button key={choice}
                  onClick={() => applyShape(undefined, deriveFill(choice))}
                  className={`py-1 text-[9px] font-semibold rounded-md border text-center capitalize transition-all ${
                    currentFillChoice === choice
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50'}`}>
                  {choice}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
