"use client";

import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useUpdateCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils/form-error-handler";
import { MainCategory } from "@/types";

const editProfessionalCategorySchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  isActive: z.boolean(),
});

type EditProfessionalCategoryFormData = z.infer<typeof editProfessionalCategorySchema>;

interface EditProfessionalCategoryDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  category: MainCategory;
}

export default function EditProfessionalCategoryDialog({
  open,
  setOpen,
  category,
}: EditProfessionalCategoryDialogProps) {
  const form = useForm<EditProfessionalCategoryFormData>({
    resolver: zodResolver(editProfessionalCategorySchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      isActive: true,
    },
  });

  const { mutate: updateCategory, isPending } = useUpdateCategory(
    category.id.toString(),
    () => setOpen(false)
  );

  useEffect(() => {
    if (open && category) {
      form.reset({
        nameEn: category.nameEn,
        nameAr: category.nameAr,
        isActive: category.isActive,
      });
    }
  }, [open, category, form]);

  const onSubmit = (data: EditProfessionalCategoryFormData) => {
    updateCategory(
      {
        ...data,
        type: "SERVICE",
      },
      {
        onSuccess: () => {
          toast.success("Professional category updated successfully");
        },
        onError: (error) => {
          handleApiError(error, form);
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Professional Category</DialogTitle>
          <DialogDescription>
            Update the professional category information. Changes will affect all related services.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nameAr"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Arabic Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., خدمات تقنية"
                      {...field}
                      dir="rtl"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="nameEn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>English Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., Technical Services"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active Status</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Enable this professional category
                    </div>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Updating..." : "Update Category"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
