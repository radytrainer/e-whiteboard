import { useMemo } from 'react';
import { useBoardStore } from '../store/boardStore';

export default function ColorBar() {
  const {
    tool,
    selectedId,
    pencilColor,
    setPencilColor,
    textColor,
    setTextColor,
    shapeStroke,
    setShapeStroke,
    shapeFill,
    setShapeFill,
    stickyColor,
    setStickyColor,
    objects,
    updateObject,
  } = useBoardStore();

  const selectedObj = useMemo(
    () => objects.find((o) => o.id === selectedId),
    [objects, selectedId]
  );

  // Determine if color is applicable for the active context
  const isActiveSticky = tool === 'sticky' || (tool === 'select' && selectedObj?.type === 'sticky');
  const isActiveText = tool === 'text' || (tool === 'select' && selectedObj?.type === 'text');
  const isActiveShape = tool === 'shape' || (tool === 'select' && selectedObj?.type === 'shape');
  const isActivePencil = tool === 'pencil';

  const showColorBar = isActivePencil || isActiveText || isActiveShape || isActiveSticky;

  if (!showColorBar) return null;

  const colorPalette = [
    '#000000', '#aa3bff', '#3b82f6', '#10b981', '#ef4444', '#f59e0b', '#ec4899',
  ];

  const stickyColors = [
    '#fef08a', '#bbf7d0', '#bfdbfe', '#fbcfe8', '#fed7aa'
  ];

  // Active values
  const activeTextColor = (selectedObj?.type === 'text' ? selectedObj.fontColor : undefined) ?? textColor;
  const activeShapeStroke = (selectedObj?.type === 'shape' ? selectedObj.stroke : undefined) ?? shapeStroke;
  const activeShapeFill = (selectedObj?.type === 'shape' ? selectedObj.fill : undefined) ?? shapeFill;
  const activeStickyColor = (selectedObj?.type === 'sticky' ? selectedObj.color : undefined) ?? stickyColor;

  const activeColor = isActiveSticky
    ? activeStickyColor
    : isActiveText
    ? activeTextColor
    : isActiveShape
    ? activeShapeStroke
    : pencilColor;

  const handleColorSelect = (color) => {
    if (isActiveSticky) {
      setStickyColor(color);
      if (selectedId && selectedObj?.type === 'sticky') {
        updateObject(selectedId, { color });
      }
    } else if (isActiveText) {
      setTextColor(color);
      if (selectedId && selectedObj?.type === 'text') {
        updateObject(selectedId, { fontColor: color });
      }
    } else if (isActiveShape) {
      setShapeStroke(color);
      // Update shape fill if it's not transparent
      let newFill = activeShapeFill;
      if (activeShapeFill !== 'transparent') {
        newFill = activeShapeFill.endsWith('26') ? `${color}26` : color;
      }
      setShapeFill(newFill);
      if (selectedId && selectedObj?.type === 'shape') {
        updateObject(selectedId, { stroke: color, fill: newFill });
      }
    } else if (isActivePencil) {
      setPencilColor(color);
    }
  };

  const currentPalette = isActiveSticky ? stickyColors : colorPalette;

  return (
    <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md rounded-full shadow-lg border border-zinc-200/50 dark:border-zinc-800/50 px-4 py-2 flex items-center gap-3 transition-all duration-300 pointer-events-auto">
      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono select-none">
        {isActiveSticky ? 'Note' : isActiveText ? 'Text' : isActiveShape ? 'Shape' : 'Pen'} Color
      </span>
      <div className="flex items-center gap-1.5">
        {currentPalette.map((c) => {
          const isSelected = activeColor.toLowerCase() === c.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => handleColorSelect(c)}
              style={{ backgroundColor: c }}
              className={`w-6 h-6 rounded-full border transition-all duration-150 relative ${
                isSelected
                  ? 'border-zinc-800 dark:border-white scale-110 ring-2 ring-purple-600/40 dark:ring-purple-400/40 shadow-sm'
                  : 'border-zinc-300 dark:border-zinc-700 hover:scale-105 hover:border-zinc-400 dark:hover:border-zinc-500'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
}
