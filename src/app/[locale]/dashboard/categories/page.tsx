"use client";

import React, { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { DataTable } from "./DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus } from "lucide-react";
import CreateCategoryDialog from "./CreateCategoryDialog";

const MemoizedDataTable = React.memo(DataTable);

export default function MainCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<"SERVICE" | "JOB" | "ALL">(
    "ALL"
  );
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const dataTableProps = useMemo(
    () => ({
      searchQuery,
      typeFilter,
    }),
    [searchQuery, typeFilter]
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Main Categories</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New
        </Button>
      </header>

      <CreateCategoryDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
      />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search main categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
          <Select
            value={typeFilter}
            onValueChange={(value) => setTypeFilter(value as "SERVICE" | "JOB")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Types</SelectItem>
              <SelectItem value="SERVICE">Service</SelectItem>
              <SelectItem value="JOB">Job</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <MemoizedDataTable {...dataTableProps} />
      </div>
    </>
  );
}
