'use client'

import { ArrowLeft } from 'lucide-react'

export function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 text-slate-800 font-bold rounded-xl hover:bg-slate-300 transition-colors"
    >
      <ArrowLeft className="w-5 h-5" />
      Page précédente
    </button>
  )
}
