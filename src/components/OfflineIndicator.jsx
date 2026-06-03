import { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

export default function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    const handleOffline = () => {
      setOffline(true);
      setShowOnline(false);
    };
    const handleOnline = () => {
      setOffline(false);
      setShowOnline(true);
      setTimeout(() => setShowOnline(false), 3000);
    };
    window.addEventListener('offline', handleOffline);
    window.addEventListener('online',  handleOnline);
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online',  handleOnline);
    };
  }, []);

  if (!offline && !showOnline) return null;

  return (
    <div
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2 rounded-xl shadow-xl border text-[13px] font-medium pointer-events-none select-none
        animate-in slide-in-from-top-2 duration-300
        ${offline
          ? 'bg-zinc-900/95 dark:bg-zinc-950/95 text-zinc-100 border-zinc-700'
          : 'bg-emerald-600/95 text-white border-emerald-500'
        }`}
    >
      {offline ? (
        <>
          <WifiOff className="w-4 h-4 shrink-0" />
          <span>Offline — your drawings are saved locally</span>
        </>
      ) : (
        <>
          <Wifi className="w-4 h-4 shrink-0" />
          <span>Back online</span>
        </>
      )}
    </div>
  );
}
