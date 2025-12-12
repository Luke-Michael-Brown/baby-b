export default function createCacheMap(storageKey: string) {
  let cacheMap = new Map()
  const raw = localStorage.getItem(storageKey)
  if (raw) {
    try {
      const entries = JSON.parse(raw)
      if (Array.isArray(entries)) {
        cacheMap = new Map(entries)
      }
    } catch {
      cacheMap = new Map()
    }
  }

  const addToCacheMap = (key: string, value: string) => {
    cacheMap.set(key, value)
    localStorage.setItem(storageKey, JSON.stringify(Array.from(cacheMap.entries())))
  }

  const resetCacheMap = () => {
    cacheMap = new Map()
    localStorage.setItem(storageKey, '[]')
  }

  return {
    cacheMap,
    addToCacheMap,
    resetCacheMap,
  }
}
