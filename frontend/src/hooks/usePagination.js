import { useState } from "react";

export function usePagination(items, pageSize = 5) {
  const [page, setPage] = useState(1);
  // `items` can legitimately be null/undefined for a render or two while a
  // page's data is still loading (useResource/useLoans initialize `data` as
  // null before the request resolves), so this hook must not assume it
  // already has an array to work with.
  const list = items || [];
  const totalPages = Math.max(1, Math.ceil(list.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageItems = list.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const rangeStart = list.length ? (currentPage - 1) * pageSize + 1 : 0;
  const rangeEnd = Math.min(currentPage * pageSize, list.length);
  return {
    page: currentPage,
    setPage,
    totalPages,
    pageItems,
    rangeStart,
    rangeEnd,
  };
}
export default usePagination;
