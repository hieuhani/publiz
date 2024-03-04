export const normalizeMetadata = (metadata: Record<string, any>) =>
  Object.keys(metadata).reduce((prev, current) => {
    if (!metadata[current]) {
      return prev;
    }
    return {
      ...prev,
      [current]: `${metadata[current]}`,
    };
  }, {});
