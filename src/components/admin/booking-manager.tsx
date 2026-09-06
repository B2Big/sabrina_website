'use client';

import { useState, useEffect, useCallback } from 'react';
import { Phone, X, Loader2, Calendar, Clock, ShieldAlert, Ban, CheckCircle2, RefreshCw } from 'lucide-react';
import {
  getBookingData,
  addUnavailability,
  removeUnavailability,
  saveAvailabilityRule,
  cancelReservation,
} from '@/app/admin/actions';

type BookingReservation = {
  id: string;
  status: string;
  customerName: string;
  customerPhone: string;
  serviceTitle: string;
  totalAmount: number;
  paymentMethod: string;
  startAt: string | null;
  endAt: string | null;
};

type BookingUnavailability = {
  id: string;
  startAt: string;
  endAt: string;
  reason: string | null;
};

type BookingRule = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  bufferMinutes: number;
  isActive: boolean;
};

const DAY_LABELS = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
const DAY_LABELS_SHORT = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];

function dayKeyOf(date: Date): string {
  return date.toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
}

function dayLabelOf(date: Date): string {
  return date.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'Europe/Paris' });
}

function timeOf(iso: string): string {
  return new Date(iso).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Paris' });
}

const STATUS_LABELS: Record<string, { label: string; className: string }> = {
  paye_confirme: { label: 'Payée ✓', className: 'bg-emerald-100 text-emerald-800' },
  attente_paiement_sur_place: { label: 'Sur place', className: 'bg-amber-100 text-amber-800' },
  en_attente: { label: 'En attente', className: 'bg-slate-100 text-slate-700' },
  termine: { label: 'Terminée', className: 'bg-slate-100 text-slate-600' },
};

export function BookingManager() {
  const [reservations, setReservations] = useState<BookingReservation[]>([]);
  const [unavailabilities, setUnavailabilities] = useState<BookingUnavailability[]>([]);
  const [rules, setRules] = useState<BookingRule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dayOffset, setDayOffset] = useState(0);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getBookingData();
      setReservations(data.reservations);
      setUnavailabilities(data.unavailabilities);
      setRules(data.rules);
    } catch (e) {
      setError('Impossible de charger les réservations');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const targetDate = new Date();
  targetDate.setDate(targetDate.getDate() + dayOffset);
  const targetKey = dayKeyOf(targetDate);

  const dayReservations = reservations.filter((r) => r.startAt && dayKeyOf(new Date(r.startAt)) === targetKey);
  const dayUnavailabilities = unavailabilities.filter(
    (u) => dayKeyOf(new Date(u.startAt)) === targetKey || dayKeyOf(new Date(u.endAt)) === targetKey
  );

  const blockRange = async (label: string, startTime: string, endTime: string) => {
    setBusy(label);
    setError(null);
    try {
      const start = new Date(`${targetKey}T${startTime}:00`);
      const end = new Date(`${targetKey}T${endTime}:00`);
      const result = await addUnavailability({
        start: start.toISOString(),
        end: end.toISOString(),
        reason: `${label} bloquée`,
      });
      if (!result.success) {
        setError(result.error || 'Erreur lors du blocage');
      }
      await load();
    } finally {
      setBusy(null);
    }
  };

  const unblock = async (id: string) => {
    setBusy(id);
    await removeUnavailability(id);
    await load();
    setBusy(null);
  };

  const cancel = async (id: string) => {
    if (!window.confirm('Annuler cette réservation ? Le créneau sera libéré.')) return;
    setBusy(id);
    const result = await cancelReservation(id);
    if (!result.success) setError(result.error || 'Erreur annulation');
    await load();
    setBusy(null);
  };

  const saveRule = async (dayOfWeek: number, startTime: string, endTime: string) => {
    setBusy(`rule-${dayOfWeek}`);
    setError(null);
    const result = await saveAvailabilityRule({ dayOfWeek, startTime, endTime, bufferMinutes: 0 });
    if (!result.success) setError(result.error || 'Erreur enregistrement');
    await load();
    setBusy(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-2 py-16 text-slate-500 font-bold">
        <Loader2 className="w-6 h-6 animate-spin" />
        Chargement des réservations...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm font-bold flex items-center justify-between gap-2">
          {error}
          <button onClick={load} className="text-xs underline shrink-0">Réessayer</button>
        </div>
      )}

      {/* ==== 1. SÉLECTEUR DE JOUR ==== */}
      <div>
        <h3 className="font-black text-slate-900 mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          Agenda — {dayLabelOf(targetDate)}
        </h3>
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
          {[0, 1, 2, 3, 4, 5, 6].map((offset) => {
            const d = new Date();
            d.setDate(d.getDate() + offset);
            return (
              <button
                key={offset}
                onClick={() => setDayOffset(offset)}
                className={`min-w-[64px] px-3 py-3 rounded-xl text-center transition-all border-2 ${
                  dayOffset === offset
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase">{offset === 0 ? "Auj." : DAY_LABELS_SHORT[d.getDay()]}</span>
                <span className="block text-lg font-black leading-tight">{d.getDate()}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ==== 2. RÉSERVATIONS DU JOUR ==== */}
      <div>
        <h4 className="font-black text-slate-900 mb-3">Réservations du jour ({dayReservations.length})</h4>
        {dayReservations.length === 0 ? (
          <p className="text-slate-400 text-sm font-medium bg-white border border-slate-200 rounded-xl p-4 text-center">
            Aucune réservation ce jour-là.
          </p>
        ) : (
          <div className="space-y-3">
            {dayReservations.map((r) => {
              const status = STATUS_LABELS[r.status] ?? { label: r.status, className: 'bg-slate-100 text-slate-700' };
              return (
                <div key={r.id} className="bg-white border-2 border-slate-200 rounded-2xl p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-lg font-black text-slate-900">
                          {r.startAt ? timeOf(r.startAt) : '—'}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="font-bold text-slate-800 mt-1">{r.customerName}</p>
                      <p className="text-sm text-slate-500">{r.serviceTitle}</p>
                      <p className="text-sm font-black text-slate-700 mt-0.5">{r.totalAmount} € · {r.paymentMethod === 'stripe' ? 'en ligne' : 'sur place'}</p>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      <a
                        href={`tel:${r.customerPhone.replace(/\s/g, '')}`}
                        className="flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-emerald-500 text-white font-black text-sm shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Appeler
                      </a>
                      <button
                        onClick={() => cancel(r.id)}
                        disabled={busy === r.id}
                        className="flex items-center justify-center gap-1.5 min-h-[44px] px-4 rounded-xl bg-red-50 text-red-600 font-bold text-sm border border-red-200 hover:bg-red-100 transition-colors disabled:opacity-50"
                      >
                        {busy === r.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" />}
                        Annuler
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ==== 3. BLOCAGE RAPIDE ==== */}
      <div>
        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
          <Ban className="w-5 h-5 text-rose-500" />
          Bloquer une plage (1 tap)
        </h4>
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={() => blockRange('Matin', '08:00', '13:00')}
            disabled={busy !== null}
            className="min-h-[56px] rounded-xl bg-rose-500 text-white font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors disabled:opacity-50 text-sm leading-tight"
          >
            {busy === 'Matin' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <>Matin<br />8h–13h</>}
          </button>
          <button
            onClick={() => blockRange('Après-midi', '13:00', '20:00')}
            disabled={busy !== null}
            className="min-h-[56px] rounded-xl bg-rose-500 text-white font-black shadow-lg shadow-rose-200 hover:bg-rose-600 transition-colors disabled:opacity-50 text-sm leading-tight"
          >
            {busy === 'Après-midi' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <>Après-midi<br />13h–20h</>}
          </button>
          <button
            onClick={() => blockRange('Journée', '08:00', '20:00')}
            disabled={busy !== null}
            className="min-h-[56px] rounded-xl bg-slate-900 text-white font-black shadow-lg hover:bg-slate-800 transition-colors disabled:opacity-50 text-sm leading-tight"
          >
            {busy === 'Journée' ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : <>Journée<br />complète</>}
          </button>
        </div>
        {dayUnavailabilities.length > 0 && (
          <div className="mt-3 space-y-2">
            {dayUnavailabilities.map((u) => (
              <div key={u.id} className="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-bold">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {timeOf(u.startAt)} – {timeOf(u.endAt)}
                  <span className="text-slate-400 font-medium">· {u.reason || 'Bloqué'}</span>
                </div>
                <button
                  onClick={() => unblock(u.id)}
                  disabled={busy === u.id}
                  className="flex items-center gap-1 min-h-[44px] px-3 rounded-lg text-emerald-600 font-bold text-sm hover:bg-emerald-50 disabled:opacity-50"
                >
                  {busy === u.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  Libérer
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ==== 4. HORAIRES RÉCURRENTS ==== */}
      <div>
        <h4 className="font-black text-slate-900 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-amber-500" />
          Horaires hebdomadaires
        </h4>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5, 6, 0].map((dayOfWeek) => {
            const rule = rules.find((r) => r.dayOfWeek === dayOfWeek);
            const startTime = rule?.startTime ?? (dayOfWeek === 6 ? '09:00' : dayOfWeek === 0 ? '' : '08:00');
            const endTime = rule?.endTime ?? (dayOfWeek === 6 ? '18:00' : dayOfWeek === 0 ? '' : '20:00');
            const isClosed = dayOfWeek === 0 && !rule;
            return (
              <div key={dayOfWeek} className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2.5">
                <span className="w-12 text-sm font-black text-slate-700 shrink-0">{DAY_LABELS[dayOfWeek].slice(0, 3)}</span>
                {isClosed ? (
                  <span className="text-sm text-slate-400 font-bold flex-1">Fermé</span>
                ) : (
                  <>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRules((prev) => prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, startTime: value } : r)));
                      }}
                      className="min-h-[44px] px-2 rounded-lg border-2 border-slate-200 text-sm font-bold text-slate-700 w-24"
                    />
                    <span className="text-slate-400">→</span>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => {
                        const value = e.target.value;
                        setRules((prev) => prev.map((r) => (r.dayOfWeek === dayOfWeek ? { ...r, endTime: value } : r)));
                      }}
                      className="min-h-[44px] px-2 rounded-lg border-2 border-slate-200 text-sm font-bold text-slate-700 w-24"
                    />
                    <button
                      onClick={() => {
                        const current = rules.find((r) => r.dayOfWeek === dayOfWeek);
                        saveRule(dayOfWeek, current?.startTime ?? startTime, current?.endTime ?? endTime);
                      }}
                      disabled={busy === `rule-${dayOfWeek}`}
                      className="ml-auto flex items-center gap-1 min-h-[44px] px-3 rounded-lg bg-blue-500 text-white font-bold text-xs hover:bg-blue-600 disabled:opacity-50"
                    >
                      {busy === `rule-${dayOfWeek}` ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                      Enregistrer
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 font-medium mt-2">
          Ces horaires déterminent les créneaux proposés aux clients. Le dimanche est fermé par défaut.
        </p>
      </div>
    </div>
  );
}
