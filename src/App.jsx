import { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import MathToolbar from './components/MathToolbar';
import FormulaPanel from './components/FormulaPanel';
import SettingsPanel from './components/SettingsPanel';
import ImageUploader from './components/ImageUploader';
import InspectorPanel from './components/InspectorPanel';
import BottomActions from './components/BottomActions';
import ColorBar from './components/ColorBar';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useBoardStore } from './store/boardStore';
import { exportPNG } from './utils/exportPNG';
import { exportPDF } from './utils/exportPDF';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Download, 
  BookOpen, 
  Settings as SettingsIcon, 
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

export default function App() {
  const {
    theme,
    scale,
    setScale,
    resetView
  } = useBoardStore();

  const stageRef = useRef(null);

  // Panel Toggles
  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  
  // Title of Whiteboard
  const [title, setTitle] = useState(() => {
    return localStorage.getItem('math-khmer-whiteboard-title') || 'គណិតវិទ្យា និងភាសាខ្មែរ - Lesson 1';
  });

  // Notification Banner State
  const [notification, setNotification] = useState(null);

  const showNotification = (message) => {
    setNotification(message);
  };

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  // Hook up global keyboard shortcuts
  useKeyboardShortcuts(showNotification);

  // Sync theme class to document element
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle outside click to close dropdowns
  useEffect(() => {
    const handleOutsideClick = () => {
      setIsExportDropdownOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    localStorage.setItem('math-khmer-whiteboard-title', newTitle);
  };

  const handleZoomIn = () => {
    const newScale = Math.min(15, scale * 1.15);
    setScale(newScale);
  };

  const handleZoomOut = () => {
    const newScale = Math.max(0.15, scale / 1.15);
    setScale(newScale);
  };

  const handleResetZoom = () => {
    resetView();
    showNotification('Stage view reset');
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      
      {/* Background Image / Drag Drop Overlay helper */}
      <ImageUploader />

      {/* Polish Notification Toast */}
      {notification && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-purple-600 dark:bg-purple-500 text-white text-xs font-semibold px-4 py-2 rounded-full shadow-2xl animate-in slide-in-from-top duration-300 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>{notification}</span>
        </div>
      )}

      {/* FLOATING TITLE & LOGO CARD (TOP LEFT) */}
      <div className="fixed top-4 left-4 h-16 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl px-4 flex items-center gap-3 z-40 transition-all duration-300">
        <div className="w-10 h-10 bg-purple-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-purple-500/25">
          <span className="font-extrabold text-xl font-sans">អ</span>
        </div>
        <div className="flex flex-col">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Enter lesson title..."
            className="bg-transparent font-bold text-sm md:text-md outline-none border-b border-transparent hover:border-zinc-300 dark:hover:border-zinc-700 focus:border-purple-500 transition-all font-sans px-1 text-zinc-800 dark:text-zinc-100"
          />
          <span className="text-[10px] text-zinc-400 dark:text-zinc-500 px-1 font-mono">Offline-first • auto-saving</span>
        </div>
      </div>

      {/* FLOATING ACTION NAVBAR (TOP RIGHT) */}
      <div className="fixed top-4 right-4 z-40 flex flex-col gap-2 bg-white/85 dark:bg-zinc-900/85 backdrop-blur-md rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl p-2 items-center">
        {/* Export Dropdown */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExportDropdownOpen(!isExportDropdownOpen);
            }}
            title="Export Canvas"
            className="p-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-medium transition-all shadow-md shadow-purple-500/10 focus:outline-none flex items-center justify-center cursor-pointer"
          >
            <Download className="w-5 h-5" />
          </button>

          {isExportDropdownOpen && (
            <div 
              onClick={(e) => e.stopPropagation()} 
              className="absolute right-full top-0 mr-2 w-52 bg-white dark:bg-zinc-900 border border-zinc-200/50 dark:border-zinc-800/50 rounded-2xl shadow-2xl p-2 z-50 flex flex-col gap-1 transition-all animate-in slide-in-from-right-2 duration-150"
            >
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                Images (PNG)
              </div>
              <button
                onClick={() => {
                  exportPNG(stageRef.current, { transparent: false, fileName: `${title}.png` });
                  showNotification('PNG image downloaded');
                  setIsExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all cursor-pointer"
              >
                Standard Whiteboard
              </button>
              <button
                onClick={() => {
                  exportPNG(stageRef.current, { transparent: true, fileName: `${title}_transparent.png` });
                  showNotification('Transparent PNG downloaded');
                  setIsExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all cursor-pointer"
              >
                Transparent Gridless
              </button>
              
              <div className="h-[1px] bg-zinc-100 dark:bg-zinc-800 my-1" />

              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 font-mono">
                Documents (PDF)
              </div>
              <button
                onClick={() => {
                  exportPDF(stageRef.current, { fileName: `${title}.pdf`, multiPage: false });
                  showNotification('PDF document downloaded');
                  setIsExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all cursor-pointer"
              >
                Single Page (A4 Landscape)
              </button>
              <button
                onClick={() => {
                  exportPDF(stageRef.current, { fileName: `${title}_notebook.pdf`, multiPage: true });
                  showNotification('Multi-page A4 PDF downloaded');
                  setIsExportDropdownOpen(false);
                }}
                className="w-full text-left px-3 py-2 text-sm text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg transition-all cursor-pointer"
              >
                Multi-Page Lesson (3 Pages)
              </button>
            </div>
          )}
        </div>

        <div className="w-8 h-[1px] bg-zinc-200 dark:bg-zinc-800 my-1" />

        {/* Formulas Panel Trigger */}
        <button
          onClick={() => {
            setIsFormulaOpen(!isFormulaOpen);
            setIsSettingsOpen(false);
          }}
          title="Formula Templates"
          className={`p-2.5 rounded-xl border transition-all focus:outline-none cursor-pointer ${
            isFormulaOpen 
              ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 shadow-inner' 
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <BookOpen className="w-5 h-5" />
        </button>

        {/* Settings Panel Trigger */}
        <button
          onClick={() => {
            setIsSettingsOpen(!isSettingsOpen);
            setIsFormulaOpen(false);
          }}
          title="Appearance Settings"
          className={`p-2.5 rounded-xl border transition-all focus:outline-none cursor-pointer ${
            isSettingsOpen 
              ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800 shadow-inner' 
              : 'bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
          }`}
        >
          <SettingsIcon className="w-5 h-5" />
        </button>
      </div>

      {/* LEFT TOOL BAR FLOAT */}
      <aside className="fixed left-4 top-24 bottom-24 flex flex-col justify-center z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <Toolbar />
        </div>
      </aside>

      {/* RIGHT FLOATING INSPECTOR PANEL */}
      <aside className="fixed right-4 top-24 bottom-24 flex flex-col justify-center z-30 pointer-events-none">
        <div className="pointer-events-auto">
          <InspectorPanel />
        </div>
      </aside>

      {/* RIGHT FLOATING FORMULA AND SETTINGS PANEL */}
      <FormulaPanel isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      {/* WHITEBOARD CANVAS LAYER */}
      <main className="flex-1 w-full h-full relative z-10">
        <Canvas stageRef={stageRef} />
      </main>

      {/* BOTTOM QUICK MATH TOOLBAR & COLOR BAR */}
      <footer className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center gap-2.5">
        <div className="pointer-events-auto">
          <ColorBar />
        </div>
        <div className="pointer-events-auto">
          <MathToolbar />
        </div>
      </footer>

      {/* BOTTOM ACTIONS (UNDO/REDO/DELETE) */}
      <div className="fixed bottom-4 left-4 z-30 pointer-events-auto">
        <BottomActions />
      </div>

      {/* FLOATING ZOOM CONTROLS (BOTTOM RIGHT) */}
      <div className="fixed bottom-4 right-4 z-30 pointer-events-auto flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md p-1 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
        <button
          onClick={handleZoomOut}
          title="Zoom Out (Ctrl + Wheel)"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleResetZoom}
          title="Reset View"
          className="px-2.5 py-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-xs font-mono font-bold text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={handleZoomIn}
          title="Zoom In (Ctrl + Wheel)"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-all focus:outline-none cursor-pointer"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <div className="w-[1px] h-4 bg-zinc-300 dark:bg-zinc-800 mx-0.5" />
        <button
          onClick={handleResetZoom}
          title="Recenter"
          className="p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white transition-all cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
