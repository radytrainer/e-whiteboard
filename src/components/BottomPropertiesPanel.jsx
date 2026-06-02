import { useMemo } from 'react';
import {
  Square, Circle, Triangle, Minus, Hexagon, ArrowRight,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Pen, Type, Shapes,
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

export default function BottomPropertiesPanel() {
  const {
    tool, selectedId, objects,
    pencilColor, setPencilColor, pencilWidth, setPencilWidth,
    textColor, setTextColor, textSize, setTextSize, textFont, setTextFont,
    shapeType, setShapeType, shapeSides, setShapeSides,
    shapeStroke, setShapeStroke, shapeFill, setShapeFill,
    updateObject,
  } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  // Also surface the panel in select mode when the user has a shape/text selected.
  const showPencil = tool === 'pencil';
  const showText   = tool === 'text'  || (tool === 'select' && selectedObj?.type === 'text');
  const showShape  = tool === 'shape' || (tool === 'select' && selectedObj?.type === 'shape');

  if (!showPencil && !showText && !showShape) return null;

  const colorPalette = [
    '#000000', '#aa3bff', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899',
  ];

  const fontOptions = [
    { label: 'Inter',  value: 'Inter'         },
    { label: 'ខ្មែរ', value: 'Kantumruy Pro'  },
    { label: 'Serif',  value: 'Georgia'        },
    { label: 'Mono',   value: 'monospace'      },
  ];

  const activeTextColor   = (selectedObj?.type === 'text' ? selectedObj.fontColor  : undefined) ?? textColor;
  const activeTextSize    = (selectedObj?.type === 'text' ? selectedObj.fontSize   : undefined) ?? textSize;
  const activeFontFamily  = (selectedObj?.type === 'text' ? selectedObj.fontFamily : undefined) ?? textFont;
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
    if (selectedId && selectedObj?.type === 'text') updateObject(selectedId, updates);
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
    activeShapeFill === 'transparent'                                ? 'none'
    : (activeShapeFill.length > 7 && activeShapeFill.endsWith('26')) ? 'light'
    : 'solid';

  const headerLabel = showPencil ? 'Pencil' : showText ? 'Text' : 'Shape';
  const ToolIcon    = showPencil ? Pen : showText ? Type : Shapes;

  const colorBtn = (color, isActive, onClick) => (
    <button
      key={color}
      onClick={onClick}
      style={{ backgroundColor: color }}
      className={`w-7 h-7 rounded-full border-2 transition-all duration-150 ${
        isActive
          ? 'border-zinc-800 dark:border-white scale-110 ring-2 ring-purple-500/40'
          : 'border-zinc-200 dark:border-zinc-600 hover:scale-105'
      }`}
    />
  );

  const divider = <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-0.5" />;

  return (
    <div className="
      bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md
      rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50
      p-3 flex flex-col gap-2.5
      w-[min(95vw,560px)]
      animate-in slide-in-from-bottom-4 duration-200 pointer-events-auto
    ">
      {/* Header */}
      <div className="flex items-center gap-1.5">
        <ToolIcon className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 font-mono">
          {headerLabel}
        </span>
      </div>

      {divider}

      {/* ── PENCIL ── */}
      {showPencil && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 w-7 shrink-0">Size</span>
            <input
              type="range" min="1" max="20" value={pencilWidth}
              onChange={(e) => setPencilWidth(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-[11px] font-mono text-zinc-500 w-8 text-right">{pencilWidth}px</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {colorPalette.map((c) =>
              colorBtn(c, pencilColor.toLowerCase() === c.toLowerCase(), () => setPencilColor(c))
            )}
          </div>
        </div>
      )}

      {/* ── TEXT ── */}
      {showText && (
        <div className="flex flex-col gap-2">
          {/* Size slider */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 w-7 shrink-0">Size</span>
            <input
              type="range" min="12" max="80" value={activeTextSize}
              onChange={(e) => applyText({ fontSize: parseInt(e.target.value) })}
              className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600"
            />
            <span className="text-[11px] font-mono text-zinc-500 w-8 text-right">{activeTextSize}px</span>
          </div>

          {/* Style + Align + Fonts — wraps cleanly on mobile */}
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { icon: Bold,      key: 'isBold',      active: activeIsBold      },
              { icon: Italic,    key: 'isItalic',    active: activeIsItalic    },
              { icon: Underline, key: 'isUnderline', active: activeIsUnderline },
            ].map(({ icon: Icon, key, active }) => (
              <button key={key}
                disabled={!selectedId || selectedObj?.type !== 'text'}
                onClick={() => selectedId && selectedObj?.type === 'text' && updateObject(selectedId, { [key]: !active })}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all disabled:opacity-40 ${
                  active
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

            {[
              { icon: AlignLeft,   val: 'left'   },
              { icon: AlignCenter, val: 'center' },
              { icon: AlignRight,  val: 'right'  },
            ].map(({ icon: Icon, val }) => (
              <button key={val}
                disabled={!selectedId || selectedObj?.type !== 'text'}
                onClick={() => selectedId && selectedObj?.type === 'text' && updateObject(selectedId, { align: val })}
                className={`w-9 h-9 rounded-lg border flex items-center justify-center transition-all disabled:opacity-40 ${
                  activeAlign === val
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}>
                <Icon className="w-4 h-4" />
              </button>
            ))}

            <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

            {fontOptions.map((f) => (
              <button key={f.value}
                onClick={() => applyText({ fontFamily: f.value })}
                style={{ fontFamily: f.value }}
                className={`px-2.5 h-9 text-[11px] font-semibold rounded-lg border transition-all ${
                  activeFontFamily === f.value
                    ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
                    : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Colors */}
          <div className="flex gap-1.5 flex-wrap">
            {colorPalette.map((c) =>
              colorBtn(c, activeTextColor.toLowerCase() === c.toLowerCase(), () => applyText({ fontColor: c }))
            )}
          </div>
        </div>
      )}

      {/* ── SHAPE ── */}
      {showShape && (
        <div className="flex flex-col gap-2">
          {/* Shape type — 4 cols on mobile, 7 on wider */}
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {[
              { id: 'square',    label: 'Square',   icon: Square     },
              { id: 'circle',    label: 'Circle',   icon: Circle     },
              { id: 'triangle',  label: 'Triangle', icon: Triangle   },
              { id: 'arrow',     label: 'Arrow',    icon: ArrowRight },
              { id: 'line',      label: 'Line',     icon: Minus      },
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
                    if (s.id.startsWith('polygon')) { setShapeType('polygon'); setShapeSides(s.sides); }
                    else setShapeType(s.id);
                    if (selectedId && selectedObj?.type === 'shape') {
                      updateObject(selectedId, s.id.startsWith('polygon')
                        ? { shapeType: 'polygon', sides: s.sides }
                        : { shapeType: s.id });
                    }
                  }}
                  title={s.label}
                  className={`py-2 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all ${
                    isActiveSel
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 ring-2 ring-purple-500/20'
                      : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}>
                  <ShapeIcon className="w-4 h-4" />
                  <span className="text-[9px] font-medium leading-none">{s.label}</span>
                </button>
              );
            })}
          </div>

          {/* Fill + Color — wraps on narrow screens */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1">
              {['none', 'light', 'solid'].map((choice) => (
                <button key={choice}
                  onClick={() => applyShape(undefined, deriveFill(choice))}
                  className={`px-3 h-8 text-[11px] font-semibold rounded-lg border capitalize transition-all ${
                    currentFillChoice === choice
                      ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 shadow-sm'
                      : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}>
                  {choice}
                </button>
              ))}
            </div>

            <div className="w-px h-5 bg-zinc-200 dark:bg-zinc-700" />

            <div className="flex gap-1.5 flex-wrap">
              {colorPalette.map((c) =>
                colorBtn(c, activeShapeStroke.toLowerCase() === c.toLowerCase(),
                  () => applyShape(c, deriveFill(currentFillChoice === 'none' ? 'none' : currentFillChoice))
                )
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
