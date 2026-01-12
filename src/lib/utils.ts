import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export const validatePassword = (value: string): boolean => {
  if (
    value === '' ||
    value.match(
      /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}\[\]:;"'<>,.?/\\|]).{8,}$/,
    )
  ) {
    return true;
  }
  return false;
};

export const validateEmail = (value: string): boolean => {
  if (value === '' || value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return true;
  }
  return false;
};
