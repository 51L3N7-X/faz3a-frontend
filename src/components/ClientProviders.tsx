"use client";

import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";
import { queryClientConfig } from "@/lib/utils/query-client";
import { Toaster } from "sonner";

type ClientProvidersProps = {
  children: ReactNode;
};

export default function ClientProviders({ children }: ClientProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient(queryClientConfig)
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Toaster position="top-center" richColors />
    </QueryClientProvider>
  );
}
