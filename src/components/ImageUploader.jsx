import { useState, useEffect, useCallback } from 'react';
import { useBoardStore } from '../store/boardStore';
import { Upload } from 'lucide-react';

export default function ImageUploader() {
  const { addObject, scale, position } = useBoardStore();
  const [isDragging, setIsDragging] = useState(false);

  // Helper to read and add image to board
  const processImageFile = useCallback((file, clientX, clientY) => {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        // Set reasonable boundaries
        const maxDim = 400;
        let w = img.width;
        let h = img.height;
        if (w > maxDim || h > maxDim) {
          const ratio = Math.min(maxDim / w, maxDim / h);
          w *= ratio;
          h *= ratio;
        }

        // Calculate drop coordinates on canvas relative to zoom/pan
        let canvasX, canvasY;
        if (clientX !== undefined && clientY !== undefined) {
          canvasX = (clientX - position.x) / scale;
          canvasY = (clientY - position.y) / scale;
        } else {
          canvasX = (window.innerWidth / 2 - position.x) / scale;
          canvasY = (window.innerHeight / 2 - position.y) / scale;
        }

        addObject({
          type: 'image',
          src: event.target.result,
          x: canvasX - w / 2,
          y: canvasY - h / 2,
          width: w,
          height: h,
          rotation: 0,
          scaleX: 1,
          scaleY: 1,
        });
      };
    };
    reader.readAsDataURL(file);
  }, [addObject, scale, position]);

  useEffect(() => {
    // 1. Drag & Drop Handlers
    const handleDragOver = (e) => {
      e.preventDefault();
      // Only show overlay if there are files in the drag
      if (e.dataTransfer.types.includes('Files')) {
        setIsDragging(true);
      }
    };

    const handleDragLeave = (e) => {
      e.preventDefault();
      setIsDragging(false);
    };

    const handleDrop = (e) => {
      e.preventDefault();
      setIsDragging(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const file = e.dataTransfer.files[0];
        processImageFile(file, e.clientX, e.clientY);
      }
    };

    // 2. Paste Handler (Ctrl + V)
    const handlePaste = (e) => {
      // Don't intercept paste if editing inside an input/textarea
      const target = e.target;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      if (e.clipboardData && e.clipboardData.files && e.clipboardData.files.length > 0) {
        e.preventDefault();
        const file = e.clipboardData.files[0];
        processImageFile(file);
      }
    };

    window.addEventListener('dragover', handleDragOver);
    window.addEventListener('dragleave', handleDragLeave);
    window.addEventListener('drop', handleDrop);
    window.addEventListener('paste', handlePaste);

    return () => {
      window.removeEventListener('dragover', handleDragOver);
      window.removeEventListener('dragleave', handleDragLeave);
      window.removeEventListener('drop', handleDrop);
      window.removeEventListener('paste', handlePaste);
    };
  }, [processImageFile]);

  if (!isDragging) return null;

  return (
    <div className="fixed inset-0 bg-purple-600/10 dark:bg-purple-500/10 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none transition-all duration-300">
      <div className="bg-white/90 dark:bg-zinc-900/90 border-2 border-dashed border-purple-500 rounded-3xl p-8 flex flex-col items-center gap-3 shadow-2xl animate-in scale-in duration-200">
        <div className="w-16 h-16 bg-purple-100 dark:bg-purple-950/50 rounded-2xl flex items-center justify-center text-purple-600 dark:text-purple-400">
          <Upload className="w-8 h-8 animate-bounce" />
        </div>
        <div className="text-center">
          <h3 className="font-bold text-lg text-zinc-800 dark:text-zinc-100">Drop Image File</h3>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
            Supports PNG, JPG, or SVG drawings
          </p>
        </div>
      </div>
    </div>
  );
}
