'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ServiceFormData } from '@/app/admin/actions'
import { Plus, X, Trash2 } from 'lucide-react'

// Mocking UI components if they don't exist in the project yet to avoid errors.
// Since I haven't checked for ui/input, ui/textarea, ui/switch, ui/label, I will use standard HTML elements styled with Tailwind 
// where I'm unsure, OR I'll create simple versions inline if needed.
// Based on file list, `button.tsx` exists. Others might not. I'll stick to standard Tailwind for form elements to be safe.

interface ServiceFormProps {
  initialData?: ServiceFormData | null
  onSubmit: (data: ServiceFormData) => void
  onCancel: () => void
  isLoading: boolean
}

export function ServiceForm({ initialData, onSubmit, onCancel, isLoading }: ServiceFormProps) {
  // Helper to strip " €" for the form display
  const cleanPrice = (price: string) => price.replace(/[^0-9.]/g, '');

  // Fonction pour créer le state initial
  const createInitialState = (data?: ServiceFormData | null): ServiceFormData => {
    if (!data) {
      return {
        title: '',
        category: 'Coaching',
        price: '',
        description: '',
        features: [],
        popular: false,
        bestValue: false,
        originalPrice: '',
        duration: '',
        objective: '',
        note: '',
        paymentLink: ''
      }
    }
    
    const hasOriginalPrice = data.originalPrice && data.originalPrice.trim() !== '' && data.originalPrice !== 'null' && data.originalPrice !== 'undefined'
    
    return {
      ...data,
      price: cleanPrice(data.price || ''),
      originalPrice: hasOriginalPrice ? cleanPrice(data.originalPrice) : ''
    }
  }

  const [formData, setFormData] = useState<ServiceFormData>(() => createInitialState(initialData))
  const [newFeature, setNewFeature] = useState('')

  // Synchroniser le state quand initialData change
  useEffect(() => {
    setFormData(createInitialState(initialData))
  }, [initialData?.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked }))
  }

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData(prev => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
      setNewFeature('')
    }
  }

  const removeFeature = (index: number) => {
    setFormData(prev => ({ ...prev, features: prev.features.filter((_, i) => i !== index) }))
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-900">
            {initialData ? 'Modifier le Service' : 'Nouveau Service'}
          </h2>
          <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Titre</label>
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder="Ex: Coaching 1-to-1"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Catégorie</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none bg-white"
              >
                <option value="Coaching">Coaching</option>
                <option value="Massages">Massages</option>
                <option value="Cures">Cures</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={3}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
              placeholder="Description courte du service..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prix (en €)</label>
              <div className="relative">
                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none pr-8"
                  placeholder="50"
                  required
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Prix Barré (Optionnel)</label>
              <div className="relative flex gap-2">
                <div className="relative flex-1">
                  <input
                    name="originalPrice"
                    type="number"
                    value={formData.originalPrice || ''}
                    onChange={handleChange}
                    className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none pr-8"
                    placeholder="70"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">€</span>
                </div>
                {formData.originalPrice ? (
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, originalPrice: '' }))}
                    className="px-3 py-2 bg-rose-500 text-white hover:bg-rose-600 border border-rose-500 hover:border-rose-600 rounded-lg transition-all flex items-center justify-center shadow-md font-bold"
                    title="Supprimer le prix barré"
                    style={{ minWidth: '44px' }}
                  >
                    <X size={18} strokeWidth={3} />
                  </button>
                ) : null}
              </div>
              <p className="text-xs text-slate-400">Laissez vide ou cliquez sur ✕ pour supprimer le prix barré</p>
            </div>
          </div>
          
           <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Durée</label>
              <input
                name="duration"
                value={formData.duration || ''}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder="Ex: 1h"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Objectif</label>
              <input
                name="objective"
                value={formData.objective || ''}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder="Ex: Détente"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Lien de Paiement (Stripe URL)</label>
            <input
              name="paymentLink"
              value={formData.paymentLink || ''}
              onChange={handleChange}
              className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none text-blue-600 underline-offset-2"
              placeholder="https://buy.stripe.com/..."
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Caractéristiques (Liste)</label>
            <div className="flex gap-2">
              <input
                value={newFeature}
                onChange={(e) => setNewFeature(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                className="flex-1 p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder="Ajouter une caractéristique..."
              />
              <button
                type="button"
                onClick={addFeature}
                className="bg-slate-100 hover:bg-slate-200 text-slate-900 p-2 rounded-lg"
              >
                <Plus size={20} />
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.features.map((feature, i) => (
                <span key={i} className="bg-slate-50 text-slate-700 px-3 py-1 rounded-full text-sm border border-slate-200 flex items-center gap-2">
                  {feature}
                  <button onClick={() => removeFeature(i)} className="hover:text-red-500">
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          </div>
          
           <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Note Spéciale</label>
              <input
                name="note"
                value={formData.note || ''}
                onChange={handleChange}
                className="w-full p-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-slate-900/10 outline-none"
                placeholder="Ex: Min. 5 personnes"
              />
            </div>

          <div className="flex gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.popular}
                onChange={(e) => handleCheckboxChange('popular', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-sm font-medium text-slate-700">Populaire</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.bestValue}
                onChange={(e) => handleCheckboxChange('bestValue', e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
              />
              <span className="text-sm font-medium text-slate-700">Meilleur Rapport Qualité/Prix</span>
            </label>
          </div>
        </div>

        <div className="p-6 border-t border-slate-100 flex justify-end gap-3 sticky bottom-0 bg-white rounded-b-2xl">
          <Button variant="outline" onClick={onCancel} className="rounded-xl">
            Annuler
          </Button>
          <Button 
            onClick={() => {
                // Ensure prices have € symbol
                const finalData = { ...formData };
                if (finalData.price && !finalData.price.includes('€')) {
                    finalData.price = `${finalData.price.trim()} €`;
                }
                // Si le prix barré est vide, on envoie null pour le supprimer
                // Sinon on ajoute le symbole € si nécessaire
                if (finalData.originalPrice && !finalData.originalPrice.includes('€')) {
                    finalData.originalPrice = `${finalData.originalPrice.trim()} €`;
                } else if (!finalData.originalPrice) {
                    finalData.originalPrice = null as any;
                }
                onSubmit(finalData);
            }} 
            disabled={isLoading}
            className="bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800"
          >
            {isLoading ? 'Sauvegarde...' : 'Enregistrer'}
          </Button>
        </div>
      </div>
    </div>
  )
}
