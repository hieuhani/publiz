import { LRUCache } from "lru-cache";
import { getPostId, Container } from "@publiz/core";

const cache = new LRUCache<string, number>({
  max: 1000,
});

export const getPostIdFromCache = async (
  container: Container,
  id: string
): Promise<number> => {
  const cacheKey = `postId:${id}`;
  if (cache.has(cacheKey)) {
    const value = cache.get(cacheKey);
    if (value) {
      return value;
    }
  }
  const postId = await getPostId(container, id);
  cache.set(cacheKey, postId);
  return postId;
};
