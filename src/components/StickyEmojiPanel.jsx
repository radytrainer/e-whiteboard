import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useBoardStore } from '../store/boardStore';

const EMOJI_MOOD  = ['😊','😄','😍','😢','😡','😎','🤔','😅','🎉','💪'];
const EMOJI_MARKS = ['❤️','⭐','🔥','💡','✅','❌','📌','🎯','👍','💯'];

export default function StickyEmojiPanel() {
  const [collapsed, setCollapsed] = useState(false);
  const [pos, setPos] = useState(null); // null = default bottom-left
  const panelRef = useRef(null);
  const dragOrigin = useRef(null);

  const { tool, selectedId, objects, updateObject } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  const showSticky = tool === 'sticky' || (tool === 'select' && selectedObj?.type === 'sticky');

  useEffect(() => {
    setCollapsed(false);
  }, [tool, selectedId]);

  const onHeaderPointerDown = useCallback((e) => {
    if (e.button !== 0) return;
    if (e.target.closest('[data-nodrag]')) return;
    e.preventDefault();
    const rect = panelRef.current.getBoundingClientRect();
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

  if (!showSticky) return null;

  const disabled = !selectedId || selectedObj?.type !== 'sticky';

  const insertEmoji = (emoji) => {
    if (disabled) return;
    updateObject(selectedId, { text: (selectedObj.text || '') + emoji });
  };

  // ── collapsed: small circle on the left, slightly below the main panel circle
  if (collapsed) {
    return (
      <button
        onClick={() => setCollapsed(false)}
        style={{ left: '8px', top: 'calc(50% + 52px)', transform: 'translateY(-50%)' }}
        className="fixed z-40 w-10 h-10 rounded-full bg-white/95 dark:bg-zinc-900/95 shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 flex items-center justify-center text-lg hover:scale-110 active:scale-95 transition-transform pointer-events-auto"
        title="Expand emoji panel"
      >
        😊
      </button>
    );
  }

  const panelStyle = pos
    ? { left: pos.x, top: pos.y }
    : { bottom: '1rem', left: '8px' };

  return (
    <div
      ref={panelRef}
      style={panelStyle}
      className="fixed z-40 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50 p-2.5 flex flex-col gap-1.5 pointer-events-auto animate-in slide-in-from-bottom-4 duration-200"
    >
      {/* Header — drag handle */}
      <div
        className="flex items-center gap-1.5 cursor-grab active:cursor-grabbing select-none touch-none"
        onPointerDown={onHeaderPointerDown}
      >
        <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 font-mono flex-1">
          Emoji
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

      <div className="h-px bg-zinc-100 dark:bg-zinc-800" />

      {[
        { label: 'Mood',  emojis: EMOJI_MOOD  },
        { label: 'Marks', emojis: EMOJI_MARKS },
      ].map(({ label, emojis }) => (
        <div key={label} className="flex items-center gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-wide text-zinc-400 dark:text-zinc-500 w-8 shrink-0">
            {label}
          </span>
          {emojis.map((emoji) => (
            <button
              key={emoji}
              onClick={() => insertEmoji(emoji)}
              disabled={disabled}
              title={`Add ${emoji}`}
              className="w-7 h-7 flex items-center justify-center text-sm rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors disabled:opacity-30 active:scale-90"
            >
              {emoji}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
}
