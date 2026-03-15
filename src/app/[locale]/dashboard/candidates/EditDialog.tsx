"use client";

import { MultiSelect } from "@/components/multi-select";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateCandidate } from "@/hooks/data/use-candidate";
import { Switch } from "@/components/ui/switch";
import {
  useCategoryHierarchy,
  useMainCategories,
  useSubCategories,
  useSubSubCategories,
} from "@/hooks/data/use-categories";
import { useGovernorates } from "@/hooks/data/use-governorates";
import {
  UpdateCandidateFormInput,
  UpdateCandidateSchema,
} from "@/lib/schemas/candidates";
import { cn } from "@/lib/utils";
import { handleApiError } from "@/lib/utils/form-error-handler";
import { Candidate } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type EditCandidateDialogProps = {
  children?: React.ReactNode;
  candidate: Candidate;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export function EditCandidateDialog({
  children,
  candidate,
  open: controlledOpen,
  onOpenChange,
}: EditCandidateDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = onOpenChange || setInternalOpen;

  // Determine the first-leaf category to resolve the hierarchy from
  const firstCategoryId = candidate.categories[0]?.id ?? null;

  // For candidates created via the mobile app, parentCategoryId / subCategoryId
  // may be null. useCategoryHierarchy will automatically walk up the tree:
  //   jobPosition → department (subCategoryId) → mainCategory (parentCategoryId)
  const {
    subCategoryId: resolvedSubCategoryId,
    mainCategoryId: resolvedMainCategoryId,
    isLoading: isResolvingHierarchy,
  } = useCategoryHierarchy(
    // Only resolve when the backend fields are missing
    !candidate.parentCategoryId && firstCategoryId ? firstCategoryId : null,
  );

  // The effective IDs: prefer values already on the candidate (frontend-created),
  // fall back to the resolved values (app-created)
  const effectiveMainCategoryId =
    candidate.parentCategoryId || resolvedMainCategoryId || null;
  const effectiveSubCategoryId =
    candidate.subCategoryId || resolvedSubCategoryId || null;

  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<
    number | null
  >(effectiveMainCategoryId);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<
    number | null
  >(effectiveSubCategoryId);
  const [governorateOpen, setGovernorateOpen] = useState(false);

  const { mutateAsync: updateCandidate, isPending } = useUpdateCandidate();

  const { governorates } = useGovernorates({ limit: 1000 });
  const { mainCategories } = useMainCategories({
    type: "JOB",
    limit: 1000,
  });
  const { subCategories } = useSubCategories(selectedMainCategoryId || 0, {
    limit: 1000,
  });
  const { subSubCategories } = useSubSubCategories(selectedSubCategoryId || 0, {
    limit: 1000,
  });

  const form = useForm<UpdateCandidateFormInput>({
    resolver: zodResolver(UpdateCandidateSchema),
    defaultValues: {
      email: candidate.user.email,
      phone: candidate.user.phone,
      firstName: candidate.user.firstName,
      lastName: candidate.user.lastName,
      password: "",
      categoryIds: candidate.categories.map((category) => category.id),
      governorateId: candidate.governorate.id,
      candidatePhone: candidate.phone,
      yearsOfExp: candidate.yearsOfExp,
      bio: candidate.bio,
      isActive: candidate.isActive,
    },
  });

  // When switching to a different candidate, reset all state
  useEffect(() => {
    form.reset({
      email: candidate.user.email,
      phone: candidate.user.phone,
      firstName: candidate.user.firstName,
      lastName: candidate.user.lastName,
      password: "",
      categoryIds: candidate.categories.map((category) => category.id),
      governorateId: candidate.governorate.id,
      candidatePhone: candidate.phone,
      yearsOfExp: candidate.yearsOfExp,
      bio: candidate.bio,
      isActive: candidate.isActive,
    });
    // Reset selects to the effective values at the time of candidate change;
    // the resolver effect below will update once API data arrives.
    setSelectedMainCategoryId(candidate.parentCategoryId || null);
    setSelectedSubCategoryId(candidate.subCategoryId || null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candidate.id]);

  // Sync resolved hierarchy into state once the API calls complete
  useEffect(() => {
    if (effectiveMainCategoryId && !selectedMainCategoryId) {
      setSelectedMainCategoryId(effectiveMainCategoryId);
    }
  }, [effectiveMainCategoryId, selectedMainCategoryId]);

  useEffect(() => {
    if (effectiveSubCategoryId && !selectedSubCategoryId) {
      setSelectedSubCategoryId(effectiveSubCategoryId);
    }
  }, [effectiveSubCategoryId, selectedSubCategoryId]);

  async function onSubmit(values: UpdateCandidateFormInput) {
    // Only include password if it was changed (not empty)
    const updateData = {
      ...values,
      password: values.password || undefined,
      isActive: values.isActive ?? true,
    };

    await updateCandidate(
      {
        id: candidate.id,
        ...updateData,
      },
      {
        onSuccess: () => {
          toast.success("Candidate updated successfully");
          setOpen(false);
        },
        onError: (error) => {
          handleApiError(error, {
            setError: form.setError,
            formFields: form.control._fields,
            skipUnauthorized: true,
          });
        },
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children && <DialogTrigger asChild>{children}</DialogTrigger>}
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Candidate</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* First Name */}
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name */}
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter email address"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password - Optional for updates */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>
                      Password (Leave blank to keep unchanged)
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter new password"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Personal Phone */}
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Candidate Phone */}
              <FormField
                control={form.control}
                name="candidatePhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Candidate Phone</FormLabel>
                    <FormControl>
                      <Input placeholder="+1234567890" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Years of Experience */}
              <FormField
                control={form.control}
                name="yearsOfExp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Years of Experience</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        max="50"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Governorate */}
              <FormField
                control={form.control}
                name="governorateId"
                render={({ field }) => {
                  return (
                    <FormItem className="flex flex-col">
                      <FormLabel>Governorate *</FormLabel>
                      <Popover
                        open={governorateOpen}
                        onOpenChange={setGovernorateOpen}
                        modal
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            className="w-full justify-between"
                          >
                            {field.value
                              ? governorates?.find(
                                  (gov) =>
                                    gov.id.toString() ===
                                    field.value.toString(),
                                )?.name
                              : "Select governorate"}
                            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search governorate..." />
                            <CommandList>
                              <CommandEmpty>No governorates found</CommandEmpty>
                              <CommandGroup>
                                {governorates?.map((gov) => (
                                  <CommandItem
                                    key={gov.id}
                                    value={gov.name}
                                    onSelect={() => {
                                      form.setValue("governorateId", gov.id);
                                      setGovernorateOpen(false);
                                    }}
                                  >
                                    <CheckIcon
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        gov.id.toString() ===
                                          field.value?.toString()
                                          ? "opacity-100"
                                          : "opacity-0",
                                      )}
                                    />
                                    {gov.name}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              {/* Main Category Selection */}
              <FormField
                control={form.control}
                name="categoryIds"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Main Category *</FormLabel>
                    <FormControl>
                      <Select
                        value={selectedMainCategoryId?.toString() || ""}
                        onValueChange={(value) => {
                          const categoryId = parseInt(value);
                          setSelectedMainCategoryId(categoryId);
                          // Reset department and job positions when main category changes
                          setSelectedSubCategoryId(null);
                          field.onChange([]);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a main category" />
                        </SelectTrigger>
                        <SelectContent>
                          {mainCategories?.map((category) => (
                            <SelectItem
                              key={category.id}
                              value={category.id.toString()}
                            >
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Department Selection */}
              {selectedMainCategoryId && (
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Department *</FormLabel>
                      <FormControl>
                        <Select
                          value={selectedSubCategoryId?.toString() || ""}
                          onValueChange={(value) => {
                            const categoryId = parseInt(value);
                            setSelectedSubCategoryId(categoryId);
                            // Reset job positions when department changes
                            field.onChange([]);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a department" />
                          </SelectTrigger>
                          <SelectContent>
                            {subCategories?.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Job Positions Multi-Select */}
              {selectedSubCategoryId && (
                <FormField
                  control={form.control}
                  name="categoryIds"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2">
                      <FormLabel>Job Positions *</FormLabel>
                      <FormControl>
                        <MultiSelect
                          options={
                            subSubCategories?.map((subSubCategory) => ({
                              label: subSubCategory.name,
                              value: subSubCategory.id.toString(),
                            })) || []
                          }
                          onValueChange={(values) => {
                            const categoryIds = values.map((val) =>
                              parseInt(val),
                            );
                            field.onChange(categoryIds);
                          }}
                          defaultValue={field.value.map((id) => id.toString())}
                          placeholder="Select job positions"
                          variant="default"
                          animation={0.2}
                          maxCount={3}
                          searchable={true}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {/* Bio */}
              <FormField
                control={form.control}
                name="bio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <textarea
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                        placeholder="Enter candidate bio"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Active Status Switch */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 md:col-span-2">
                    <div className="space-y-0.5">
                      <FormLabel>Active Status</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value ?? true}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending || isResolvingHierarchy}
            >
              {isPending
                ? "Updating..."
                : isResolvingHierarchy
                  ? "Loading categories..."
                  : "Update Candidate"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
