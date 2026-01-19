'use client';
import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    const isStandaloneMode = window.matchMedia('(display-mode: standalone)').matches;
    if (isStandaloneMode) { setIsStandalone(true); return; }

    const hasHidden = localStorage.getItem('hide_install_prompt');
    if (hasHidden) return;

    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    if (isIosDevice) setTimeout(() => setShowPrompt(true), 2000);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') { setDeferredPrompt(null); setShowPrompt(false); }
  };

  const handleClose = () => {
    setShowPrompt(false);
    localStorage.setItem('hide_install_prompt', 'true');
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 flex flex-col items-center justify-between p-4 bg-white border border-gray-200 rounded-lg shadow-2xl md:max-w-md">
      <div className="flex items-start justify-between w-full">
        <div className="flex-1 mr-4">
          <h3 className="font-bold text-gray-900">Installer l'application</h3>
          <p className="mt-1 text-sm text-gray-600">{isIOS ? "Ajoutez l'app à l'écran d'accueil." : "Accès rapide et hors ligne."}</p>
        </div>
        <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">✕</button>
      </div>
      {isIOS ? (
        <div className="w-full mt-3 p-2 bg-gray-50 text-sm text-gray-700 border border-gray-100">
          Appuyez sur <b>Partager ⍐</b> puis <b>Sur l'écran d'accueil ➕</b>
        </div>
      ) : (
        <button onClick={handleInstallClick} className="w-full mt-4 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md">Installer</button>
      )}
    </div>
  );
}