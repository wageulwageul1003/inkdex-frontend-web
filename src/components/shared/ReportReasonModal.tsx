'use client';

import { useEffect, useState } from 'react';
import React from 'react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetReportReasonList } from '@/hooks/report/useGetReportReasonList';
import { usePostReport } from '@/hooks/report/usePostReport';
import { toast } from '../ui/sonner';
import { Icons } from './icons';

interface IReportReasonModal {
  isOpen: boolean;
  postUuid: string;
}

export default function ReportReasonModal({
  isOpen,
  postUuid,
}: IReportReasonModal) {
  const [selectedReportReasonUuid, setSelectedReportReasonUuid] = useState('');
  const [open, setOpen] = useState(isOpen);
  const { mutateAsync: postReport } = usePostReport();
  const { data: reportReasons } = useGetReportReasonList();

  useEffect(() => {
    setOpen(isOpen);
  }, [isOpen]);

  const onClickConfirm = async () => {
    await postReport({
      postUuid: postUuid || '',
      reportReasonUuid: selectedReportReasonUuid,
    }).then(() => {
      setOpen(false);
      toast.success('신고가 접수되었어요!');
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen} disableOverlayClick={true}>
      <DialogContent showCloseButton={false} closeOnOverlayClick={false}>
        <DialogHeader>
          <DialogTitle className="text-center">앱 접근 권한 안내</DialogTitle>
        </DialogHeader>

        <div className="mt-5 flex flex-col space-y-7 pb-8">
          {/* TODO: ui 수정 */}
          {reportReasons?.data.map((item) => (
            <div>
              <button
                key={item.uuid}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setSelectedReportReasonUuid(item.uuid);
                }}
                className="flex h-14 w-full items-center justify-between rounded-lg bg-gray-01 px-3 py-4"
              >
                <div className="flex items-center gap-3">
                  <span className="font-m-2 text-gray-08">{item.name}</span>
                </div>

                {selectedReportReasonUuid === item.uuid ? (
                  <Icons.radioButtonChecked className="fill-primary-01 size-6" />
                ) : (
                  <Icons.radioButtonUnchecked className="size-6 fill-gray-04" />
                )}
              </button>
            </div>
          ))}
        </div>

        <DialogFooter className="py-3">
          {/* TODO: ui 수정 */}
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClickConfirm();
            }}
            size="lg"
            variant="contained"
          >
            신고하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
