import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({ currentPage, totalPages, onPageChange, className }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages: (number | string)[] = [];
    const delta = 1;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= currentPage - delta && i <= currentPage + delta)) {
        pages.push(i);
      } else if (pages[pages.length - 1] !== '...') {
        pages.push('...');
      }
    }
    return pages;
  };

  return (
    <nav className={cn('flex items-center justify-center gap-1 py-4', className)}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="rounded-app border border-white/10 bg-white/5 p-2 disabled:opacity-30"
      >
        <ChevronLeft className="h-4 w-4 text-white" />
      </button>

      <div className="flex items-center gap-1">
        {getPages().map((page, idx) =>
          page === '...' ? (
            <div key={`ellipsis-${idx}`} className="px-2">
              <MoreHorizontal className="h-4 w-4 text-white/20" />
            </div>
          ) : (
            <Button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              variant={currentPage === page ? 'default' : 'outline'}
              className={cn(
                'rounded-app h-9 min-w-[36px] text-xs font-black transition-all',
                currentPage === page
                  ? 'bg-primary text-black shadow-[0_0_15px_rgba(var(--primary-rgb),0.5)]'
                  : 'text-white/60 hover:bg-white/10 hover:text-white',
              )}
            >
              {page}
            </Button>
          ),
        )}
      </div>

      <Button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="rounded-app border border-white/10 bg-white/5 p-2 disabled:opacity-30"
      >
        <ChevronRight className="h-4 w-4 text-white" />
      </Button>
    </nav>
  );
}
