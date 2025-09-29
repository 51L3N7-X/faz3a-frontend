"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import { ReactNode } from "react";

type DeleteConfirmationDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  children?: ReactNode;
};

export function DeleteConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
  title = "Are you sure?",
  description = "This action cannot be undone. This will permanently delete the item.",
  confirmText = "Delete",
  cancelText = "Cancel",
  children,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {children || (
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700"
            >
              {isPending ? "Deleting..." : confirmText}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      )}
    </AlertDialog>
  );
}
