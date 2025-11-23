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
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 입력값 변화 시 width 자동 조정
  useEffect(() => {
    const mirror = mirrorRef.current;
    const input = inputRef.current;
    if (!mirror || !input) return;

    // 현재 입력값 or placeholder 텍스트 반영
    mirror.textContent = inputValue || props.placeholder || '';

    // 실제 폭을 측정해서 input에 적용
    const mirrorWidth = mirror.offsetWidth;
    input.style.width = `${mirrorWidth + 10}px`; // 여유 padding 10px
  }, [inputValue, props.placeholder]);

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
          className="flex w-fit items-center gap-1 rounded-full border border-gray-03 px-4 py-3"
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
              className="font-s-2 min-w-[5ch] border-none bg-transparent px-0 text-black focus-visible:outline-none"
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
        <div className="flex w-fit min-w-[100px] max-w-[200px] items-center gap-1 rounded-full border border-gray-03 px-4 py-3">
          <span className="font-s-2 text-gray-05 focus:text-black">#</span>

          {/* 실제 입력창 */}
          <input
            ref={inputRef}
            id="keyword"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder || '키워드를 입력해주세요'}
            className={cn(
              'font-s-2 border-none bg-transparent px-0 text-black placeholder-gray-05 focus-visible:outline-none',
            )}
          />

          {/* 숨겨진 미러 span (폭 계산용) */}
          <span
            ref={mirrorRef}
            className="font-s-2 absolute left-[-9999px] top-[-9999px] whitespace-pre"
          />
        </div>
      )}
    </div>
  );
};

export default Keywords;
