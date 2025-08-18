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
