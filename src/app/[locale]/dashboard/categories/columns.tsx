"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MainCategory } from "@/types";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "@/i18n/navigation";
import React from "react";
import EditCategoryDialog from "./EditCategoryDialog";
import { useDeleteCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { handleDeleteApiError } from "@/lib/utils/form-error-handler";

type UseCategoryColumnsProps = {
  onSortChange?: (sort: string) => void;
};

const ActionsCell = ({ category }: { category: MainCategory }) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = React.useState(false);
  const { mutate: deleteCategory, isPending } = useDeleteCategory();

  const handleDelete = () => {
    deleteCategory(category.id, {
      onSuccess: () => {
        toast.success("Category deleted successfully");
      },
      onError: (error) => {
        handleDeleteApiError(error);
      },
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        variant="ghost"
        size="icon"
        className="h-8 w-8 cursor-pointer"
        onClick={() => router.push(`/dashboard/categories/${category.id}`)}
      >
        <Eye className="h-4 w-4" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0 cursor-pointer">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => setIsEditOpen(true)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="text-red-600"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditCategoryDialog
        open={isEditOpen}
        setOpen={setIsEditOpen}
        category={category}
      />
      <DeleteConfirmationDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        onConfirm={handleDelete}
        isPending={isPending}
        description={`This action cannot be undone. This will permanently delete the category "${category.name}".`}
      />
    </div>
  );
};

export const useCategoryColumns = ({
  onSortChange,
}: UseCategoryColumnsProps = {}) => {
  const columns: ColumnDef<MainCategory>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "name",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              const newSort =
                column.getIsSorted() === "asc" ? "name:desc" : "name:asc";
              onSortChange?.(newSort);
              column.toggleSorting(column.getIsSorted() === "asc");
            }}
          >
            Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        return row.getValue("isActive") ? "Active" : "Inactive";
      },
    },
    {
      id: "actions",
      cell: ({ row }) => <ActionsCell category={row.original} />,
    },
  ];

  return { columns };
};
