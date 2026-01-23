'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { PromotionFormData } from '@/app/admin/actions'
import { X, Calendar, Clock, Zap, Percent, Tag, Check } from 'lucide-react'

interface PromoFormProps {
  initialData?: PromotionFormData | null
  services: any[]
  onSubmit: (data: PromotionFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export function PromoForm({ initialData, services, onSubmit, onCancel, isLoading }: PromoFormProps) {
  // Helper to format Date
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

  // Auto-generate text if empty when selecting discount
  useEffect(() => {
    if (!initialData && formData.discountPercent && !formData.text) {
        setFormData(prev => ({
            ...prev,
            text: `VENTE FLASH : -${formData.discountPercent}% !`
        }))
    }
  }, [formData.discountPercent, initialData, formData.text])

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

  const selectAllServices = () => {
      setFormData(prev => ({ 
          ...prev, 
          serviceIds: services.map(s => s.id) 
      }))
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {initialData ? 'Modifier la Promo' : 'Créer une Vente Flash'}
            </h2>
            <p className="text-slate-500 text-sm mt-1">Configurez votre opération "Panic Sell".</p>
          </div>
          <button onClick={onCancel} className="bg-slate-100 p-2 rounded-full hover:bg-slate-200 transition-colors">
            <X size={20} className="text-slate-600" />
          </button>
        </div>

        <div className="p-8 space-y-8">
          
          {/* 1. TEXTE DE L'OFFRE */}
          <div className="space-y-3">
             <label className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Tag size={16} className="text-red-500" /> 1. Titre de l'offre
             </label>
             <input
                name="text"
                value={formData.text}
                onChange={handleChange}
                className="w-full p-4 text-lg font-bold border-2 border-slate-200 rounded-2xl focus:border-red-500 focus:ring-4 focus:ring-red-500/10 outline-none placeholder:text-slate-300 transition-all"
                placeholder="Ex: -20% SUR TOUT LE SITE !"
                autoFocus={!initialData}
             />
          </div>

          {/* 2. REDUCTION (Optionnel) */}
          <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100 space-y-6">
             <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                    <Percent size={20} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900">Appliquer une réduction ?</h3>
                    <p className="text-xs text-slate-500">Calculera automatiquement les nouveaux prix barrés.</p>
                </div>
             </div>

             <div className="flex gap-4 items-center">
                 <div className="relative flex-1">
                    <input
                        type="number"
                        name="discountPercent"
                        value={formData.discountPercent || ''}
                        onChange={(e) => setFormData(p => ({ ...p, discountPercent: parseInt(e.target.value) }))}
                        className="w-full p-3 pl-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none font-bold text-blue-600"
                        placeholder="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">%</span>
                 </div>
                 <div className="text-sm text-slate-400 font-medium">de remise</div>
             </div>

             {/* Services Selector (Only if discount set) */}
             {formData.discountPercent ? (
                 <div className="animate-in fade-in slide-in-from-top-2">
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Sur quels services ?</label>
                        <button onClick={selectAllServices} className="text-xs text-blue-600 font-bold hover:underline">Tout sélectionner</button>
                    </div>
                    <div className="bg-white border border-slate-200 rounded-xl max-h-40 overflow-y-auto p-2">
                        {services.map(s => (
                            <div 
                                key={s.id} 
                                onClick={() => toggleService(s.id)}
                                className="flex items-center gap-3 p-2 hover:bg-blue-50/50 rounded-lg cursor-pointer transition-colors group select-none"
                            >
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${formData.serviceIds?.includes(s.id) ? 'bg-blue-500 border-blue-500' : 'border-slate-300 bg-white'}`}>
                                    {formData.serviceIds?.includes(s.id) && <Check size={12} className="text-white" />}
                                </div>
                                <span className="text-sm text-slate-700 font-medium group-hover:text-blue-700">{s.title}</span>
                            </div>
                        ))}
                    </div>
                 </div>
             ) : null}
          </div>

          {/* 3. DUREE */}
          <div className="space-y-4">
            <label className="text-sm font-bold text-slate-900 uppercase tracking-wide flex items-center gap-2">
                <Clock size={16} className="text-orange-500" /> 3. Durée (Flash)
            </label>

            <div className="grid grid-cols-3 gap-3">
                {[24, 48, 72].map(hours => (
                    <button 
                        key={hours}
                        type="button"
                        onClick={() => setFlashDuration(hours)}
                        className="py-3 px-2 rounded-xl border border-slate-200 hover:border-orange-500 hover:bg-orange-50 hover:text-orange-600 font-bold text-sm text-slate-600 transition-all active:scale-95"
                    >
                        {hours}h
                    </button>
                ))}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <input type="datetime-local" name="startDate" value={formData.startDate || ''} onChange={handleChange} className="bg-slate-50 border-none rounded-xl p-3 text-xs text-slate-600 font-medium" />
                <input type="datetime-local" name="endDate" value={formData.endDate || ''} onChange={handleChange} className="bg-slate-50 border-none rounded-xl p-3 text-xs text-slate-600 font-medium" />
            </div>
          </div>

          {/* ACTIVER */}
          <label className="flex items-center gap-4 p-4 bg-green-50 rounded-2xl cursor-pointer border border-green-100 transition-all hover:shadow-md">
            <div className={`w-12 h-7 rounded-full p-1 transition-colors duration-300 ${formData.isActive ? 'bg-green-500' : 'bg-slate-300'}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300 ${formData.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
            </div>
            <div>
                <span className="font-black text-green-900 block">Activer immédiatement</span>
                <span className="text-xs text-green-700 font-medium">La promo sera visible sur le site.</span>
            </div>
          </label>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white sticky bottom-0 rounded-b-[2rem]">
          <Button 
            onClick={() => onSubmit(formData)} 
            disabled={isLoading}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl py-6 text-lg font-black shadow-xl shadow-slate-200 active:scale-[0.98] transition-all"
          >
            {isLoading ? 'Lancement...' : 'LANCER LA VENTE FLASH 🚀'}
          </Button>
        </div>
      </div>
    </div>
  )
}