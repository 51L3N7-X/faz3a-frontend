"use client";

import React from "react";
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
import { useCreateSubCategory } from "@/hooks/data/use-categories";
import { toast } from "sonner";
import { handleApiError } from "@/lib/utils/form-error-handler";

const createJobPositionSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  isActive: z.boolean(),
});

type CreateJobPositionFormData = z.infer<typeof createJobPositionSchema>;

interface CreateJobPositionDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  parentId: number;
  departmentName: string;
  mainCategoryName: string;
}

export default function CreateJobPositionDialog({
  open,
  setOpen,
  parentId,
  departmentName,
  mainCategoryName,
}: CreateJobPositionDialogProps) {
  const form = useForm<CreateJobPositionFormData>({
    resolver: zodResolver(createJobPositionSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      isActive: true,
    },
  });

  const { mutate: createJobPosition, isPending } =
    useCreateSubCategory(parentId, true);

  const onSubmit = (data: CreateJobPositionFormData) => {
    createJobPosition(
      {
        data: {
          ...data,
          type: "JOB",
        },
        parentId,
      },
      {
        onSuccess: () => {
          toast.success("Job position created successfully");
          form.reset();
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
          <DialogTitle>Create New Job Position</DialogTitle>
          <DialogDescription>
            Create a new job position under &quot;{departmentName}&quot; in &quot;
            {mainCategoryName}&quot;. This will be a specific job title that
            candidates can apply for.
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
                    <Input placeholder="e.g., مدير عام" {...field} dir="rtl" />
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
                    <Input placeholder="e.g., General Manager" {...field} />
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
                      Enable this job position
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
                {isPending ? "Creating..." : "Create Job Position"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
