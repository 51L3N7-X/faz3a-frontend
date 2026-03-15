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

const editSubServiceSchema = z.object({
  nameEn: z.string().min(1, "English name is required"),
  nameAr: z.string().min(1, "Arabic name is required"),
  isActive: z.boolean(),
});

type EditSubServiceFormData = z.infer<typeof editSubServiceSchema>;

interface EditSubServiceDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  subService: SubCategory;
  parentId: number;
}

export default function EditSubServiceDialog({
  open,
  setOpen,
  subService,
  parentId,
}: EditSubServiceDialogProps) {
  const form = useForm<EditSubServiceFormData>({
    resolver: zodResolver(editSubServiceSchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      isActive: true,
    },
  });

  const { mutate: updateSubService, isPending } = useUpdateSubCategory(
    subService.id.toString(),
    parentId.toString(),
    true
  );

  useEffect(() => {
    if (open && subService) {
      form.reset({
        nameEn: subService.nameEn,
        nameAr: subService.nameAr,
        isActive: subService.isActive,
      });
    }
  }, [open, subService, form]);

  const onSubmit = (data: EditSubServiceFormData) => {
    updateSubService(
      {
        ...data,
        type: "SERVICE",
      },
      {
        onSuccess: () => {
          toast.success("Sub-service updated successfully");
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
          <DialogTitle>Edit Sub-Service</DialogTitle>
          <DialogDescription>
            Update the sub-service information.
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
                      placeholder="e.g., تأسيس كهرباء منازل"
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
                      placeholder="e.g., Home Wiring"
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
                      Enable this sub-service
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
                {isPending ? "Updating..." : "Update Sub-Service"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
