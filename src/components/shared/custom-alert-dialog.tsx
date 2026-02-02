'use client';

import React, { ReactNode } from 'react';

import { Icons } from './icons';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';

interface CustomAlertDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: ReactNode;
  cancelText?: string;
  confirmText?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  type?: 'warning' | 'error' | 'success';
}

export const CustomAlertDialog = ({
  isOpen,
  onOpenChange,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  onCancel,
  onConfirm,
  type = 'warning',
}: CustomAlertDialogProps) => {
  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onOpenChange(false);
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <div className="flex flex-col items-center gap-1">
          {type === 'warning' && (
            <Icons.emergencyHomeFill className="size-6 fill-gray-05" />
          )}
          <p className="font-m-1 text-black">{title}</p>

          {description && (
            <div className="font-s-2 text-center text-gray-05">
              {description}
            </div>
          )}
        </div>

        <AlertDialogFooter>
          <AlertDialogAction onClick={handleConfirm} className="flex-1">
            {confirmText}
          </AlertDialogAction>

          <AlertDialogCancel
            onClick={() => {
              onOpenChange(false);
              onCancel?.();
            }}
            className="flex-1"
          >
            {cancelText}
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
