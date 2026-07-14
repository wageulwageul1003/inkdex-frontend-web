'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Icons } from '../icons';

import { cn } from '@/lib/utils';
import { ControllerRenderProps, FieldValues, Path } from 'react-hook-form';

interface Props<T extends FieldValues> {
  field: ControllerRenderProps<T, Path<T>>;
  message?: string;
  placeholder?: string;
  maxCount?: number;
}

const Keywords = <T extends FieldValues>(props: Props<T>) => {
  const maxCount = props.maxCount ?? 10;

  const keywords = (props.field.value ?? []) as string[];

  const [inputValue, setInputValue] = useState('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState('');

  const [inputWidth, setInputWidth] = useState(0);

  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth);
    }
  }, [inputValue]);

  /**
   * 키워드 추가
   */
  const addKeyword = () => {
    const newKeyword = inputValue.trim().replace(/\s+/g, '');

    setInputValue('');

    if (
      !newKeyword ||
      newKeyword.length < 2 ||
      keywords.length >= maxCount ||
      keywords.includes(newKeyword)
    ) {
      return;
    }

    props.field.onChange([...keywords, newKeyword]);
  };

  /**
   * 키워드 삭제
   */
  const removeKeyword = (index: number) => {
    const updatedKeywords = keywords.filter(
      (_, keywordIndex) => keywordIndex !== index,
    );

    props.field.onChange(updatedKeywords);
  };

  /**
   * 수정 시작
   */
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(keywords[index]);
  };

  /**
   * 수정 완료
   */
  const finishEditing = () => {
    if (editingIndex === null) {
      return;
    }

    const trimmedValue = editValue.trim().replace(/\s+/g, '');
    const originalValue = keywords[editingIndex];

    if (
      trimmedValue &&
      trimmedValue !== originalValue &&
      !keywords.includes(trimmedValue)
    ) {
      const updatedKeywords = [...keywords];

      updatedKeywords[editingIndex] = trimmedValue;

      props.field.onChange(updatedKeywords);
    }

    setEditingIndex(null);
    setEditValue('');
  };

  /**
   * 수정 취소
   */
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  /**
   * 입력 이벤트
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  /**
   * 수정 이벤트
   */
  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {keywords.map((keyword, index) => (
        <div
          key={`${keyword}-${index}`}
          className="flex w-fit items-center gap-1 rounded-full border border-gray-03 px-3 py-2"
        >
          <span className="font-s-2 text-gray-05">#</span>

          {editingIndex === index ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleEditKeyDown}
              onBlur={finishEditing}
              autoFocus
              className="font-s-2 w-fit max-w-4 border-none bg-transparent px-0 text-black focus-visible:outline-none"
            />
          ) : (
            <span
              className="font-s-2 cursor-pointer text-black"
              onClick={() => startEditing(index)}
            >
              {keyword}
            </span>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              removeKeyword(index);
            }}
          >
            <Icons.close className="size-3 fill-gray-05" />
          </button>
        </div>
      ))}

      {keywords.length < maxCount && (
        <div className="flex w-fit items-center gap-1 rounded-full border border-gray-03 px-3 py-2">
          <span className="font-s-2 text-gray-05">#</span>

          <span
            ref={measureRef}
            className="font-s-2 invisible absolute whitespace-pre"
          >
            {inputValue}
          </span>

          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder ?? '키워드를 입력해주세요'}
            style={inputValue ? { width: inputWidth + 4 } : undefined}
            className={cn(
              `font-s-2 border-none bg-transparent px-0 text-black placeholder-gray-05 focus-visible:outline-none`,
              !inputValue && 'max-w-[61px]',
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Keywords;
