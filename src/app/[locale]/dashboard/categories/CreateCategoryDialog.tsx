"use client";

import type {
  CreateCategoryFormData,
  CreateCategoryFormInput,
} from "@/lib/schemas/category";
import { zodResolver } from "@hookform/resolvers/zod/dist/zod.js";
import React from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CreateCategorySchema } from "@/lib/schemas/category";
import { Switch } from "@/components/ui/switch";
import { handleApiError } from "@/lib/utils/form-error-handler";
import { useCreateCategory } from "@/hooks/data/use-categories";

export default function CreateCategoryDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: boolean) => void;
}) {
  const form = useForm<CreateCategoryFormInput>({
    resolver: zodResolver(CreateCategorySchema),
    defaultValues: {
      nameEn: "",
      nameAr: "",
      type: "SERVICE",
      isActive: true,
    },
  });

  const { mutateAsync: createCategory } = useCreateCategory();

  const handleSubmit: SubmitHandler<CreateCategoryFormInput> = async (data) => {
    // try {
      await createCategory(data as CreateCategoryFormData, {
        onSuccess: () => {
          toast.success("Category created successfully");
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
      });
    // } catch (error: unknown) {}
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen: boolean) => {
        form.reset();
        setOpen(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add new category</DialogTitle>
          <DialogDescription>Enter the data below.</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="nameEn"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel> English name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="English name"
                        className="w-full"
                        {...field}
                      />
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
                    <FormLabel>Arabic name *</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Arabic name"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="SERVICE">Service</SelectItem>
                        <SelectItem value="JOB">Job</SelectItem>
                      </SelectContent>
                    </Select>
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
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Add Category</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
