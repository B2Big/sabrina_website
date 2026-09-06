'use client';

import { useState, useCallback, useEffect } from 'react';
import { Calendar, Clock, Loader2, Lock, Check } from 'lucide-react';

export type SelectedSlot = {
  start: string; // ISO UTC
  end: string; // ISO UTC
  lockId: string;
  date: string; // YYYY-MM-DD (Paris)
};

type SlotPickerProps = {
  serviceId: string;
  onSlotChange: (slot: SelectedSlot | null) => void;
};

function todayInParis(): string {
  // Format YYYY-MM-DD du jour courant à Paris
  return new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Paris' });
}

function formatSlotTime(iso: string): string {
  return new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Europe/Paris',
  }).format(new Date(iso));
}

export function SlotPicker({ serviceId, onSlotChange }: SlotPickerProps) {
  const [date, setDate] = useState<string>('');
  const [slots, setSlots] = useState<{ start: string; end: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [locking, setLocking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<SelectedSlot | null>(null);

  const minDate = todayInParis();

  const fetchSlots = useCallback(async (dateStr: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/slots?serviceId=${encodeURIComponent(serviceId)}&date=${dateStr}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Impossible de charger les créneaux');
        setSlots([]);
        return;
      }
      setSlots(data.slots || []);
      if ((data.slots || []).length === 0) {
        setError('Aucun créneau disponible ce jour-là');
      }
    } catch {
      setError('Erreur réseau — réessayez');
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  const handleDateChange = (dateStr: string) => {
    setDate(dateStr);
    // Changer de date invalide la sélection précédente
    setSelected(null);
    onSlotChange(null);
    if (dateStr) {
      fetchSlots(dateStr);
    } else {
      setSlots([]);
    }
  };

  const handleSlotClick = async (slot: { start: string; end: string }) => {
    setLocking(true);
    setError(null);
    try {
      const res = await fetch('/api/slots/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ start: slot.start, end: slot.end, serviceId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Créneau indisponible');
        return;
      }
      const selection: SelectedSlot = {
        start: slot.start,
        end: slot.end,
        lockId: data.lockId,
        date,
      };
      setSelected(selection);
      onSlotChange(selection);
    } catch {
      setError('Erreur réseau — réessayez');
    } finally {
      setLocking(false);
    }
  };

  const handleClear = () => {
    setSelected(null);
    onSlotChange(null);
  };

  return (
    <div className="space-y-4">
      {/* Date */}
      <div className="space-y-2">
        <label htmlFor="slot-date" className="text-sm font-bold text-slate-900 uppercase tracking-wider ml-1 flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Choisir votre créneau
        </label>
        <input
          id="slot-date"
          type="date"
          min={minDate}
          value={date}
          onChange={(e) => handleDateChange(e.target.value)}
          className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-5 text-slate-900 text-lg font-bold focus:outline-none focus:border-slate-300 focus:bg-white transition-all shadow-sm"
        />
      </div>

      {/* Créneaux */}
      {date && (
        <div>
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-6 text-slate-500 font-bold">
              <Loader2 className="w-5 h-5 animate-spin" />
              Chargement des créneaux...
            </div>
          ) : error && slots.length === 0 ? (
            <p className="text-center py-4 text-amber-600 text-sm font-bold bg-amber-50 border border-amber-200 rounded-xl px-4">
              {error}
            </p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => {
                const isSelected = selected?.start === slot.start;
                return (
                  <button
                    key={slot.start}
                    type="button"
                    disabled={locking}
                    onClick={() => handleSlotClick(slot)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-xl text-sm font-black border-2 transition-all ${
                      isSelected
                        ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-slate-400 hover:bg-slate-50'
                    } disabled:opacity-50`}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {formatSlotTime(slot.start)}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Sélection active */}
      {selected && (
        <div className="flex items-center justify-between gap-3 bg-emerald-50 border-2 border-emerald-200 rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-emerald-800">
            <Check className="w-5 h-5 shrink-0" />
            <div className="text-sm font-bold leading-tight">
              Créneau verrouillé : {formatSlotTime(selected.start)} – {formatSlotTime(selected.end)}
              <span className="block text-xs font-medium text-emerald-600 mt-0.5">
                Le {new Date(selected.date + 'T00:00:00').toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="text-xs font-bold text-emerald-700 underline underline-offset-2 hover:text-emerald-900 shrink-0"
          >
            Changer
          </button>
        </div>
      )}

      <p className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
        <Lock className="w-3 h-3 shrink-0" />
        Votre créneau est réservé 15 minutes le temps de finaliser votre réservation.
      </p>
    </div>
  );
}
