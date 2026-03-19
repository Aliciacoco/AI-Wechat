'use client'

import { Search, Sparkles } from 'lucide-react'
import { useState } from 'react'

interface SuperSearchProps {
  onSearch: (query: string) => void
  placeholder?: string
}

export default function SuperSearch({ onSearch, placeholder = '今天发什么？试试输入快捷指令...' }: SuperSearchProps) {
  const [query, setQuery] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div
        className="relative max-w-3xl mx-auto"
        style={{
          boxShadow: isFocused ? 'var(--shadow-lg)' : 'var(--shadow-md)',
          transition: 'box-shadow 0.2s',
        }}
      >
        <div className="relative">
          <div className="absolute left-5 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <Search size={20} style={{ color: isFocused ? 'var(--primary)' : 'var(--foreground-tertiary)' }} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className="w-full pl-14 pr-32 py-4 text-base rounded-xl border bg-white transition-all outline-none"
            style={{
              borderColor: isFocused ? 'var(--primary)' : 'var(--border)',
              color: 'var(--foreground)',
            }}
          />
          <button
            type="submit"
            disabled={!query.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            style={{
              backgroundColor: query.trim() ? 'var(--primary)' : 'var(--foreground-tertiary)',
            }}
            onMouseEnter={(e) => {
              if (query.trim()) {
                e.currentTarget.style.backgroundColor = 'var(--primary-hover)'
              }
            }}
            onMouseLeave={(e) => {
              if (query.trim()) {
                e.currentTarget.style.backgroundColor = 'var(--primary)'
              }
            }}
          >
            <Sparkles size={14} />
            AI 标题
          </button>
        </div>
      </div>
    </form>
  )
}
