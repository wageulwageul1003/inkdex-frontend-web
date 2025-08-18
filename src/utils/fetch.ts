import Cookies from 'js-cookie';

import { ACCESS_TOKEN } from '@/constants/tokens';

export interface ErrorData {
  status: number;
  code: number;
  message: string;
  description?: string;
  data?: object;
  error?: string;
}

export const agent = async (url: string, options?: RequestInit) => {
  try {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;
    const fullURL = `${baseURL}${url}`;
    const accessToken = Cookies.get(ACCESS_TOKEN);

    const isFormData = options?.body instanceof FormData;

    const headers: Record<string, string> = {};

    if (!isFormData) {
      headers['Content-Type'] = 'application/json; charset=utf-8';
    }

    if (options?.headers) {
      Object.assign(headers, options.headers);
    }

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(fullURL, {
      ...options,
      credentials: 'include',
      headers,
    });

    if (
      url.endsWith('.csv') ||
      url.includes('/csv') ||
      url.endsWith('.export') ||
      url.includes('/export')
    ) {
      return response;
    }

    if (!response.ok) {
      const errorData = await response.json();

      const error: ErrorData = {
        status: response.status,
        code: errorData.code,
        message: errorData.message || 'Unknown error message',
        description: errorData.description || 'Unknown error',
        data: errorData.data,
      };

      // Check for code 4001 and redirect
      if (errorData.code === 4001 || errorData.code === '4001') {
        alert('권한이 없습니다. 관리자에게 문의하세요.');
        window.location.href = '/';
      }

      throw error;
    }

    return await response.json();
  } catch (error) {
    console.error(
      'Fetch error:',
      error instanceof Error ? error.message : error,
    );
    throw error;
  }
};
