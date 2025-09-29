import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

export type TablePaginationProps = {
  /**
   * Current active page (1-based index)
   */
  currentPage: number;

  /**
   * Total number of pages available
   */
  totalPages: number;

  /**
   * Number of items per page
   */
  pageSize: number;

  /**
   * Total number of items across all pages
   */
  totalItems: number;

  /**
   * Callback when page changes
   * @param page - The new page number (1-based)
   */
  onPageChange: (page: number) => void;

  /**
   * Callback when page size changes
   * @param pageSize - The new items per page
   */
  onPageSizeChange: (pageSize: number) => void;

  /**
   * Available page size options
   * @default [10, 20, 50, 100]
   */
  pageSizeOptions?: number[];

  /**
   * Right-to-left layout support
   * @default false
   */
  isRTL?: boolean;

  /**
   * Customizable labels
   */
  labels?: {
    page?: string;
    of?: string;
    rowsDisplayed?: string;
    rowsPerPage?: string;
  };
};


const DEFAULT_PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

export function TablePagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = DEFAULT_PAGE_SIZE_OPTIONS,
}: TablePaginationProps) {
  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const t = useTranslations('TablePagination');

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between gap-4 px-2 sm:px-4 py-3 border-t"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <div
        className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        {isRTL
          ? (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )
          : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronsLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                >
                  <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 sm:h-9 sm:w-9"
                  onClick={() => onPageChange(totalPages)}
                  disabled={currentPage >= totalPages}
                >
                  <ChevronsRight className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </>
            )}
      </div>

      <div
        className={`flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm ${isRTL ? 'sm:flex-row-reverse' : ''}`}
      >
        <span className="hidden sm:inline">
          {t('page')}
          {' '}
          {currentPage}
          {' '}
          {t('of')}
          {' '}
          {totalPages}
        </span>

        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm">{t('rowsPerPage')}</span>
          <Select
            value={pageSize.toString()}
            onValueChange={value => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="h-7 sm:h-8 w-auto text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size: number) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <span className="text-xs sm:text-sm">
          {startItem}
          -
          {endItem}
          {' '}
          {t('of')}
          {' '}
          {totalItems}
        </span>
      </div>
    </div>
  );
}
