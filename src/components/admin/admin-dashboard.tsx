'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, Pencil, Trash2, ArrowLeft, LogOut } from 'lucide-react'
import Link from 'next/link'
import { ServiceFormData, upsertService, deleteService, signOut } from '@/app/admin/actions'
import { ServiceForm } from '@/components/admin/service-form'
import { PromoList } from '@/components/admin/promo-list'
import { NewsletterList } from '@/components/admin/newsletter-list'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

interface AdminDashboardProps {
  services: any[]
  promotions: any[]
  newsletterSubscribers?: any[]
  newsletterStats?: any
}

export function AdminDashboard({ services, promotions, newsletterSubscribers, newsletterStats }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'services' | 'promotions' | 'newsletter'>('services')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingService, setEditingService] = useState<ServiceFormData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    console.log('Client: handleSignOut clicked');
    await signOut()
    console.log('Client: signOut action completed, redirecting...');
    window.location.href = '/' // Force full reload
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
        <div className="flex gap-2 mb-8 bg-white p-1.5 rounded-2xl w-fit border border-slate-200 shadow-sm backdrop-blur-xl">
            <button
                onClick={() => setActiveTab('services')}
                className={cn(
                    "px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                    activeTab === 'services' ? "bg-blue-500 text-white shadow-lg shadow-blue-200" : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"
                )}
            >
                Services
            </button>
            <button
                onClick={() => setActiveTab('promotions')}
                className={cn(
                    "px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                    activeTab === 'promotions' ? "bg-rose-400 text-white shadow-lg shadow-rose-200" : "text-slate-500 hover:text-rose-400 hover:bg-rose-50"
                )}
            >
                Promotions
            </button>
            <button
                onClick={() => setActiveTab('newsletter')}
                className={cn(
                    "px-8 py-2.5 rounded-xl font-bold text-sm transition-all duration-300",
                    activeTab === 'newsletter' ? "bg-purple-500 text-white shadow-lg shadow-purple-200" : "text-slate-500 hover:text-purple-500 hover:bg-purple-50"
                )}
            >
                📧 Newsletter
            </button>
        </div>

        {/* Content */}
        {activeTab === 'promotions' ? (
            <PromoList promotions={promotions} services={services} />
        ) : activeTab === 'newsletter' ? (
            <NewsletterList
              subscribers={newsletterSubscribers || []}
              stats={newsletterStats || { total: 0, active: 0, unsubscribed: 0, newThisWeek: 0 }}
            />
        ) : (
            <>
                <div className="flex justify-end mb-6">
                    <Button onClick={handleCreate} className="bg-blue-600 hover:bg-blue-700 text-white rounded-2xl px-6 py-6 font-bold shadow-xl shadow-blue-200 transition-all active:scale-95">
                        <Plus size={20} className="mr-2" /> Ajouter un Service
                    </Button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                    <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50/80 backdrop-blur-sm">
                        <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest pl-10">Prestation</th>
                        <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Catégorie</th>
                        <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest">Tarif</th>
                        <th className="p-6 font-black text-slate-400 text-xs uppercase tracking-widest text-right pr-10">Gestion</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {services.map((s) => (
                        <tr key={s.id} className="group hover:bg-blue-50/30 transition-all">
                            <td className="p-6 pl-10">
                                <div className="font-bold text-slate-900 text-lg group-hover:text-blue-600 transition-colors">{s.title}</div>
                                <div className="flex gap-2 mt-1">
                                    {s.popular && <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">POPULAIRE</span>}
                                    {s.bestValue && <span className="text-[10px] bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded-full">OFFRE SPÉCIALE</span>}
                                </div>
                            </td>
                            <td className="p-6">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                                s.category === 'Coaching' || s.category === 'Training' ? 'bg-blue-500 text-white' : 
                                s.category === 'Massages' || s.category === 'Care' ? 'bg-rose-400 text-white' :
                                'bg-slate-900 text-white'
                            }`}>
                                {s.category}
                            </span>
                            </td>
                            <td className="p-6">
                                <span className="font-black text-slate-900 text-lg">{s.price}</span>
                                {s.originalPrice && <span className="text-slate-300 line-through text-sm ml-2 font-medium">{s.originalPrice}</span>}
                            </td>
                            <td className="p-6 text-right pr-10">
                            <div className="flex items-center justify-end gap-3">
                                <button 
                                    onClick={() => handleEdit(s)}
                                    className="p-3 text-slate-400 hover:text-blue-500 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-blue-100"
                                >
                                <Pencil size={18} />
                                </button>
                                <button 
                                    onClick={() => handleDelete(s.id)}
                                    className="p-3 text-slate-400 hover:text-rose-500 hover:bg-white rounded-2xl transition-all shadow-sm hover:shadow-md border border-transparent hover:border-rose-100"
                                >
                                <Trash2 size={18} />
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
