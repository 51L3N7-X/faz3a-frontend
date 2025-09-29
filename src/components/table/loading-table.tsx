import type { Table } from "@tanstack/react-table";
import { TableCell, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";

export function LoadingComponent<TData>({ table }: { table: Table<TData> }) {
  const columns = table.getVisibleLeafColumns();
  const columnCount = columns.length || 5; // Default to 5 columns if none available yet

  return (
    <>
      {Array.from({ length: 10 }).map((_, index) => (
         
        <TableRow key={index}>
          {columns.length > 0
            ? columns.map((column) => (
                <TableCell key={column.id}>
                  <Skeleton className="w-full h-6 bg-gray-100"></Skeleton>
                </TableCell>
              ))
            : Array.from({ length: columnCount }).map((_, colIndex) => (
                 
                <TableCell key={colIndex}>
                  <Skeleton className="w-full h-6 bg-gray-100"></Skeleton>
                </TableCell>
              ))}
        </TableRow>
      ))}
    </>
  );
}
