'use client';

import { Plus, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Props {
  field: any;
  message: string;
  placeholder?: string;
  maxCount?: number;
}

const Keywords: React.FC<Props> = (props) => {
  // props에서 필드 값을 가져와 초기 상태 설정
  const maxCount = props.maxCount ?? 10;
  const [keywords, setKeywords] = useState<string[]>(props.field.value || []);
  const [inputValue, setInputValue] = useState<string>('');

  // field 값이 변경될 때 keywords 상태 업데이트
  useEffect(() => {
    if (props.field.value && Array.isArray(props.field.value)) {
      setKeywords(props.field.value);
    }
  }, [props.field.value]);

  // 키워드 추가 처리
  const addKeyword = () => {
    // 띄어쓰기 제거 및 trim 처리
    const newKeyword = inputValue.trim().replace(/\s+/g, '');

    if (newKeyword && keywords.length < maxCount) {
      if (!keywords.includes(newKeyword)) {
        const updatedKeywords = [...keywords, newKeyword];
        setKeywords(updatedKeywords);

        // 필드 값 업데이트 - React Hook Form의 onChange 처리
        props.field.onChange(updatedKeywords);

        // 입력 필드 초기화
        setInputValue('');
      }
    }
  };

  // 키워드 삭제 처리
  const removeKeyword = (indexToRemove: number) => {
    const updatedKeywords = keywords.filter(
      (_, index) => index !== indexToRemove,
    );
    setKeywords(updatedKeywords);

    // 필드 값 업데이트
    props.field.onChange(updatedKeywords);
  };

  // 엔터 키 처리
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addKeyword();
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4 flex w-full max-w-full gap-3">
        <div className="w-full">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={props.placeholder || '키워드를 입력해주세요'}
            className="h-11"
          />
        </div>
        <Button
          type="button"
          onClick={addKeyword}
          className="h-[44px] w-[44px] flex-shrink-0 bg-gray-200"
        >
          <Plus size={24} className="min-w-6 text-gray-500" />
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="bg-gray-2 flex h-5 w-fit gap-[2px] rounded px-1 py-[3px]">
          <span className="text-black">{keywords.length}개</span>
          <span className="text-gray-500">/ {props.maxCount}개</span>
        </div>

        <div className="flex flex-wrap gap-4">
          {keywords.map((keyword, index) => (
            <div
              key={index}
              className="flex items-center gap-[2px] rounded bg-black py-[3px] pl-[6px] pr-2 text-white"
            >
              <span>#{keyword}</span>
              <span
                onClick={() => removeKeyword(index)}
                className="cursor-pointer"
              >
                <X className="size-[14px]" />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Keywords;
