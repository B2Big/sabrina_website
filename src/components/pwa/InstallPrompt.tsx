'use client';
import { useState, useEffect } from 'react';
import { Share, PlusSquare } from 'lucide-react';

// Define the event interface
interface BeforeInstallPromptEvent extends Event {
  prompt: () => void;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // 1. Only check if it is ALREADY installed
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandaloneMode) {
      // Use timeout to avoid sync update warning
      setTimeout(() => setIsStandalone(true), 0);
    } else {
        // Check if dismissed in the last 24h ONLY if not standalone
        const lastDismissed = localStorage.getItem('installPromptDismissed');
        let shouldShow = true;
        
        if (lastDismissed) {
          const timeSinceDismissed = Date.now() - parseInt(lastDismissed, 10);
          const oneDay = 24 * 60 * 60 * 1000;
          if (timeSinceDismissed < oneDay) {
            shouldShow = false;
          }
        }

        if (shouldShow) {
            const userAgent = window.navigator.userAgent.toLowerCase();
            const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
            setIsIOS(isIosDevice);

            const handleBeforeInstallPrompt = (e: Event) => {
              e.preventDefault();
              setDeferredPrompt(e as BeforeInstallPromptEvent);
              setShowPrompt(true);
            };

            window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
            
            // Always show on iOS after delay (unless installed)
            if (isIosDevice) {
              setTimeout(() => setShowPrompt(true), 2000);
            }
            
            return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        }
    }
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
    // Hide and save timestamp to localStorage (24h cooldown)
    localStorage.setItem('installPromptDismissed', Date.now().toString());
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-2xl md:max-w-md animate-in slide-in-from-bottom-5 fade-in duration-500">
      <div className="flex items-start justify-between w-full">
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-gray-900">Installer l&apos;application</h3>
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
        <div className="w-full mt-3 p-2 bg-gray-50 rounded text-sm text-gray-700 border border-gray-100 flex items-center justify-center gap-2">
          <span>Appuyez sur</span> 
          <Share className="w-4 h-4 inline" /> 
          <span>puis sur</span> 
          <span className="font-bold whitespace-nowrap">Sur l&apos;écran d&apos;accueil</span> 
          <PlusSquare className="w-4 h-4 inline" />
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
