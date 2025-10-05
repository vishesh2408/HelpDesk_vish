export const getLimitOffset = (query) => {
  const limit = parseInt(query.limit) || 10;
  const offset = parseInt(query.offset) || 0;
  return { limit, offset };
};
