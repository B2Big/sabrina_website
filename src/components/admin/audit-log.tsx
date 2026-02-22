'use client'

import { useState, useEffect } from 'react'
import { 
  History, 
  User, 
  Monitor, 
  Calendar,
  LogIn,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  ToggleLeft,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  Search
} from 'lucide-react'

// Types simplifiés pour l'affichage
type AuditLogEntry = {
  id: string
  userEmail: string
  action: string
  entityType: string
  entityId?: string
  details?: string
  ipAddress?: string
  createdAt: string
}

type AuditStats = {
  totalActions: number
  actionsToday: number
  uniqueAdmins: number
}

const actionIcons: Record<string, React.ReactNode> = {
  'LOGIN': <LogIn className="w-4 h-4 text-green-500" />,
  'LOGOUT': <LogOut className="w-4 h-4 text-slate-400" />,
  'CREATE_SERVICE': <Plus className="w-4 h-4 text-training" />,
  'UPDATE_SERVICE': <Pencil className="w-4 h-4 text-amber-500" />,
  'DELETE_SERVICE': <Trash2 className="w-4 h-4 text-red-500" />,
  'CREATE_PROMOTION': <Plus className="w-4 h-4 text-care" />,
  'UPDATE_PROMOTION': <Pencil className="w-4 h-4 text-amber-500" />,
  'DELETE_PROMOTION': <Trash2 className="w-4 h-4 text-red-500" />,
  'TOGGLE_PROMOTION': <ToggleLeft className="w-4 h-4 text-blue-500" />,
}

const actionLabels: Record<string, string> = {
  'LOGIN': 'Connexion',
  'LOGOUT': 'Déconnexion',
  'CREATE_SERVICE': 'Création service',
  'UPDATE_SERVICE': 'Modification service',
  'DELETE_SERVICE': 'Suppression service',
  'CREATE_PROMOTION': 'Création promo',
  'UPDATE_PROMOTION': 'Modification promo',
  'DELETE_PROMOTION': 'Suppression promo',
  'TOGGLE_PROMOTION': 'Activation/Désactivation promo',
}

// Format de date simple sans librairie externe
function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

function formatDateFull(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

export function AuditLogPanel() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([])
  const [stats, setStats] = useState<AuditStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/audit-logs?limit=50')
      if (response.ok) {
        const data = await response.json()
        setLogs(data.logs || [])
        setStats(data.stats || null)
      }
    } catch (error) {
      console.error('Erreur chargement logs:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLogs()
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(fetchLogs, 30000)
    return () => clearInterval(interval)
  }, [])

  const filteredLogs = logs.filter(log => 
    log.userEmail.toLowerCase().includes(filter.toLowerCase()) ||
    actionLabels[log.action]?.toLowerCase().includes(filter.toLowerCase()) ||
    log.entityType.toLowerCase().includes(filter.toLowerCase())
  )

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-slate-200 rounded w-1/3" />
          <div className="h-20 bg-slate-100 rounded" />
          <div className="h-20 bg-slate-100 rounded" />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      {/* Header avec stats */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center">
              <History className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900">Journal d&apos;audit</h3>
              <p className="text-sm text-slate-500">Historique des actions administrateur</p>
            </div>
          </div>
          <button
            onClick={fetchLogs}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title="Rafraîchir"
          >
            <RefreshCw className="w-4 h-4 text-slate-400" />
          </button>
        </div>

        {/* Stats cards */}
        {stats && (
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-black text-slate-900">{stats.totalActions}</p>
              <p className="text-xs text-slate-500">Actions totales</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-black text-training">{stats.actionsToday}</p>
              <p className="text-xs text-slate-500">Aujourd&apos;hui</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-3">
              <p className="text-2xl font-black text-care">{stats.uniqueAdmins}</p>
              <p className="text-xs text-slate-500">Admins actifs</p>
            </div>
          </div>
        )}
      </div>

      {/* Filtre */}
      <div className="p-4 border-b border-slate-200">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Rechercher dans les logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-slate-900/10"
          />
        </div>
      </div>

      {/* Liste des logs */}
      <div className="max-h-96 overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm">Aucun log trouvé</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => (
              <div 
                key={log.id}
                className="p-4 hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => setExpandedId(expandedId === log.id ? null : log.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {actionIcons[log.action] || <Monitor className="w-4 h-4 text-slate-400" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-slate-900 text-sm">
                        {actionLabels[log.action] || log.action}
                      </p>
                      <span className="text-xs text-slate-400">
                        {formatDate(log.createdAt)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      <User className="w-3 h-3 inline mr-1" />
                      {log.userEmail}
                    </p>
                    
                    {/* Détails expandables */}
                    {expandedId === log.id && (
                      <div className="mt-3 pt-3 border-t border-slate-200 space-y-2">
                        {log.entityId && (
                          <p className="text-xs text-slate-500">
                            <span className="font-medium">ID:</span> {log.entityId}
                          </p>
                        )}
                        {log.ipAddress && (
                          <p className="text-xs text-slate-500">
                            <Monitor className="w-3 h-3 inline mr-1" />
                            IP: {log.ipAddress}
                          </p>
                        )}
                        {log.details && (
                          <div className="text-xs text-slate-500 bg-slate-100 rounded p-2 font-mono">
                            <pre className="whitespace-pre-wrap break-all">
                              {JSON.stringify(JSON.parse(log.details), null, 2)}
                            </pre>
                          </div>
                        )}
                        <p className="text-xs text-slate-400">
                          <Calendar className="w-3 h-3 inline mr-1" />
                          {formatDateFull(log.createdAt)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="mt-0.5">
                    {expandedId === log.id ? (
                      <ChevronUp className="w-4 h-4 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
