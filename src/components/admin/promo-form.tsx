'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PromotionFormData } from '@/app/admin/actions'
import { X, Calendar, Clock, Zap, Percent, Tag } from 'lucide-react'

interface PromoFormProps {
  initialData?: PromotionFormData | null
  services: any[]
  onSubmit: (data: PromotionFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export function PromoForm({ initialData, services, onSubmit, onCancel, isLoading }: PromoFormProps) {
  // Helper to format Date to input value "YYYY-MM-DDTHH:mm"
  const formatDateForInput = (dateStr?: string | Date | null) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  }

  const [formData, setFormData] = useState<PromotionFormData>(initialData ? {
    ...initialData,
    startDate: formatDateForInput(initialData.startDate),
    endDate: formatDateForInput(initialData.endDate),
    serviceIds: (initialData as any).services?.map((s: any) => s.id) || []
  } : {
    text: '',
    link: '',
    isActive: true,
    startDate: '',
    endDate: '',
    serviceIds: [],
    discountPercent: undefined
  })

  // Mode: "general" (text only) or "discount" (service linked)
  const [promoType, setPromoType] = useState<'general' | 'discount'>(
    (initialData as any)?.services?.length > 0 ? 'discount' : 'general'
  )

  // Auto-generate text when discount changes
  useEffect(() => {
    if (promoType === 'discount' && formData.serviceIds && formData.serviceIds.length > 0 && formData.discountPercent) {
      if (formData.serviceIds.length === 1) {
          const service = services.find(s => s.id === formData.serviceIds![0])
          if (service) {
            setFormData(prev => ({
              ...prev,
              text: `Vente Flash : -${formData.discountPercent}% sur ${service.title} !`
            }))
          }
      } else {
          setFormData(prev => ({
              ...prev,
              text: `Vente Flash : -${formData.discountPercent}% sur une sélection de services !`
            }))
      }
    }
  }, [formData.serviceIds, formData.discountPercent, promoType, services])

  const toggleService = (id: string) => {
      setFormData(prev => {
          const current = prev.serviceIds || []
          if (current.includes(id)) {
              return { ...prev, serviceIds: current.filter(cid => cid !== id) }
          } else {
              return { ...prev, serviceIds: [...current, id] }
          }
      })
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const setFlashDuration = (hours: number) => {
    const now = new Date()
    const end = new Date(now.getTime() + hours * 60 * 60 * 1000)
    
    setFormData(prev => ({
      ...prev,
      startDate: formatDateForInput(now),
      endDate: formatDateForInput(end)
    }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Modifier la Promotion' : 'Nouvelle Vente Flash'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* TYPE SELECTOR */}
          <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => { setPromoType('general'); setFormData(p => ({ ...p, serviceIds: [], discountPercent: undefined })) }}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${promoType === 'general' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Message Général
            </button>
            <button
              type="button"
              onClick={() => setPromoType('discount')}
              className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${promoType === 'discount' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Réduction Services
            </button>
          </div>

          {/* DISCOUNT SETTINGS */}
          {promoType === 'discount' && (
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-900">1. Pourcentage de remise</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="discountPercent"
                            value={formData.discountPercent || ''}
                            onChange={(e) => setFormData(p => ({ ...p, discountPercent: parseInt(e.target.value) }))}
                            className="w-full p-3 pl-10 border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                            placeholder="Ex: 20"
                        />
                        <Percent className="absolute left-3 top-3.5 w-5 h-5 text-blue-400" />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-bold text-blue-900">2. Choisir les Services</label>
                    <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto p-2 bg-white rounded-xl border border-blue-200">
                        {services.map(s => (
                            <label key={s.id} className="flex items-center gap-3 p-2 hover:bg-slate-50 rounded-lg cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={formData.serviceIds?.includes(s.id)}
                                    onChange={() => toggleService(s.id)}
                                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 font-medium">{s.title}</span>
                                <span className="text-xs text-slate-400 ml-auto">{s.price}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </div>
          )}

          {/* Message & Link */}
          <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                    {promoType === 'discount' ? 'Message (Généré auto, modifiable)' : 'Message (Texte défilant)'}
                </label>
                <input
                name="text"
                value={formData.text}
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none font-bold text-slate-900"
                placeholder="Ex: -20% SUR TOUT LE SITE !"
                required
                />
            </div>
            
            {promoType === 'general' && (
                <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-700">Lien (Stripe / Autre)</label>
                    <input
                    name="link"
                    value={formData.link || ''}
                    onChange={handleChange}
                    className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 outline-none text-blue-600"
                    placeholder="https://..."
                    />
                </div>
            )}
          </div>

          <div className="h-px bg-slate-100" />

          {/* DURATION SETTINGS */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Clock size={16} /> Durée de la promotion
            </label>

            {/* Quick Actions (Flash) */}
            <div className="grid grid-cols-3 gap-2">
                <button 
                    type="button"
                    onClick={() => setFlashDuration(24)}
                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-yellow-400 hover:bg-yellow-50 transition-colors group"
                >
                    <Zap className="w-5 h-5 text-slate-400 group-hover:text-yellow-500 fill-current" />
                    <span className="text-xs font-bold text-slate-600">24 Heures</span>
                </button>
                <button 
                    type="button"
                    onClick={() => setFlashDuration(48)}
                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-orange-400 hover:bg-orange-50 transition-colors group"
                >
                    <Zap className="w-5 h-5 text-slate-400 group-hover:text-orange-500 fill-current" />
                    <span className="text-xs font-bold text-slate-600">48 Heures</span>
                </button>
                <button 
                    type="button"
                    onClick={() => setFlashDuration(72)}
                    className="flex flex-col items-center justify-center gap-1 p-3 rounded-xl border border-slate-200 hover:border-red-400 hover:bg-red-50 transition-colors group"
                >
                    <Zap className="w-5 h-5 text-slate-400 group-hover:text-red-500 fill-current" />
                    <span className="text-xs font-bold text-slate-600">3 Jours</span>
                </button>
            </div>

            {/* Manual Date Inputs */}
            <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Début</label>
                    <input
                        type="datetime-local"
                        name="startDate"
                        value={formData.startDate || ''}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs font-medium text-slate-500 uppercase tracking-wide">Fin</label>
                    <input
                        type="datetime-local"
                        name="endDate"
                        value={formData.endDate || ''}
                        onChange={handleChange}
                        className="w-full bg-white border border-slate-200 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
                    />
                </div>
                <p className="col-span-2 text-[10px] text-slate-400 text-center">
                    Laissez vide pour une durée indéterminée (manuel)
                </p>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Active Switch */}
          <label className="flex items-center gap-3 p-3 border border-slate-100 rounded-xl cursor-pointer hover:bg-slate-50 transition-colors">
            <div className={`w-10 h-6 rounded-full p-1 transition-colors ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
              <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform ${formData.isActive ? 'translate-x-4' : 'translate-x-0'}`} />
            </div>
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="hidden"
            />
            <div>
                <span className="font-bold text-slate-900 block">Activer la promotion</span>
                <span className="text-xs text-slate-500">Si désactivé, la réduction ne s'appliquera pas.</span>
            </div>
          </label>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 rounded-b-2xl bg-white sticky bottom-0">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">
            Annuler
          </Button>
          <Button 
            onClick={() => onSubmit(formData)} 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </div>
      </div>
    </div>
  )
}
