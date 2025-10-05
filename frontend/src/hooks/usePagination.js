import { useState } from 'react';

export const usePagination = (initialLimit = 20) => {
  const [limit, setLimit] = useState(initialLimit);
  const [offset, setOffset] = useState(0);

  const next = () => setOffset(offset + limit);
  const prev = () => setOffset(Math.max(0, offset - limit));
  const reset = () => setOffset(0);

  return { limit, offset, next, prev, reset, setLimit, setOffset };
};
