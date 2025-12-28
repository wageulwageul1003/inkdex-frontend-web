export const isClient = () => typeof window !== 'undefined';

/**
 * WebView 여부 체크 (iOS / Android)
 */
export const isWebView = (): boolean => {
  if (!isClient()) return false;

  const ua = navigator.userAgent || '';

  const isIOSWebView = /iPhone|iPad|iPod/.test(ua) && !/Safari/.test(ua);

  const isAndroidWebView =
    /Android/.test(ua) && /wv|Version\/\d+\.\d+/.test(ua);

  return isIOSWebView || isAndroidWebView;
};

/**
 * PC 브라우저 여부
 */
export const isPCBrowser = (): boolean => {
  if (!isClient()) return false;

  const ua = navigator.userAgent;

  const isMobile = /Android|iPhone|iPad|iPod/.test(ua);

  return !isMobile && !isWebView();
};

/**
 * 앱(WebView) 환경 여부
 */
export const isApp = (): boolean => {
  return isWebView();
};
