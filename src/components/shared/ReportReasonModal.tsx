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
          <DialogTitle className="text-left">게시물 신고</DialogTitle>
        </DialogHeader>

        <DialogHeader>
          <DialogTitle className="mt-1 text-left text-gray-08">
            신고 사유를 선택해주세요
          </DialogTitle>
        </DialogHeader>

        <div className="mt-1 flex flex-col space-y-3 pb-7">
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
                className="flex items-center justify-between gap-2"
              >
                {selectedReportReasonUuid === item.uuid ? (
                  <Icons.radioButtonChecked className="size-6 fill-gray-08" />
                ) : (
                  <Icons.radioButtonUnchecked className="size-6 fill-gray-05" />
                )}
                <span className="font-s-2 text-gray-08">{item.name}</span>
              </button>
            </div>
          ))}
        </div>

        <DialogFooter className="flex w-full flex-row gap-1 py-3">
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              setOpen(false);
            }}
            size="lg"
            variant="outline"
            className="w-full flex-1"
          >
            닫기
          </Button>
          <Button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onClickConfirm();
            }}
            size="lg"
            variant="contained"
            className="w-full flex-1"
          >
            신고하기
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
