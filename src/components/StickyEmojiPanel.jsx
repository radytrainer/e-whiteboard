import { useMemo } from 'react';
import { useBoardStore } from '../store/boardStore';

const EMOJI_MOOD  = ['😊','😄','😍','😢','😡','😎','🤔','😅','🎉','💪'];
const EMOJI_MARKS = ['❤️','⭐','🔥','💡','✅','❌','📌','🎯','👍','💯'];

export default function StickyEmojiPanel() {
  const { tool, selectedId, objects, updateObject } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  const showSticky = tool === 'sticky' || (tool === 'select' && selectedObj?.type === 'sticky');
  if (!showSticky) return null;

  const disabled = !selectedId || selectedObj?.type !== 'sticky';

  const insertEmoji = (emoji) => {
    if (disabled) return;
    updateObject(selectedId, { text: (selectedObj.text || '') + emoji });
  };

  return (
    <div className="
      bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md
      rounded-2xl shadow-2xl border border-zinc-200/50 dark:border-zinc-800/50
      p-2.5 flex flex-col gap-1.5 pointer-events-auto
      animate-in slide-in-from-bottom-4 duration-200
    ">
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
