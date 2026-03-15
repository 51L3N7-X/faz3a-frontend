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
import { useUpdateSubCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils/form-error-handler";
import { SubCategory } from "@/types";

const editDepartmentSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  isActive: z.boolean(),
});

type EditDepartmentFormData = z.infer<typeof editDepartmentSchema>;

interface EditDepartmentDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  department: SubCategory;
  parentId: number;
}

export default function EditDepartmentDialog({
  open,
  setOpen,
  department,
  parentId,
}: EditDepartmentDialogProps) {
  const form = useForm<EditDepartmentFormData>({
    resolver: zodResolver(editDepartmentSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      isActive: true,
    },
  });

  const { mutate: updateDepartment, isPending } = useUpdateSubCategory(
    department.id.toString(),
    parentId.toString()
  );

  useEffect(() => {
    if (open && department) {
      form.reset({
        nameEn: department.nameEn,
        nameAr: department.nameAr,
        isActive: department.isActive,
      });
    }
  }, [open, department, form]);

  const onSubmit = (data: EditDepartmentFormData) => {
    updateDepartment(
      {
        ...data,
        type: "JOB",
      },
      {
        onSuccess: () => {
          toast.success("Department updated successfully");
          setOpen(false);
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
          <DialogTitle>Edit Department</DialogTitle>
          <DialogDescription>
            Update the department information. Changes will affect all related job positions.
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
                      placeholder="e.g., إدارة عليا"
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
                      placeholder="e.g., Senior Management"
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
                      Enable this department
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
                {isPending ? "Updating..." : "Update Department"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
