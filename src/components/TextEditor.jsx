import { useEffect, useRef } from 'react';

export default function TextEditor({
  text,
  x,
  y,
  width,
  height,
  scale,
  position,
  rotation,
  scaleX = 1,
  scaleY = 1,
  fontSize,
  fontFamily,
  fontColor,
  isBold,
  isItalic,
  isUnderline,
  align,
  onChange,
  onBlur,
}) {
  const textareaRef = useRef(null);

  // Position calculation relative to relative parent container
  const editorLeft = x * scale + position.x;
  const editorTop = y * scale + position.y;

  // Visual boundaries matching stage zoom and transformer scale
  const baseWidth = width * scaleX;
  const baseHeight = height * scaleY;

  // Auto-focus and select all text on open
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      // Select all text if it is default placeholder text
      if (textareaRef.current.value === 'Type text here' || textareaRef.current.value === 'Double click to edit') {
        textareaRef.current.select();
      } else {
        // Otherwise, move cursor to the end
        const valLength = textareaRef.current.value.length;
        textareaRef.current.setSelectionRange(valLength, valLength);
      }
    }
  }, []);

  // Dynamically auto-resize textarea width and height to fit the text
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset dimensions temporarily to measure scrollHeight/scrollWidth correctly
      textarea.style.height = 'auto';
      textarea.style.width = 'auto';
      
      const newHeight = Math.max(textarea.scrollHeight + 5, baseHeight * scale, 40);
      const newWidth = Math.max(textarea.scrollWidth + 20, baseWidth * scale, 120);

      textarea.style.height = `${newHeight}px`;
      textarea.style.width = `${newWidth}px`;
    }
  }, [text, scale, baseWidth, baseHeight]);

  // Handle Math Toolbar symbols insertion
  useEffect(() => {
    const handleMathInsert = (e) => {
      const { symbol } = e.detail;
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentText = textarea.value;

      const newText = currentText.substring(0, start) + symbol + currentText.substring(end);
      onChange(newText);

      // Prevent default canvas action of creating a new text object
      e.stopImmediatePropagation();

      // Reposition cursor after symbol
      setTimeout(() => {
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + symbol.length;
      }, 50);
    };

    window.addEventListener('insert-math-symbol', handleMathInsert, { capture: true });
    return () => {
      window.removeEventListener('insert-math-symbol', handleMathInsert, { capture: true });
    };
  }, [onChange]);

  // Handle keybindings:
  // - Escape saves/blurs
  // - Ctrl+Enter / Cmd+Enter saves/blurs
  // - Enter alone types a normal newline
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      onBlur();
    } else if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      onBlur();
    }
  };

  const currentFontSize = fontSize * scale * scaleY;

  return (
    <textarea
      ref={textareaRef}
      value={text}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      onKeyDown={handleKeyDown}
      style={{
        position: 'absolute',
        left: `${editorLeft}px`,
        top: `${editorTop}px`,
        fontSize: `${currentFontSize}px`,
        fontFamily: fontFamily === 'Inter' ? "'Inter', 'Kantumruy Pro', sans-serif" : fontFamily,
        color: fontColor,
        fontWeight: isBold ? 'bold' : 'normal',
        fontStyle: isItalic ? 'italic' : 'normal',
        textDecoration: isUnderline ? 'underline' : 'none',
        textAlign: align || 'left',
        transform: `rotate(${rotation || 0}deg)`,
        transformOrigin: 'top left',
        background: 'transparent',
        border: '1px dashed #aa3bff',
        outline: 'none',
        resize: 'none',
        overflow: 'hidden',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        zIndex: 50,
        padding: 0,
        margin: 0,
        lineHeight: 1.2,
      }}
      className="p-0.5 select-text shadow-sm"
    />
  );
}
