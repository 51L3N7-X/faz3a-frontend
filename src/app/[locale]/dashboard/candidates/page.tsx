"use client";

import { useState } from "react";
import { SearchInput } from "@/components/ui/search-input";
import { CandidatesDataTable } from "./DataTable";
import { CreateCandidateDialog } from "./CreateDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function CandidatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <>
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Candidates</h1>
        <CreateCandidateDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create New
          </Button>
        </CreateCandidateDialog>
      </header>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4">
          <SearchInput
            placeholder="Search candidates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onClear={() => setSearchQuery("")}
            className="max-w-sm"
          />
        </div>

        <CandidatesDataTable searchQuery={searchQuery}></CandidatesDataTable>
      </div>
    </>
  );
}
