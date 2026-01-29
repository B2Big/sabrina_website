'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft, Trash2, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function CleanupPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCleanup = async () => {
    if (!confirm('Voulez-vous vraiment supprimer tous les liens de paiement Stripe TEST des services?')) {
      return;
    }

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/admin/clear-payment-links', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur réseau');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/admin" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 font-medium transition-colors mb-8">
          <ArrowLeft size={16} /> Retour au dashboard
        </Link>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-8">
          <h1 className="text-3xl font-black text-slate-900 mb-4">
            🧹 Nettoyage des Liens Stripe
          </h1>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-amber-600 mt-1 flex-shrink-0" size={20} />
              <div>
                <h3 className="font-bold text-amber-900 mb-2">Action de maintenance</h3>
                <p className="text-sm text-amber-800">
                  Cette action va supprimer tous les liens de paiement Stripe TEST des services.
                  <br />
                  <strong>Ces liens ne sont pas utilisés</strong> par le bouton "Réserver & Payer en ligne".
                </p>
              </div>
            </div>
          </div>

          {!result && !error && (
            <Button
              onClick={handleCleanup}
              disabled={loading}
              className="w-full h-14 text-lg bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Nettoyage en cours...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2" size={20} />
                  Supprimer tous les liens TEST
                </>
              )}
            </Button>
          )}

          {result && (
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <CheckCircle className="text-green-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-green-900 text-lg mb-2">
                    ✅ Nettoyage terminé !
                  </h3>
                  <p className="text-green-800 mb-4">
                    {result.message}
                  </p>
                  <Link href="/admin">
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      <ArrowLeft className="mr-2" size={16} />
                      Retour au dashboard
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-red-600 mt-1 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-bold text-red-900 text-lg mb-2">
                    ❌ Erreur
                  </h3>
                  <p className="text-red-800 mb-4">{error}</p>
                  <Button
                    onClick={() => {
                      setError(null);
                      setResult(null);
                    }}
                    variant="outline"
                  >
                    Réessayer
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-bold text-blue-900 mb-2">ℹ️ Information</h3>
          <p className="text-sm text-blue-800">
            Le bouton "Réserver & Payer en ligne" crée automatiquement des sessions Stripe sans avoir besoin de liens de paiement.
            <br />
            <br />
            <strong>Tu n'as rien à configurer sur Stripe pour chaque service.</strong>
            <br />
            Il suffit de renseigner le prix dans le formulaire du service et tout fonctionne automatiquement!
          </p>
        </div>
      </div>
    </div>
  );
}
