'use client';

import React, { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

interface CustomModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  isCancelButton?: boolean;
  cancelText?: string;
  confirmText?: string;
  onConfirm?: () => void;
  type?: 'warning' | 'error' | 'success';
}

export const CustomModal = ({
  isOpen,
  onOpenChange,
  title,
  description,
  isCancelButton = true,
  cancelText = '취소',
  confirmText = '확인',
  onConfirm,
  type = 'warning',
}: CustomModalProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent className="flex max-h-[70%] flex-col gap-0 p-0">
        <div className="p-4">
          <p className="font-m-1 text-black">{title}</p>
        </div>

        <div className="flex-1 overflow-y-auto px-4">{description}</div>

        <AlertDialogFooter className="w-full px-4 py-3">
          {isCancelButton && (
            <AlertDialogCancel onClick={() => onOpenChange(false)}>
              {cancelText}
            </AlertDialogCancel>
          )}
          <AlertDialogAction onClick={handleConfirm} className="w-full">
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
