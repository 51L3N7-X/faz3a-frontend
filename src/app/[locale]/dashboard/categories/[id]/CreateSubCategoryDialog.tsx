"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCreateSubCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import {
  CreateSubCategorySchema,
  CreateSubCategoryFormInput,
} from "@/lib/schemas/category";
import { Switch } from "@/components/ui/switch";
import { handleApiError } from "@/lib/utils/form-error-handler";

type CreateSubCategoryDialogProps = {
  parentId: number;
  parentType: "SERVICE" | "JOB";
  children: React.ReactNode;
};

export function CreateSubCategoryDialog({
  parentId,
  parentType,
  children,
}: CreateSubCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const { mutate: createSubCategory, isPending } =
    useCreateSubCategory(parentId);

  const form = useForm<CreateSubCategoryFormInput>({
    resolver: zodResolver(CreateSubCategorySchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      isActive: true,
    },
  });

  function onSubmit(values: CreateSubCategoryFormInput) {
    createSubCategory(
      {
        data: {
          ...values,
          type: parentType,
          isActive: values.isActive ?? true,
        },
        parentId,
      },
      {
        onSuccess: () => {
          toast.success("Subcategory created successfully");
          form.reset();
          setOpen(false);
        },
        onError: (error: unknown) => {
          handleApiError(error, {
            setError: form.setError,
            formFields: form.control._fields,
            skipUnauthorized: true,
          });
        },
      }
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create Subcategory</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>English Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter English name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="nameAr"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Arabic Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter Arabic name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                      <FormLabel>Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Creating..." : "Create Subcategory"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
