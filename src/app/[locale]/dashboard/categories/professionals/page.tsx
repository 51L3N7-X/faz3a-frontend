"use client";

import React, { useMemo, useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus, ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { ProfessionalsDataTable } from "./ProfessionalsDataTable";
import CreateProfessionalCategoryDialog from "./CreateProfessionalCategoryDialog";

export default function ProfessionalCategoriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const dataTableProps = useMemo(
    () => ({
      searchQuery,
    }),
    [searchQuery]
  );

  return (
    <>
      <header className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/categories">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Professional Services</h1>
            <p className="text-muted-foreground">Main service categories</p>
          </div>
        </div>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create New Category
        </Button>
      </header>

      <CreateProfessionalCategoryDialog
        open={isCreateDialogOpen}
        setOpen={setIsCreateDialogOpen}
      />

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search professional categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <ProfessionalsDataTable {...dataTableProps} />
      </div>
    </>
  );
}
