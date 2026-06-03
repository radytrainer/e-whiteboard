import { useState, useRef, useCallback, useMemo } from 'react';
import {
  Square, Circle, Triangle, Minus, Hexagon, ArrowRight,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  Pen, Type, Shapes, StickyNote, ChevronDown,
} from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

// Pastel background swatches for sticky notes
const STICKY_BG_COLORS = [
  { hex: '#fef08a', label: 'Yellow'  },
  { hex: '#fbcfe8', label: 'Pink'    },
  { hex: '#bfdbfe', label: 'Blue'    },
  { hex: '#bbf7d0', label: 'Green'   },
  { hex: '#e9d5ff', label: 'Purple'  },
  { hex: '#fed7aa', label: 'Orange'  },
  { hex: '#fca5a5', label: 'Red'     },
  { hex: '#d9f99d', label: 'Lime'    },
];

export default function BottomPropertiesPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [pos, setPos] = useState(null); // null = default bottom-center
  const panelRef = useRef(null);
  const dragOrigin = useRef(null);

  const {
    tool, selectedId, objects,
    pencilColor, setPencilColor, pencilWidth, setPencilWidth,
    textColor, setTextColor, textSize, setTextSize, textFont, setTextFont,
    shapeType, setShapeType, shapeSides, setShapeSides,
    shapeStroke, setShapeStroke, shapeFill, setShapeFill,
    stickyColor, setStickyColor,
    updateObject,
  } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  const showPencil = tool === 'pencil';
  const showText   = tool === 'text'   || (tool === 'select' && selectedObj?.type === 'text');
  const showShape  = tool === 'shape'  || (tool === 'select' && selectedObj?.type === 'shape');
  const showSticky = tool === 'sticky' || (tool === 'select' && selectedObj?.type === 'sticky');


  const onHeaderPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest('[data-nodrag]')) return;
    e.preventDefault();
    const rect = panelRef.current.getBoundingClientRect();
    // Latch current pixel coords so panel doesn't jump on first drag
    setPos({ x: rect.left, y: rect.top });
    dragOrigin.current = {
      startX: e.clientX,
      startY: e.clientY,
      originX: rect.left,
      originY: rect.top,
    };
    const onMove = (me) => {
      const { startX, startY, originX, originY } = dragOrigin.current;
      setPos({
        x: Math.max(0, Math.min(window.innerWidth  - 80, originX + me.clientX - startX)),
        y: Math.max(0, Math.min(window.innerHeight - 60, originY + me.clientY - startY)),
      });
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup',   onUp);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup',   onUp);
  }, []);

  if (!showPencil && !showText && !showShape && !showSticky) return null;

  // ── shared palettes / options ──────────────────────────────────────────────
  const colorPalette = ['#1f2937','#aa3bff','#3b82f6','#10b981','#ef4444','#f59e0b','#ec4899'];

  const fontOptions = [
    { label: 'Inter',  value: 'Inter'         },
    { label: 'ខ្មែរ', value: 'Kantumruy Pro'  },
    { label: 'Serif',  value: 'Georgia'        },
    { label: 'Mono',   value: 'monospace'      },
  ];

  // ── text ──────────────────────────────────────────────────────────────────
  const activeTextColor   = (selectedObj?.type === 'text' ? selectedObj.fontColor  : undefined) ?? textColor;
  const activeTextSize    = (selectedObj?.type === 'text' ? selectedObj.fontSize   : undefined) ?? textSize;
  const activeFontFamily  = (selectedObj?.type === 'text' ? selectedObj.fontFamily : undefined) ?? textFont;
  const activeIsBold      = selectedObj?.type === 'text' ? !!selectedObj.isBold      : false;
  const activeIsItalic    = selectedObj?.type === 'text' ? !!selectedObj.isItalic    : false;
  const activeIsUnderline = selectedObj?.type === 'text' ? !!selectedObj.isUnderline : false;
  const activeAlign       = selectedObj?.type === 'text' ? (selectedObj.align || 'left') : 'left';

  const applyText = (updates) => {
    if (updates.fontColor  !== undefined) setTextColor(updates.fontColor);
    if (updates.fontSize   !== undefined) setTextSize(updates.fontSize);
    if (updates.fontFamily !== undefined) setTextFont(updates.fontFamily);
    if (selectedId && selectedObj?.type === 'text') updateObject(selectedId, updates);
  };

  // ── shape ─────────────────────────────────────────────────────────────────
  const activeShapeType   = (selectedObj?.type === 'shape' ? selectedObj.shapeType : undefined) ?? shapeType;
  const activeShapeSides  = (selectedObj?.type === 'shape' ? selectedObj.sides     : undefined) ?? shapeSides;
  const activeShapeStroke = (selectedObj?.type === 'shape' ? selectedObj.stroke    : undefined) ?? shapeStroke;
  const activeShapeFill   = (selectedObj?.type === 'shape' ? selectedObj.fill      : undefined) ?? shapeFill;

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
    activeShapeFill === 'transparent'                                 ? 'none'
    : (activeShapeFill.length > 7 && activeShapeFill.endsWith('26')) ? 'light'
    : 'solid';

  // ── sticky note ───────────────────────────────────────────────────────────
  const activeStickyBg        = (selectedObj?.type === 'sticky' ? selectedObj.color      : undefined) ?? stickyColor;
  const activeStickyFontColor = (selectedObj?.type === 'sticky' ? selectedObj.fontColor  : undefined) ?? '#1f2937';
  const activeStickyFont      = (selectedObj?.type === 'sticky' ? selectedObj.fontFamily : undefined) ?? 'Inter';
  const activeStickySize      = (selectedObj?.type === 'sticky' ? selectedObj.fontSize   : undefined) ?? 18;
  const activeStickyBold      = selectedObj?.type === 'sticky' ? !!selectedObj.isBold      : false;
  const activeStickyItalic    = selectedObj?.type === 'sticky' ? !!selectedObj.isItalic    : false;
  const activeStickyUnderline = selectedObj?.type === 'sticky' ? !!selectedObj.isUnderline : false;
  const activeStickyAlign     = selectedObj?.type === 'sticky' ? (selectedObj.align || 'center') : 'center';

  const applySticky = (updates) => {
    if (updates.color !== undefined) setStickyColor(updates.color);
    if (selectedId && selectedObj?.type === 'sticky') updateObject(selectedId, updates);
  };

  // ── ui helpers ────────────────────────────────────────────────────────────
  const headerLabel = showPencil ? 'Pencil' : showText ? 'Text' : showShape ? 'Shape' : 'Sticky Note';
  const ToolIcon    = showPencil ? Pen : showText ? Type : showShape ? Shapes : StickyNote;

  const colorDot = (color, isActive, onClick) => (
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

  const fmtBtn = (active) =>
    `rounded-lg border flex items-center justify-center transition-all disabled:opacity-40 ${
      active
        ? 'bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800'
        : 'bg-white dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800'
    }`;

  const vbar = <div className="w-px h-6 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />;
  const hbar = <div className="h-px bg-zinc-100 dark:bg-zinc-800 my-0.5" />;

  const FormatRow = ({ getActive, getAlign, onToggle, onAlign, onFont, activeFont, disabled }) => (
    <div className="flex items-center gap-1 flex-wrap">
      {[
        { icon: Bold,      key: 'isBold'      },
        { icon: Italic,    key: 'isItalic'    },
        { icon: Underline, key: 'isUnderline' },
      ].map(({ icon: Icon, key }) => (
        <button key={key} disabled={disabled}
          onClick={() => onToggle(key)}
          className={`w-9 h-9 ${fmtBtn(getActive(key))}`}>
          <Icon className="w-4 h-4" />
        </button>
      ))}

      {vbar}

      {[
        { icon: AlignLeft,   val: 'left'   },
        { icon: AlignCenter, val: 'center' },
        { icon: AlignRight,  val: 'right'  },
      ].map(({ icon: Icon, val }) => (
        <button key={val} disabled={disabled}
          onClick={() => onAlign(val)}
          className={`w-9 h-9 ${fmtBtn(getAlign() === val)}`}>
          <Icon className="w-4 h-4" />
        </button>
      ))}

      {vbar}

      {fontOptions.map((f) => (
        <button key={f.value} disabled={disabled}
          onClick={() => onFont(f.value)}
          style={{ fontFamily: f.value }}
          className={`px-2.5 h-9 text-[11px] font-semibold ${fmtBtn(activeFont === f.value)}`}>
          {f.label}
        </button>
      ))}
    </div>
  );

  // ── collapsed: small circle on the left edge ───────────────────────────────
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        style={{ left: '16px', bottom: '16px' }}
        className="fixed z-40 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-purple-500 hover:scale-110 active:scale-95 transition-transform pointer-events-auto"
        title={`Expand ${headerLabel} properties`}
      >
        <ToolIcon className="w-4 h-4" />
      </button>
    );
  }

  // ── panel positioning: default = bottom-center, after drag = top/left ──────
  const panelStyle = pos
    ? { left: pos.x, top: pos.y }
    : { bottom: '1rem', left: '50%', transform: 'translateX(-50%)' };

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="fixed z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-3 flex flex-col gap-2.5 w-[min(95vw,480px)] pointer-events-auto animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header — drag handle + collapse button */}
      <div
        className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={onHeaderPointerDown}
      >
        <ToolIcon className="w-3.5 h-3.5 text-purple-500 dark:text-purple-400" />
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 font-mono flex-1">
          {headerLabel}
        </span>
        <button
          data-nodrag="true"
          onClick={() => setCollapsed(true)}
          className="w-6 h-6 flex items-center justify-center rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
          title="Minimize"
        >
          <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {hbar}

      {/* ── PENCIL ── */}
      {showPencil && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 w-7 shrink-0">Size</span>
            <input type="range" min="1" max="20" value={pencilWidth}
              onChange={(e) => setPencilWidth(parseInt(e.target.value))}
              className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600" />
            <span className="text-[11px] font-mono text-zinc-500 w-8 text-right">{pencilWidth}px</span>
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {colorPalette.map((c) => colorDot(c, pencilColor.toLowerCase() === c.toLowerCase(), () => setPencilColor(c)))}
          </div>
        </div>
      )}

      {/* ── TEXT ── */}
      {showText && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-semibold text-zinc-400 w-7 shrink-0">Size</span>
            <input type="range" min="12" max="80" value={activeTextSize}
              onChange={(e) => applyText({ fontSize: parseInt(e.target.value) })}
              className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600" />
            <span className="text-[11px] font-mono text-zinc-500 w-8 text-right">{activeTextSize}px</span>
          </div>

          <FormatRow
            getActive={(k) => ({ isBold: activeIsBold, isItalic: activeIsItalic, isUnderline: activeIsUnderline }[k])}
            getAlign={() => activeAlign}
            onToggle={(k) => selectedId && selectedObj?.type === 'text' && applyText({ [k]: !({ isBold: activeIsBold, isItalic: activeIsItalic, isUnderline: activeIsUnderline }[k]) })}
            onAlign={(v) => selectedId && selectedObj?.type === 'text' && applyText({ align: v })}
            onFont={(v) => applyText({ fontFamily: v })}
            activeFont={activeFontFamily}
            disabled={!selectedId || selectedObj?.type !== 'text'}
          />

          <div className="flex gap-1.5 flex-wrap">
            {colorPalette.map((c) => colorDot(c, activeTextColor.toLowerCase() === c.toLowerCase(), () => applyText({ fontColor: c })))}
          </div>
        </div>
      )}

      {/* ── SHAPE ── */}
      {showShape && (
        <div className="flex flex-col gap-2">
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
                        ? { shapeType: 'polygon', sides: s.sides } : { shapeType: s.id });
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
                colorDot(c, activeShapeStroke.toLowerCase() === c.toLowerCase(),
                  () => applyShape(c, deriveFill(currentFillChoice === 'none' ? 'none' : currentFillChoice)))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── STICKY NOTE ── */}
      {showSticky && (
        <div className="flex flex-col gap-2">

          {/* Row 1: BG swatches · size slider — all inline */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex gap-1 shrink-0">
              {STICKY_BG_COLORS.map(({ hex }) => (
                <button key={hex} onClick={() => applySticky({ color: hex })}
                  style={{ backgroundColor: hex }}
                  className={`w-6 h-6 rounded-lg border-2 transition-all ${
                    activeStickyBg.toLowerCase() === hex.toLowerCase()
                      ? 'border-zinc-800 dark:border-white scale-110 ring-2 ring-purple-500/40'
                      : 'border-zinc-300 dark:border-zinc-600 hover:scale-105'
                  }`}
                />
              ))}
            </div>
            {vbar}
            <span className="text-[10px] font-semibold text-zinc-400 shrink-0">Size</span>
            <input type="range" min="10" max="48" value={activeStickySize}
              onChange={(e) => applySticky({ fontSize: parseInt(e.target.value) })}
              className="flex-1 min-w-[80px] h-1.5 bg-zinc-200 dark:bg-zinc-700 rounded-full appearance-none cursor-pointer accent-purple-600" />
            <span className="text-[11px] font-mono text-zinc-500 w-7 text-right shrink-0">{activeStickySize}px</span>
          </div>

          {/* Row 2: B/I/U | Align | Fonts | text-colour dots — all inline */}
          <div className="flex items-center gap-1 flex-wrap">
            {[
              { icon: Bold,      key: 'isBold',      active: activeStickyBold      },
              { icon: Italic,    key: 'isItalic',    active: activeStickyItalic    },
              { icon: Underline, key: 'isUnderline', active: activeStickyUnderline },
            ].map(({ icon: Icon, key, active }) => (
              <button key={key}
                disabled={!selectedId || selectedObj?.type !== 'sticky'}
                onClick={() => applySticky({ [key]: !active })}
                className={`w-8 h-8 ${fmtBtn(active)}`}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            {vbar}
            {[
              { icon: AlignLeft,   val: 'left'   },
              { icon: AlignCenter, val: 'center' },
              { icon: AlignRight,  val: 'right'  },
            ].map(({ icon: Icon, val }) => (
              <button key={val}
                disabled={!selectedId || selectedObj?.type !== 'sticky'}
                onClick={() => applySticky({ align: val })}
                className={`w-8 h-8 ${fmtBtn(activeStickyAlign === val)}`}>
                <Icon className="w-3.5 h-3.5" />
              </button>
            ))}
            {vbar}
            {fontOptions.map((f) => (
              <button key={f.value}
                disabled={!selectedId || selectedObj?.type !== 'sticky'}
                onClick={() => applySticky({ fontFamily: f.value })}
                style={{ fontFamily: f.value }}
                className={`px-2 h-8 text-[10px] font-semibold ${fmtBtn(activeStickyFont === f.value)}`}>
                {f.label}
              </button>
            ))}
            {vbar}
            {colorPalette.map((c) =>
              colorDot(c, activeStickyFontColor.toLowerCase() === c.toLowerCase(), () => applySticky({ fontColor: c }))
            )}
          </div>

        </div>
      )}
    </div>
  );
}
