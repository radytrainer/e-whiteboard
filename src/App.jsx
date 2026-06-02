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
import { useCollaborationSync } from './hooks/useCollaborationSync';
import { useBoardStore } from './store/boardStore';
import { exportPNG } from './utils/exportPNG';
import { exportPDF } from './utils/exportPDF';
import {
  Download,
  BookOpen,
  Settings as SettingsIcon,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  Sparkles,
  Share2,
  Users,
  Copy,
  Check,
} from 'lucide-react';

const DEFAULT_TITLE = 'Math Whiteboard - Lesson 1';
const getDefaultTitleForRoom = (roomId, defaultRoomId, getRoomTitleKey) =>
  localStorage.getItem(getRoomTitleKey(roomId)) ||
  (roomId === defaultRoomId ? DEFAULT_TITLE : `Shared Whiteboard - ${roomId}`);

export default function App() {
  const { theme } = useBoardStore();
  const stageRef = useRef(null);

  const [notification, setNotification] = useState(null);
  const showNotification = (message) => {
    setNotification(message);
  };

  const { roomId, shareLink, syncStatus, setRoomId, sanitizeRoomId, getRoomTitleKey, defaultRoomId } =
    useCollaborationSync({
      onRemoteUpdate: () => showNotification('Whiteboard updated in real time'),
    });

  const [isFormulaOpen, setIsFormulaOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [isNavOpen, setIsNavOpen] = useState(true);
  const [isToolbarOpen, setIsToolbarOpen] = useState(true);
  const [title, setTitle] = useState(() => getDefaultTitleForRoom(roomId, defaultRoomId, getRoomTitleKey));
  const [roomInput, setRoomInput] = useState(roomId);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => setNotification(null), 2500);
    return () => clearTimeout(timer);
  }, [notification]);

  useEffect(() => {
    if (!isCopied) return;
    const timer = setTimeout(() => setIsCopied(false), 1600);
    return () => clearTimeout(timer);
  }, [isCopied]);

  useKeyboardShortcuts(showNotification);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  useEffect(() => {
    const handleOutsideClick = () => {
      setIsExportDropdownOpen(false);
      setIsShareOpen(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    localStorage.setItem(getRoomTitleKey(roomId), newTitle);
  };

  const handleRoomJoin = () => {
    const nextRoomId = sanitizeRoomId(roomInput);
    setRoomId(nextRoomId);
    setRoomInput(nextRoomId);
    setTitle(getDefaultTitleForRoom(nextRoomId, defaultRoomId, getRoomTitleKey));
    showNotification(nextRoomId === defaultRoomId ? 'Opened your solo board' : `Joined room ${nextRoomId}`);
  };

  const handleCopyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      setIsCopied(true);
      showNotification('Share link copied');
    } catch (error) {
      console.error('Unable to copy share link:', error);
      showNotification('Unable to copy share link');
    }
  };

  return (
    <div className="w-screen h-screen flex flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-100 transition-colors duration-300">
      <ImageUploader />

      {notification && (
        <div className="fixed top-24 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-2xl animate-in slide-in-from-top duration-300 dark:bg-purple-500">
          <Sparkles className="h-3.5 w-3.5 animate-spin" />
          <span>{notification}</span>
        </div>
      )}

      <div className="fixed left-1/2 top-4 z-30 -translate-x-1/2 rounded-2xl border border-zinc-200/60 bg-white/88 px-4 py-2 shadow-lg backdrop-blur-md dark:border-zinc-800/60 dark:bg-zinc-900/88">
        <input
          value={title}
          onChange={(e) => handleTitleChange(e.target.value)}
          className="w-[18rem] max-w-[45vw] bg-transparent text-sm font-semibold text-zinc-900 outline-none dark:text-zinc-100"
        />
        <div className="text-[11px] text-zinc-500 dark:text-zinc-400">
          Room: {roomId === defaultRoomId ? 'solo board' : roomId} • {syncStatus}
        </div>
      </div>

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
                setIsShareOpen(false);
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
                    exportPNG(stageRef.current, { transparent: false, fileName: `${title}.png` });
                    showNotification('PNG image downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Standard Whiteboard
                </button>
                <button
                  onClick={() => {
                    exportPNG(stageRef.current, { transparent: true, fileName: `${title}_transparent.png` });
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
                    exportPDF(stageRef.current, { fileName: `${title}.pdf`, multiPage: false });
                    showNotification('PDF document downloaded');
                    setIsExportDropdownOpen(false);
                  }}
                  className="w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-zinc-700 transition-all hover:bg-zinc-50 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                >
                  Single Page (A4 Landscape)
                </button>
                <button
                  onClick={() => {
                    exportPDF(stageRef.current, { fileName: `${title}_notebook.pdf`, multiPage: true });
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

          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsShareOpen(!isShareOpen);
                setIsExportDropdownOpen(false);
              }}
              title="Share Whiteboard"
              className={`cursor-pointer rounded-xl border p-2.5 transition-all focus:outline-none ${
                isShareOpen
                  ? 'border-purple-200 bg-purple-100 text-purple-600 shadow-inner dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                  : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
              }`}
            >
              <Share2 className="h-5 w-5" />
            </button>

            {isShareOpen && (
              <div
                onClick={(e) => e.stopPropagation()}
                className="absolute right-full top-0 z-50 mr-2 flex w-72 flex-col gap-3 rounded-2xl border border-zinc-200/50 bg-white p-3 shadow-2xl animate-in slide-in-from-right-2 duration-150 dark:border-zinc-800/50 dark:bg-zinc-900"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Live collaboration</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400">{syncStatus}</div>
                  </div>
                  <div className="rounded-full bg-purple-100 p-2 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
                    <Users className="h-4 w-4" />
                  </div>
                </div>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Room name</span>
                  <input
                    value={roomInput}
                    onChange={(e) => setRoomInput(e.target.value)}
                    placeholder="algebra-group-a"
                    className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm outline-none focus:border-purple-400 dark:border-zinc-800 dark:bg-zinc-950"
                  />
                </label>

                <button
                  onClick={handleRoomJoin}
                  className="w-full cursor-pointer rounded-xl bg-purple-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700"
                >
                  {roomId === defaultRoomId ? 'Start shared room' : 'Switch room'}
                </button>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400">Share link</span>
                  <div className="flex items-center gap-2">
                    <input
                      readOnly
                      value={shareLink}
                      className="min-w-0 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-xs text-zinc-500 outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400"
                    />
                    <button
                      onClick={handleCopyShareLink}
                      title="Copy link"
                      className="cursor-pointer rounded-xl border border-zinc-200 p-2 text-zinc-600 transition-colors hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800/50"
                    >
                      {isCopied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </label>

                <p className="text-[11px] leading-5 text-zinc-500 dark:text-zinc-400">
                  Open the same room link in another browser tab or window on this app to see updates happen live.
                </p>
              </div>
            )}
          </div>

          <div className="my-1 h-[1px] w-8 bg-zinc-200 dark:bg-zinc-800" />

          <button
            onClick={() => {
              setIsFormulaOpen(!isFormulaOpen);
              setIsSettingsOpen(false);
            }}
            title="Formula Templates"
            className={`cursor-pointer rounded-xl border p-2.5 transition-all focus:outline-none ${
              isFormulaOpen
                ? 'border-purple-200 bg-purple-100 text-purple-600 shadow-inner dark:border-purple-800 dark:bg-purple-950/40 dark:text-purple-400'
                : 'border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
            }`}
          >
            <BookOpen className="h-5 w-5" />
          </button>

          <button
            onClick={() => {
              setIsSettingsOpen(!isSettingsOpen);
              setIsFormulaOpen(false);
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

      <aside className="fixed right-4 top-24 bottom-24 z-30 flex flex-col justify-center pointer-events-none">
        <div className="pointer-events-auto">
          <InspectorPanel />
        </div>
      </aside>

      <FormulaPanel isOpen={isFormulaOpen} onClose={() => setIsFormulaOpen(false)} />
      <SettingsPanel isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />

      <main className="relative z-10 h-full w-full flex-1">
        <Canvas stageRef={stageRef} />
      </main>

      <footer className="fixed bottom-4 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2.5 pointer-events-none">
        <div className="pointer-events-auto">
          <ColorBar />
        </div>
        <div className="pointer-events-auto">
          <MathToolbar />
        </div>
      </footer>

      <div className="fixed bottom-4 right-4 z-30 pointer-events-auto">
        <BottomActions />
      </div>
    </div>
  );
}
