"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TablePagination } from "@/components/table/table-pagination";
import { LoadingComponent } from "@/components/table/loading-table";
import { useMainCategories } from "@/hooks/data/use-categories";
import { useJobCategoryColumns } from "./columns";

type JobsDataTableProps = {
  searchQuery?: string;
};

export function JobsDataTable({ searchQuery = "" }: JobsDataTableProps) {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const [sorting, setSorting] = useState<'name:asc' | 'name:desc' | 'createdAt:asc' | 'createdAt:desc'>('createdAt:desc');

  const { mainCategories, totalPages, isLoading, totalItems, isFetching } = useMainCategories(
    {
      ...(searchQuery.trim() ? { search: searchQuery.trim() } : {}),
      type: "JOB", // Only job categories
      page: pagination.pageIndex + 1,
      limit: pagination.pageSize,
      sort: sorting
    }
  );

  const { columns } = useJobCategoryColumns({
    onSortChange: (newSort) => setSorting(newSort as 'name:asc' | 'name:desc')
  });

  const table = useReactTable({
    data: mainCategories,
    columns,
    getCoreRowModel: getCoreRowModel(),
    pageCount: totalPages || -1,
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
  });

  const getNoResultsMessage = () => {
    if (searchQuery.trim()) {
      return "No job categories found.";
    }
    return "No job categories available.";
  };

  return (
    <div className="rounded-md border shadow-sm">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-inherit">
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading || isFetching ? (
            <LoadingComponent table={table}></LoadingComponent>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              return (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="odd:bg-accent even:bg-white"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {getNoResultsMessage()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <TablePagination
        currentPage={table.getState().pagination.pageIndex + 1}
        totalPages={totalPages || 1}
        pageSize={pagination.pageSize}
        totalItems={totalItems || 0}
        onPageChange={(page) => table.setPageIndex(page - 1)}
        onPageSizeChange={(size) => table.setPageSize(size)}
      />
    </div>
  );
}
