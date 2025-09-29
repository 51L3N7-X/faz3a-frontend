"use client";

import { useEffect } from "react";
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
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  CreateSubCategoryFormInput,
  CreateSubCategorySchema,
} from "@/lib/schemas/category";
import { handleApiError } from "@/lib/utils/form-error-handler";
import { useUpdateSubCategory } from "@/hooks/data/use-categories";
import type { SubCategory } from "@/types/api.types";

type EditSubCategoryDialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  subCategory: SubCategory;
  parentId: string;
};

export function EditSubCategoryDialog({
  open,
  setOpen,
  subCategory,
  parentId,
}: EditSubCategoryDialogProps) {
  const { mutate: updateSubCategory, isPending } = useUpdateSubCategory(
    subCategory.id.toString(),
    parentId
  );

  const form = useForm<CreateSubCategoryFormInput>({
    resolver: zodResolver(CreateSubCategorySchema),
    defaultValues: {
      nameEn: subCategory.nameEn,
      nameAr: subCategory.nameAr,
      isActive: subCategory.isActive,
    },
  });

  // Reset form with current data when dialog opens or subCategory changes
  useEffect(() => {
    if (open) {
      form.reset({
        nameEn: subCategory.nameEn,
        nameAr: subCategory.nameAr,
        isActive: subCategory.isActive,
      });
    }
  }, [open, subCategory, form]);

  function onSubmit(values: CreateSubCategoryFormInput) {
    updateSubCategory(
      {
        ...values,
        type: subCategory.type,
        isActive: values.isActive ?? true,
      },
      {
        onSuccess: () => {
          toast.success("Subcategory updated successfully");
          setOpen(false);
        },
        onError: (error) => {
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Subcategory</DialogTitle>
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
              {isPending ? "Updating..." : "Update Subcategory"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
