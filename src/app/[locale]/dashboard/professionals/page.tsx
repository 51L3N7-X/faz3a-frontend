"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { Button } from "@/components/ui/button";
import { PlusIcon as Plus } from "lucide-react";

import { useParams } from "next/navigation";
import { useCategory } from "@/hooks/data/use-categories";
import { ProfessionalsDataTable } from "./DataTable";
import { CreateProfessionalDialog } from "./CreateDialog";
// import { SubCategoriesDataTable } from "./DataTable";
// import { CreateSubCategoryDialog } from "./CreateSubCategoryDialog";

export default function ProfessionalsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Professionals</h1>
        <CreateProfessionalDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </CreateProfessionalDialog>
      </header>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search professionals..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <ProfessionalsDataTable searchQuery={searchQuery} />
      </div>
    </>
  );
}
