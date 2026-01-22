'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { ServiceFormData, upsertService, deleteService } from '@/app/admin/actions'
import { ServiceForm } from '@/components/admin/service-form'
import { PromoList } from '@/components/admin/promo-list'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  services: any[]
  promotions: any[]
}

export function AdminDashboard({ services, promotions }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'promotions'>('services')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.refresh()
  }

  const handleCreate = () => {
    setEditingService(null)
    setIsFormOpen(true)
  }

  const handleEdit = (service: any) => {
    setEditingService(service)
    setIsFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce service ?')) {
      await deleteService(id)
    }
  }

  const handleSubmit = async (data: ServiceFormData) => {
    setIsLoading(true)
    const res = await upsertService(data)
    setIsLoading(false)
    if (res.success) {
      setIsFormOpen(false)
    } else {
      alert(res.error)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
                <Link href="/" className="text-slate-400 hover:text-slate-600 flex items-center gap-2 font-medium transition-colors">
                <ArrowLeft size={16} /> Retour au site
                </Link>
                <button onClick={handleSignOut} className="text-red-400 hover:text-red-600 flex items-center gap-2 font-medium text-sm transition-colors">
                    <LogOut size={14} /> Déconnexion
                </button>
            </div>
            <h1 className="text-3xl font-black text-slate-900">Dashboard Sabrina</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 bg-white p-1 rounded-xl w-fit border border-slate-200 shadow-sm">
            <button 
                onClick={() => setActiveTab('services')}
                className={cn(
                    "px-6 py-2.5 rounded-lg font-bold text-sm transition-all",
                    activeTab === 'services' ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
            >
                Services
            </button>
            <button 
                onClick={() => setActiveTab('promotions')}
                className={cn(
                    "px-6 py-2.5 rounded-lg font-bold text-sm transition-all",
                    activeTab === 'promotions' ? "bg-red-600 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
            >
                Promotions
            </button>
        </div>

        {/* Content */}
        {activeTab === 'promotions' ? (
            <PromoList promotions={promotions} services={services} />
        ) : (
            <>
                <div className="flex justify-end mb-6">
                    <Button onClick={handleCreate} className="bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 shadow-lg hover:shadow-xl transition-all">
                        <Plus size={18} className="mr-2" /> Nouveau Service
                    </Button>
                </div>

                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider pl-8">Titre</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Catégorie</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Prix</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider">Lien Paiement</th>
                        <th className="p-4 font-bold text-slate-400 text-xs uppercase tracking-wider text-right pr-8">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {services.map((s) => (
                        <tr key={s.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                            <td className="p-4 pl-8">
                                <div className="font-bold text-slate-900">{s.title}</div>
                                {s.popular && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full mr-1">Top</span>}
                                {s.bestValue && <span className="text-[10px] bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full">Best Value</span>}
                            </td>
                            <td className="p-4">
                            <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${
                                s.category === 'Coaching' ? 'bg-blue-50 text-blue-600' : 
                                s.category === 'Massages' ? 'bg-pink-50 text-pink-600' :
                                'bg-purple-50 text-purple-600'
                            }`}>
                                {s.category}
                            </span>
                            </td>
                            <td className="p-4 font-medium text-slate-600">
                                {s.price}
                                {s.originalPrice && <span className="text-slate-300 line-through text-xs ml-2">{s.originalPrice}</span>}
                            </td>
                            <td className="p-4">
                                {s.paymentLink ? (
                                    <a href={s.paymentLink} target="_blank" className="text-xs text-blue-500 hover:underline truncate max-w-[150px] block">
                                        {s.paymentLink}
                                    </a>
                                ) : (
                                    <span className="text-xs text-slate-300">Aucun</span>
                                )}
                            </td>
                            <td className="p-4 text-right pr-8">
                            <div className="flex items-center justify-end gap-2">
                                <button 
                                    onClick={() => handleEdit(s)}
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-white rounded-lg transition-all border border-transparent hover:border-slate-200 shadow-sm"
                                >
                                <Pencil size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(s.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-white rounded-lg transition-all border border-transparent hover:border-red-100 shadow-sm"
                                >
                                <Trash2 size={16} />
                                </button>
                            </div>
                            </td>
                        </tr>
                        ))}
                        {services.length === 0 && (
                        <tr>
                            <td colSpan={5} className="p-12 text-center text-slate-400 font-medium">
                            Aucun service pour le moment. Commencez par en ajouter un !
                            </td>
                        </tr>
                        )}
                    </tbody>
                    </table>
                    </div>
                </div>

                {isFormOpen && (
                    <ServiceForm 
                        initialData={editingService} 
                        onSubmit={handleSubmit} 
                        onCancel={() => setIsFormOpen(false)} 
                        isLoading={isLoading}
                    />
                )}
            </>
        )}
      </div>
    </div>
  )
}
