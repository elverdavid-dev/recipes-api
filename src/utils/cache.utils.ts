import { Cache } from 'cache-manager'

export function generateCacheKey(page: number, limit: number): string {
  return `recipes_list_page_${page}_${limit}`
}

export async function deleteCacheByKey(
  cacheManager: Cache,
  cacheKey: string
): Promise<void> {
  await cacheManager.del(cacheKey)
}

export async function getDataCache(cacheManager: Cache, cacheKey: string) {
  const dataFromCache = await cacheManager.get(cacheKey)
  return dataFromCache
}
