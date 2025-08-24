import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const hasLetter = (value: string) => /[a-zA-Z]/.test(value);
export const hasKorean = (value: string) => /[가-힣]/.test(value);
export const hasNumber = (value: string) => /[0-9]/.test(value);
export const hasSpecial = (value: string) =>
  /[!@#$%^&*(),.?":{}|<>]/.test(value);

// Base64 데이터 URL을 Blob으로 변환하는 함수
export const dataURLtoBlob = (dataURL: string): Blob => {
  // Base64 문자열에서 데이터 부분만 추출
  const byteString = atob(dataURL.split(',')[1]);

  // MIME 타입 추출
  const mimeString = dataURL.split(',')[0].split(':')[1].split(';')[0];

  // 바이트 배열 생성
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mimeString });
};
