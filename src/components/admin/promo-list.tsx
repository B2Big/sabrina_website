'use client'

import { useState } from 'react'
import { Plus, Pencil, Trash2, Power, Megaphone, Clock, Calendar, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PromotionFormData, upsertPromotion, deletePromotion, togglePromotion } from '@/app/admin/actions'
import { PromoForm } from '@/components/admin/promo-form'

interface PromoListProps {
  promotions: any[]
  services: any[]
}

export function PromoList({ promotions, services }: PromoListProps) {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingPromo, setEditingPromo] = useState<PromotionFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleCreate = () => {
    setEditingPromo(null)
    setIsFormOpen(true)
  }

  const handleEdit = (promo: any) => {
    setEditingPromo(promo)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Supprimer cette promotion ?')) {
      await deletePromotion(id)
    }
  }

  const handleToggle = async (id: string, currentStatus: boolean) => {
    await togglePromotion(id, !currentStatus)
  }

  const handleSubmit = async (data: PromotionFormData) => {
    setIsLoading(true)
    const res = await upsertPromotion(data)
    setIsLoading(false)
    if (res.success) {
      setIsFormOpen(false)
    } else {
      alert(res.error)
    }
  }

  const getStatusInfo = (promo: any) => {
    if (!promo.isActive) return { label: 'Désactivé', color: 'text-slate-400' }
    
    const now = new Date()
    const start = promo.startDate ? new Date(promo.startDate) : null
    const end = promo.endDate ? new Date(promo.endDate) : null

    if (start && start > now) return { label: 'Planifié', color: 'text-blue-500' }
    if (end && end < now) return { label: 'Expiré', color: 'text-red-400' }
    return { label: 'En cours', color: 'text-green-600 font-bold' }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 text-red-600 rounded-lg">
            <Megaphone size={20} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Promotions & Alertes</h2>
            <p className="text-sm text-slate-500">Gérez le bandeau "Panic Sell" du site</p>
          </div>
        </div>
        <Button onClick={handleCreate} className="bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold">
          <Plus size={18} className="mr-2" /> Créer une alerte
        </Button>
      </div>

      <div className="grid gap-4">
        {promotions.map((promo) => {
            const status = getStatusInfo(promo)
            return (
                <div key={promo.id} className={`bg-white p-4 rounded-2xl border ${status.label === 'En cours' ? 'border-red-200 shadow-red-100 shadow-lg' : 'border-slate-200'} flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}>
                    <div className="flex items-center gap-4 flex-1">
                    <button 
                        onClick={() => handleToggle(promo.id, promo.isActive)}
                        className={`p-3 rounded-xl transition-colors ${promo.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'}`}
                        title={promo.isActive ? "Désactiver" : "Activer"}
                    >
                        <Power size={20} />
                    </button>
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs uppercase tracking-wider ${status.color}`}>● {status.label}</span>
                            {promo.endDate && (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-slate-50 px-2 rounded-full border border-slate-100">
                                    <Clock size={10} /> Fin: {new Date(promo.endDate).toLocaleDateString()} {new Date(promo.endDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                </span>
                            )}
                        </div>
                        <p className="font-bold text-slate-900 text-lg flex items-center gap-2">
                            {promo.discountPercent ? (
                                <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-0.5 rounded-md text-sm whitespace-nowrap">
                                    <Tag size={12} /> -{promo.discountPercent}%
                                </span>
                            ) : null}
                            {promo.text}
                        </p>
                        {promo.link && (
                        <p className="text-xs text-blue-500 truncate max-w-[300px]">{promo.link}</p>
                        )}
                    </div>
                    </div>

                    <div className="flex items-center gap-2 justify-end">
                    <button onClick={() => handleEdit(promo)} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                        <Pencil size={18} />
                    </button>
                    <button onClick={() => handleDelete(promo.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                    </button>
                    </div>
                </div>
            )
        })}
        
        {promotions.length === 0 && (
            <div className="text-center p-8 bg-slate-50 rounded-2xl border border-dashed border-slate-200 text-slate-400">
                Aucune promotion créée.
            </div>
        )}
      </div>

      {isFormOpen && (
        <PromoForm 
          initialData={editingPromo} 
          services={services}
          onSubmit={handleSubmit} 
          onCancel={() => setIsFormOpen(false)} 
          isLoading={isLoading} 
        />
      )}
    </div>
  )
}