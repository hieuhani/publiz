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

export const parseContext = (context: string | undefined) => {
  if (!context) {
    return undefined;
  }
  try {
    const parsedContext = JSON.parse(context);
    // TODO: Temporary solution to remove moderationRequired from context
    delete parsedContext.moderationRequired;
    return parsedContext;
  } catch (e) {
    return undefined;
  }
};
