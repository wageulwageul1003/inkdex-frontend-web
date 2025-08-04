'use client';

import React from 'react';

import { useContent } from './useContent';

import CButton from '@/components/shared/CButton';
import CIconButton from '@/components/shared/IconButton';
import FormFields, { FormFieldType } from '@/components/shared/form-fields';
import { Icons } from '@/components/shared/icons';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  IInstitutionListResponse,
  useGetInstitutionList,
} from '@/hooks/auth/useGetInstitutionList';

interface InstitutionSearchModalProps {
  onSelectInstitution?: (institutionName: string) => void;
}

const InstitutionSearchModal: React.FC<InstitutionSearchModalProps> = ({
  onSelectInstitution,
}) => {
  const { form, onSubmit, page, pageSize } = useContent();
  const { data } = useGetInstitutionList({
    // page: page.toString(),
    // size: pageSize.toString(),
    searchKeyword: form.getValues('searchKeyword'),
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <CButton type="button" buttonType="contained" text="검색" />
      </DialogTrigger>
      <DialogContent className="h-[70%] w-full min-w-[328px] lg:max-w-[720px]">
        <div className="flex min-h-0 flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="font-body1-bold text-gray-500">기관명 검색</span>
            <DialogClose asChild>
              <CIconButton
                buttonType="only"
                size="small"
                icon={<Icons.close className="h-m w-m fill-gray-700" />}
              />
            </DialogClose>
          </div>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex items-center gap-1">
              <FormFields
                fieldType={FormFieldType.INPUT}
                control={form.control}
                placeholder="기관명 검색"
                name="searchKeyword"
                className="w-full"
              />
              <CButton type="button" buttonType="contained" text="검색" />
            </div>
          </form>
          <DialogClose asChild>
            <div className="mt-4 flex-1 overflow-y-auto">
              <div className="flex flex-col rounded border border-gray-100 px-2">
                {data?.data.map((item: IInstitutionListResponse) => (
                  <div
                    key={item.uuid}
                    className="flex cursor-pointer p-3 hover:bg-gray-100"
                    onClick={() => {
                      if (onSelectInstitution) {
                        onSelectInstitution(item.institutionName);
                      }
                    }}
                  >
                    <span className="font-body1 text-gray-700">
                      {item.institutionName}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </DialogClose>
          <div className="flex justify-end">
            <DialogClose asChild>
              <CButton
                type="button"
                size="medium"
                buttonType="subtle"
                text="닫기"
                className="w-fit"
              />
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InstitutionSearchModal;
