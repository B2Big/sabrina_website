'use client'

import { useState } from 'react'
import { Download, Mail, UserX, UserCheck, Trash2 } from 'lucide-react'
import { unsubscribeUser, resubscribeUser, deleteSubscriber } from '@/app/admin/newsletter-actions'
import { toast } from 'sonner'

type Subscriber = {
  id: string
  email: string
  name: string | null
  source: string
  isSubscribed: boolean
  subscribedAt: Date
  unsubscribedAt: Date | null
}

type NewsletterListProps = {
  subscribers: Subscriber[]
  stats: {
    total: number
    active: number
    unsubscribed: number
    newThisWeek: number
  }
}

export function NewsletterList({ subscribers: initialSubscribers, stats }: NewsletterListProps) {
  const [subscribers, setSubscribers] = useState(initialSubscribers)
  const [filter, setFilter] = useState<'all' | 'active' | 'unsubscribed'>('active')

  const filteredSubscribers = subscribers.filter(sub => {
    if (filter === 'all') return true
    if (filter === 'active') return sub.isSubscribed
    if (filter === 'unsubscribed') return !sub.isSubscribed
    return true
  })

  // Export CSV
  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Nom', 'Source', 'Statut', 'Date d\'inscription'],
      ...filteredSubscribers.map(sub => [
        sub.email,
        sub.name || '',
        sub.source,
        sub.isSubscribed ? 'Actif' : 'Désinscrit',
        new Date(sub.subscribedAt).toLocaleDateString('fr-FR')
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `newsletter-${new Date().toISOString().split('T')[0]}.csv`
    link.click()

    toast.success('Export CSV réussi !')
  }

  // Copy emails
  const handleCopyEmails = () => {
    const emails = filteredSubscribers
      .filter(sub => sub.isSubscribed)
      .map(sub => sub.email)
      .join(', ')

    navigator.clipboard.writeText(emails)
    toast.success(`${filteredSubscribers.filter(s => s.isSubscribed).length} emails copiés !`)
  }

  // Unsubscribe
  const handleUnsubscribe = async (email: string) => {
    const result = await unsubscribeUser(email)
    if (result.success) {
      setSubscribers(subs =>
        subs.map(sub => sub.email === email ? { ...sub, isSubscribed: false, unsubscribedAt: new Date() } : sub)
      )
      toast.success('Utilisateur désinscrit')
    } else {
      toast.error('Erreur lors de la désinscription')
    }
  }

  // Resubscribe
  const handleResubscribe = async (email: string) => {
    const result = await resubscribeUser(email)
    if (result.success) {
      setSubscribers(subs =>
        subs.map(sub => sub.email === email ? { ...sub, isSubscribed: true, unsubscribedAt: null } : sub)
      )
      toast.success('Utilisateur réabonné')
    } else {
      toast.error('Erreur lors du réabonnement')
    }
  }

  // Delete
  const handleDelete = async (email: string) => {
    if (!confirm(`Supprimer définitivement ${email} ? Cette action est irréversible.`)) {
      return
    }

    const result = await deleteSubscriber(email)
    if (result.success) {
      setSubscribers(subs => subs.filter(sub => sub.email !== email))
      toast.success('Abonné supprimé')
    } else {
      toast.error('Erreur lors de la suppression')
    }
  }

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-xl p-4">
          <div className="text-sm text-blue-600 font-medium">Total</div>
          <div className="text-3xl font-black text-blue-900">{stats.total}</div>
        </div>
        <div className="bg-green-50 rounded-xl p-4">
          <div className="text-sm text-green-600 font-medium">Actifs</div>
          <div className="text-3xl font-black text-green-900">{stats.active}</div>
        </div>
        <div className="bg-orange-50 rounded-xl p-4">
          <div className="text-sm text-orange-600 font-medium">Désinscrits</div>
          <div className="text-3xl font-black text-orange-900">{stats.unsubscribed}</div>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="text-sm text-purple-600 font-medium">Cette semaine</div>
          <div className="text-3xl font-black text-purple-900">+{stats.newThisWeek}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-medium"
        >
          <Download size={18} />
          Exporter CSV
        </button>
        <button
          onClick={handleCopyEmails}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Mail size={18} />
          Copier emails actifs
        </button>
      </div>

      {/* Filtres */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('active')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'active'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Actifs ({stats.active})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'all'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Tous ({stats.total})
        </button>
        <button
          onClick={() => setFilter('unsubscribed')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            filter === 'unsubscribed'
              ? 'bg-slate-900 text-white'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Désinscrits ({stats.unsubscribed})
        </button>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Email</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Source</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Date</th>
                <th className="px-4 py-3 text-left text-sm font-bold text-slate-900">Statut</th>
                <th className="px-4 py-3 text-right text-sm font-bold text-slate-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSubscribers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">
                    Aucun abonné pour le moment
                  </td>
                </tr>
              ) : (
                filteredSubscribers.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-slate-900">{sub.email}</td>
                    <td className="px-4 py-3 text-sm text-slate-600">{sub.name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {sub.source}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-slate-600">
                      {new Date(sub.subscribedAt).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      {sub.isSubscribed ? (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          ✓ Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          Désinscrit
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        {sub.isSubscribed ? (
                          <button
                            onClick={() => handleUnsubscribe(sub.email)}
                            className="p-1 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                            title="Désinscrire"
                          >
                            <UserX size={18} />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleResubscribe(sub.email)}
                            className="p-1 text-green-600 hover:bg-green-50 rounded transition-colors"
                            title="Réabonner"
                          >
                            <UserCheck size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(sub.email)}
                          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Supprimer (RGPD)"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
