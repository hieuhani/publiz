import { LRUCache } from "lru-cache";
import { getOrganizationId, Container } from "@publiz/core";

const cache = new LRUCache<string, number>({
  max: 500,
});

export const getOrganizationIdFromCache = async (
  container: Container,
  id: string
): Promise<number> => {
  const cacheKey = `organizationId:${id}`;
  if (cache.has(cacheKey)) {
    const value = cache.get(cacheKey);
    if (value) {
      return value;
    }
  }
  const organizationId = await getOrganizationId(container, id);
  cache.set(cacheKey, organizationId);
  return organizationId;
};
