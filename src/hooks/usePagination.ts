import { useState, useMemo, useCallback } from 'react';

export interface UsePaginationProps<T = any> {
  items: T[];
  itemsPerPage: number;
  initialPage?: number;
}

export interface UsePaginationReturn<T = any> {
  currentPage: number;
  totalPages: number;
  paginatedItems: T[];
  startIndex: number;
  endIndex: number;
  goToPage: (page: number) => void;
  nextPage: () => void;
  previousPage: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

export function usePagination<T = any>({
  items,
  itemsPerPage,
  initialPage = 1,
}: UsePaginationProps<T>): UsePaginationReturn<T> {
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Calcular total de páginas
  const totalPages = useMemo(() => {
    return Math.ceil(items.length / itemsPerPage);
  }, [items.length, itemsPerPage]);

  // Garantir que currentPage está dentro dos limites
  const validCurrentPage = useMemo(() => {
    if (totalPages === 0) return 1;
    return Math.max(1, Math.min(currentPage, totalPages));
  }, [currentPage, totalPages]);

  // Calcular itens da página atual
  const { paginatedItems, startIndex, endIndex } = useMemo(() => {
    const start = (validCurrentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return {
      paginatedItems: items.slice(start, end),
      startIndex: start,
      endIndex: Math.min(end, items.length),
    };
  }, [items, validCurrentPage, itemsPerPage]);

  // Funções de navegação
  const goToPage = useCallback((page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(newPage);
    // Scroll suave para o topo
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [totalPages]);

  const nextPage = useCallback(() => {
    if (validCurrentPage < totalPages) {
      goToPage(validCurrentPage + 1);
    }
  }, [validCurrentPage, totalPages, goToPage]);

  const previousPage = useCallback(() => {
    if (validCurrentPage > 1) {
      goToPage(validCurrentPage - 1);
    }
  }, [validCurrentPage, goToPage]);

  const canGoNext = validCurrentPage < totalPages;
  const canGoPrevious = validCurrentPage > 1;

  return {
    currentPage: validCurrentPage,
    totalPages,
    paginatedItems,
    startIndex,
    endIndex,
    goToPage,
    nextPage,
    previousPage,
    canGoNext,
    canGoPrevious,
  };
}
