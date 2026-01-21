import React, { useRef, useState } from 'react';
import { FieldError } from 'react-hook-form';

import { Icons } from '../icons';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FileInfo {
  name: string;
  url: string;
  size: number;
  file: File;
}

interface Props {
  field: any;
  disabled?: boolean;
  label?: string;
  maxSizeInMB?: number;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  message?: string;
  placeholder?: string;
  accept?: string[];
  id?: string;
  error?: FieldError;
}

const FileUploader: React.FC<Props> = (props) => {
  const {
    field,
    disabled,
    maxSizeInMB = 10,
    acceptedFileTypes = ['GIF', 'PNG', 'JPG'],
    maxFiles = 5,
    accept = [],
    error,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [fileError, setFileError] = useState<string>('');

  const getAcceptedTypesLabel = (): string => {
    const types = acceptedFileTypes.length > 0 ? acceptedFileTypes : accept;
    return types.map((t) => t.toUpperCase().replace('.', '')).join(',');
  };

  const validateFile = (file: File): boolean => {
    const fileSizeInMB = file.size / (1024 * 1024);
    if (maxSizeInMB && fileSizeInMB > maxSizeInMB) {
      setFileError(
        `파일 크기가 너무 큽니다. 최대 ${maxSizeInMB}MB까지 가능합니다.`,
      );
      return false;
    }

    if (acceptedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      const isTypeAccepted = acceptedFileTypes.some((type) => {
        const cleanType = type.startsWith('.') ? type.substring(1) : type;
        return fileExtension === cleanType.toLowerCase();
      });

      if (!isTypeAccepted) {
        setFileError('허용되지 않는 파일 형식입니다.');
        return false;
      }
    }

    setFileError('');
    return true;
  };

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const fileList = event.target.files;
    if (fileList && fileList.length > 0) {
      const file = fileList[0];

      if (files.length >= maxFiles) {
        setFileError(`파일은 최대 ${maxFiles}개까지 첨부할 수 있습니다.`);
        event.target.value = '';
        return;
      }

      if (!validateFile(file)) {
        event.target.value = '';
        return;
      }

      const newFile: FileInfo = {
        name: file.name,
        url: URL.createObjectURL(file),
        size: file.size,
        file: file,
      };
      const updatedFiles = [...files, newFile];
      setFiles(updatedFiles);

      field.onChange(updatedFiles.map((f) => f.file));

      event.target.value = '';
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = [...files];
    URL.revokeObjectURL(updatedFiles[index].url);
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);

    field.onChange(
      updatedFiles.length > 0 ? updatedFiles.map((f) => f.file) : undefined,
    );
  };

  const getAcceptString = (): string => {
    const types = acceptedFileTypes.length > 0 ? acceptedFileTypes : accept;
    if (types.length === 0) return '';

    return types
      .map((type) => {
        if (type.includes('/')) return type;
        return type.startsWith('.') ? type : `.${type}`;
      })
      .join(',');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const handleAddMoreClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="flex w-full flex-col">
      {/* 안내 메시지 */}
      <div className="flex items-start gap-1 bg-gray-01 px-3 py-2">
        <Icons.infoFill className="size-4 shrink-0 fill-sand-07" />
        <p className="font-xs-2 text-gray-05">
          이미지 파일 ({getAcceptedTypesLabel()}) 기준으로 최대 {maxFiles}개{' '}
          {maxSizeInMB}MB 이하까지 첨부 가능합니다.
        </p>
      </div>

      {/* 파일이 없을 때: 파일 선택 버튼 */}
      {files.length === 0 && (
        <label className="mt-4 w-full cursor-pointer">
          <div
            className={cn(
              'flex h-[60px] w-full items-center justify-center rounded-lg border border-gray-02 bg-white transition-colors',
              error && 'border-red-500',
              disabled && 'cursor-not-allowed opacity-50',
            )}
          >
            <input
              ref={inputRef}
              type="file"
              className="hidden"
              onChange={handleFileUpload}
              disabled={disabled}
              accept={getAcceptString()}
            />
            <span className="font-s-2 text-gray-08">파일 선택</span>
          </div>
        </label>
      )}

      {/* 파일 목록 */}
      {files.length > 0 && (
        <div className="mt-4 flex flex-col gap-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex h-[60px] items-center justify-between gap-1 rounded-lg border border-gray-02 p-3"
            >
              <Icons.attachFile className="size-6 shrink-0 fill-gray-06" />
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="font-s-1 line-clamp-1 text-left text-gray-08">
                  {file.name}
                </span>
                <span className="font-xs-2 text-left text-gray-05">
                  {formatFileSize(file.size)}
                </span>
              </div>

              <Icons.closeSmall
                className="size-6 shrink-0 fill-gray-05"
                onClick={() => removeFile(index)}
              />
            </div>
          ))}

          {/* 추가 업로드 버튼 */}
          {files.length < maxFiles && (
            <Button
              type="button"
              onClick={handleAddMoreClick}
              disabled={disabled}
              className="mt-2 flex w-fit items-center justify-center gap-1"
              size="sm"
              variant="outline"
            >
              <Icons.plus className="size-4 fill-gray-06" />
              <span className="font-s-2 text-gray-08">추가 업로드</span>
            </Button>
          )}

          <input
            ref={inputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            disabled={disabled}
            accept={getAcceptString()}
          />
        </div>
      )}

      {/* 에러 메시지 */}
      {(fileError || error) && (
        <p className="font-xs-2 text-red-500">{fileError || error?.message}</p>
      )}
    </div>
  );
};

export default FileUploader;
