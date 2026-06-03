import { useState, useEffect, useRef } from 'react';
import Canvas from './components/Canvas';
import Toolbar from './components/Toolbar';
import MathToolbar from './components/MathToolbar';
import FormulaPanel from './components/FormulaPanel';
import SettingsPanel from './components/SettingsPanel';
import ImageUploader from './components/ImageUploader';
import BottomActions from './components/BottomActions';
import BottomPropertiesPanel from './components/BottomPropertiesPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useBoardStore } from './store/boardStore';
import { exportPNG } from './utils/exportPNG';
import { exportPDF } from './utils/exportPDF';
import {
  Download,
  Sigma,
  Zap,
  FlaskConical,
  Dna,
  Grid3x3,
  Settings as SettingsIcon,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Trash2,
  X,
  CheckSquare,
} from 'lucide-react';

// Floating action bar that appears on mobile/tablet when objects are selected.
// Gives touch users a visible Delete button (no keyboard Delete key on mobile).
function SelectionBar() {
  const { selectedIds, selectedId, deleteObject, setSelectedIds, setSelectedId, tool, objects, selectAll } = useBoardStore();
  const count = selectedIds.length > 1 ? selectedIds.length : selectedId ? 1 : 0;

  if (tool !== 'select' || count === 0) return null;

  const handleDelete = () => {
    deleteObject();
  };

  const handleDeselect = () => {
    setSelectedIds([]);
    setSelectedId(null);
  };

  return (
    <div className="flex items-center gap-1.5 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md rounded-2xl shadow-xl border border-zinc-200/50 dark:border-zinc-800/50 px-3 py-2 pointer-events-auto animate-in slide-in-from-bottom-4 duration-200">
      {/* Count badge */}
      <span className="text-xs font-semibold text-zinc-500 dark:text-zinc-400 select-none whitespace-nowrap">
        {count} item{count !== 1 ? 's' : ''} selected
      </span>

      <div className="w-px h-4 bg-zinc-200 dark:bg-zinc-700 mx-0.5" />

      {/* Select All (if not already all selected) */}
      {count < objects.length && (
        <button
          onClick={selectAll}
          title="Select all"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">All</span>
        </button>
      )}

      {/* Delete */}
      <button
        onClick={handleDelete}
        title="Delete selected (Del)"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-xs font-semibold border border-red-200 dark:border-red-800 hover:bg-red-100 dark:hover:bg-red-950/50 active:scale-95 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
        Delete
      </button>

      {/* Deselect */}
      <button
        onClick={handleDeselect}
        title="Deselect"
        className="w-7 h-7 flex items-center justify-center rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default function App() {
  const { theme } = useBoardStore();
  const stageRef = useRef(null);

  const [notification, setNotification] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
  };

  const [formulaSubject, setFormulaSubject] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);

  const exportTitle = 'whiteboard';

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  useKeyboardShortcuts(showNotification);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = () => setIsExportDropdownOpen(false);
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Close all floating panels when the user clicks on blank canvas
  useEffect(() => {
    const handleCanvasEmptyClick = () => {
      setFormulaSubject(null);
      setIsSettingsOpen(false);
      setIsExportDropdownOpen(false);
    };
    window.addEventListener('canvas-empty-click', handleCanvasEmptyClick);
    return () => window.removeEventListener('canvas-empty-click', handleCanvasEmptyClick);
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      <ImageUploader />

      {notification && (
        <div className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-top duration-300 dark:bg-purple-500">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>{notification}</span>
        </div>
      )}

      <div className="fixed top-4 right-4 z-40 flex flex-col items-center gap-0 transition-all duration-300">
        <button
          onClick={() => setIsNavOpen(!isNavOpen)}
          title={isNavOpen ? 'Collapse Menu' : 'Expand Menu'}
          className="mb-1.5 rounded-full border border-zinc-200/50 bg-white/90 p-1.5 text-zinc-400 shadow-lg backdrop-blur-md transition-all hover:text-purple-600 dark:border-zinc-800/50 dark:bg-zinc-900/90 dark:hover:text-purple-400"
        >
          <ChevronDown className={`h-3.5 w-3.5 transition-transform duration-200 ${isNavOpen ? 'rotate-0' : 'rotate-180'}`} />
        </button>

        <div
          className={`flex origin-top flex-col items-center gap-2 rounded-2xl border border-zinc-200/50 bg-white/85 p-2 shadow-xl backdrop-blur-md transition-all duration-300 dark:border-zinc-800/50 dark:bg-zinc-900/85 ${
            isNavOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none h-0 scale-y-0 overflow-hidden p-0 opacity-0'
          }`}
        >
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExportDropdownOpen(!isExportDropdownOpen);
              }}
              title="Export Canvas"
              className="flex cursor-pointer items-center justify-center rounded-xl bg-purple-600 p-2.5 font-medium text-white shadow-md shadow-purple-500/10 transition-all hover:bg-purple-700 focus:outline-none"
            >
              <Download className="h-5 w-5" />
            </button>

            {isExportDropdownOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-full top-0 z-50 mr-2 flex w-52 flex-col gap-1 rounded-2xl border border-zinc-200/50 bg-white p-2 shadow-2xl animate-in slide-in-from-right-2 duration-150 dark:border-zinc-800/50 dark:bg-zinc-900"
              >
                <div className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Images (PNG)
                </div>
                <button
                  onClick={() => {
                    exportPNG(stageRef.current, { transparent: false, fileName: `${exportTitle}.png` });
                    showNotification('PNG image downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Standard Whiteboard
                </button>
                <button
                  onClick={() => {
                    exportPNG(stageRef.current, { transparent: true, fileName: `${exportTitle}_transparent.png` });
                    showNotification('Transparent PNG downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Transparent Gridless
                </button>

                <div className="my-1 h-[1px] bg-zinc-100 dark:bg-zinc-800" />

                <div className="px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Documents (PDF)
                </div>
                <button
                  onClick={() => {
                    exportPDF(stageRef.current, { fileName: `${exportTitle}.pdf`, multiPage: false });
                    showNotification('PDF document downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Single Page (A4 Landscape)
                </button>
                <button
                  onClick={() => {
                    exportPDF(stageRef.current, { fileName: `${exportTitle}_notebook.pdf`, multiPage: true });
                    showNotification('Multi-page A4 PDF downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Multi-Page Lesson (3 Pages)
                </button>
              </div>
            )}
          </div>

          <div className="my-1 h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />

          {[
            { id: 'math',     icon: Sigma,        color: 'text-purple-600 dark:text-purple-400', title: 'Math Formula' },
            { id: 'physics',  icon: Zap,          color: 'text-blue-600 dark:text-blue-400',     title: 'Physics Formula' },
            { id: 'chemistry',icon: FlaskConical, color: 'text-emerald-600 dark:text-emerald-400',title: 'Chemistry Formula' },
            { id: 'biology',  icon: Dna,          color: 'text-amber-600 dark:text-amber-400',   title: 'Biology Formula' },
            { id: 'periodic', icon: Grid3x3,      color: 'text-emerald-600 dark:text-emerald-400',title: 'Periodic Table' },
          ].map((s) => {
            const Icon = s.icon;
            const isActive = formulaSubject === s.id;
            return (
              <button
                key={s.id}
                onClick={() => {
                  setFormulaSubject(isActive ? null : s.id);
                  setIsSettingsOpen(false);
                }}
                title={s.title}
                className={`cursor-pointer rounded-xl border p-2.5 transition-all focus:outline-none ${
                  isActive
                    ? 'border-zinc-300 bg-zinc-100 shadow-inner dark:border-zinc-700 dark:bg-zinc-800'
                    : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? s.color : ''}`} />
              </button>
            );
          })}

          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setFormulaSubject(null);
            }}
            title="Appearance Settings"
            className={`cursor-pointer rounded-xl border p-2.5 transition-all focus:outline-none ${
              isSettingsOpen
                ? 'border-purple-200 bg-purple-100 text-purple-600 shadow-inner dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
            }`}
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="fixed top-3 left-4 z-40">
        <img src="/rady-logo.png" alt="logo" className="h-11 w-auto rounded-xl shadow-sm object-contain" />
      </div>

      <aside
        className={`fixed left-0 top-24 bottom-24 z-30 flex items-center pointer-events-none transition-all duration-300 ${
          isToolbarOpen ? 'translate-x-4' : '-translate-x-full'
        }`}
      >
        <div className="pointer-events-auto">
          <Toolbar />
        </div>
      </aside>

      <button
        onClick={() => setIsToolbarOpen(!isToolbarOpen)}
        title={isToolbarOpen ? 'Hide Toolbar' : 'Show Toolbar'}
        className={`fixed top-1/2 z-30 -translate-y-1/2 cursor-pointer border border-zinc-200/50 bg-white/90 p-1.5 text-zinc-400 shadow-lg backdrop-blur-md transition-all hover:text-purple-600 dark:border-zinc-800/50 dark:bg-zinc-900/90 dark:hover:text-purple-400 ${
          isToolbarOpen ? 'left-[72px] rounded-r-lg border-l-0' : 'left-0 rounded-r-lg'
        }`}
      >
        {isToolbarOpen ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
      </button>

      <FormulaPanel subject={formulaSubject} onClose={() => setFormulaSubject(null)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <main className="relative z-10 h-full w-full flex-1">
        <Canvas stageRef={stageRef} />
      </main>

      <footer className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5 pointer-events-none">
        {/* Selection actions bar — visible when items are selected (mobile delete) */}
        <SelectionBar />
        <div className="pointer-events-auto">
          <MathToolbar />
        </div>
      </footer>

      {/* Self-positioned draggable/collapsible property panels */}
      <BottomPropertiesPanel />

      <div className="fixed bottom-4 right-4 z-30 pointer-events-auto">
        <BottomActions />
      </div>
    </div>
  );
}
