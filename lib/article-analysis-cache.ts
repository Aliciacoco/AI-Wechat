// Article analysis cache — singleton, persisted to localStorage
// Call load() once on app init, then get() anywhere synchronously

const CACHE_KEY = 'article_analysis_cache_v2'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days

interface CacheEntry {
  reasons: string[]
  ts: number
}

class ArticleAnalysisCache {
  private map: Map<string, string[]> = new Map()
  private loading = false
  private loaded = false

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage()
    }
  }

  private loadFromStorage() {
    try {
      const raw = localStorage.getItem(CACHE_KEY)
      if (!raw) return
      const stored: Record<string, CacheEntry> = JSON.parse(raw)
      const now = Date.now()
      let anyValid = false
      for (const [id, entry] of Object.entries(stored)) {
        if (now - entry.ts < CACHE_TTL_MS) {
          this.map.set(id, entry.reasons)
          anyValid = true
        }
      }
      if (anyValid) this.loaded = true
    } catch {
      // ignore
    }
  }

  private saveToStorage() {
    try {
      const now = Date.now()
      const stored: Record<string, CacheEntry> = {}
      for (const [id, reasons] of this.map.entries()) {
        stored[id] = { reasons, ts: now }
      }
      localStorage.setItem(CACHE_KEY, JSON.stringify(stored))
    } catch {
      // ignore
    }
  }

  isLoaded() {
    return this.loaded
  }

  entries(): [string, string[]][] {
    return Array.from(this.map.entries())
  }

  get(id: string): string[] | null {
    return this.map.get(id) ?? null
  }

  async load(articles: Array<{ id: string; title: string; views: number; likes: number }>) {
    if (this.loading) return
    // Only fetch articles not yet in cache
    const missing = articles.filter((a) => !this.map.has(a.id))
    if (missing.length === 0) {
      this.loaded = true
      return
    }

    this.loading = true
    try {
      const res = await fetch('/api/analyze-articles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articles: missing }),
      })
      const json = await res.json()
      if (json.success && json.data) {
        for (const [id, reasons] of Object.entries(json.data as Record<string, string[]>)) {
          this.map.set(id, reasons)
        }
        this.saveToStorage()
        this.loaded = true
      }
    } catch {
      // silently fail — components fall back to static analysis
    } finally {
      this.loading = false
    }
  }
}

// Singleton
export const articleAnalysisCache = new ArticleAnalysisCache()
