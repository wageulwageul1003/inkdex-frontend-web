'use client';

import React, { useEffect, useRef, useState } from 'react';

import { Icons } from '../icons';

import { cn } from '@/lib/utils';

interface Props {
  field: any;
  message: string;
  placeholder?: string;
  maxCount?: number;
}

const Keywords: React.FC<Props> = (props) => {
  // props에서 필드 값을 가져와 초기 상태 설정
  const maxCount = props.maxCount ?? 10;
  const keywords = props.field.value || [];
  const [inputValue, setInputValue] = useState<string>('');
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [inputWidth, setInputWidth] = useState<number>(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (measureRef.current) {
      setInputWidth(measureRef.current.offsetWidth);
    }
  }, [inputValue]);

  // 키워드 추가 처리
  const addKeyword = () => {
    // 띄어쓰기 제거 및 trim 처리
    const newKeyword = inputValue.trim().replace(/\s+/g, '');

    // 입력 필드 먼저 초기화
    setInputValue('');

    // 최소 2글자 이상, 최대 개수 미만, 중복 아닐 때만 추가
    if (newKeyword && newKeyword.length >= 2 && keywords.length < maxCount) {
      if (!keywords.includes(newKeyword)) {
        const updatedKeywords = [...keywords, newKeyword];

        // 필드 값 업데이트 - React Hook Form의 onChange 처리
        props.field.onChange(updatedKeywords);
      }
    }
  };

  // 키워드 삭제 처리
  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = keywords.filter(
      (item: string, index: number) => index !== indexToRemove,
    );

    // 필드 값 업데이트
    props.field.onChange(updatedKeywords);
  };

  // 키워드 수정 시작
  const startEditing = (index: number) => {
    setEditingIndex(index);
    setEditValue(keywords[index]);
  };

  // 키워드 수정 완료
  const finishEditing = () => {
    if (editingIndex !== null) {
      const trimmedValue = editValue.trim().replace(/\s+/g, '');
      const originalValue = keywords[editingIndex];

      // 값이 변경되었고, 비어있지 않으며, 다른 키워드와 중복되지 않을 때만 업데이트
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
    }
  };

  // 키워드 수정 취소
  const cancelEditing = () => {
    setEditingIndex(null);
    setEditValue('');
  };

  // 엔터 키 처리 (새 키워드 추가)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  // 엔터 키 처리 (키워드 수정)
  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      finishEditing();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancelEditing();
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* 추가된 키워드들 */}
      {keywords.map((keyword: string, index: number) => (
        <div
          key={index}
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

      {/* 새로운 키워드 입력 필드 */}
      {keywords.length < maxCount && (
        <div className="flex w-fit items-center gap-1 rounded-full border border-gray-03 px-3 py-2">
          <span className="font-s-2 text-gray-05 focus:text-black">#</span>

          {/* 너비 측정용 숨겨진 span */}
          <span
            ref={measureRef}
            className="font-s-2 invisible absolute whitespace-pre"
            aria-hidden="true"
          >
            {inputValue}
          </span>

          {/* 실제 입력창 */}
          <input
            ref={inputRef}
            id="keyword"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder || '키워드를 입력해주세요'}
            style={inputValue ? { width: inputWidth + 4 } : undefined}
            className={cn(
              'font-s-2 border-none bg-transparent px-0 text-black placeholder-gray-05 focus-visible:outline-none',
              !inputValue && 'max-w-[61px]',
            )}
          />
        </div>
      )}
    </div>
  );
};

export default Keywords;
