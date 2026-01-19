'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Only check if it is ALREADY installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandaloneMode) {
      setIsStandalone(true);
      return; 
    }

    // REMOVED: The localStorage check. Now it shows every visit.

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    
    // Always show on iOS after delay (unless installed)
    if (isIosDevice) {
      setTimeout(() => setShowPrompt(true), 2000);
    }

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowPrompt(false);
    }
  };

  const handleClose = () => {
    // Just hide it for this session. Do NOT save to localStorage.
    // It will reappear on next reload.
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-2xl md:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="flex items-start justify-between w-full">
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-gray-900">Installer l'application</h3>
          <p className="mt-1 text-sm text-gray-600">
            {isIOS 
              ? "Ajoutez l'app à l'écran d'accueil pour y accéder tout le temps." 
              : "Installez Sabrina pour un accès rapide."}
          </p>
        </div>
        <button 
          onClick={handleClose} 
          className="text-gray-400 hover:text-gray-600 p-2"
        >
          ✕
        </button>
      </div>

      {isIOS ? (
        <div className="w-full mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-100">
          Appuyez sur <span className="font-bold">Partager</span> <span className="text-lg">⍐</span> puis sur <span className="font-bold">Sur l'écran d'accueil</span> <span className="text-lg">➕</span>
        </div>
      ) : (
        <button
          onClick={handleInstallClick}
          className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
        >
          Installer maintenant
        </button>
      )}
    </div>
  );
}