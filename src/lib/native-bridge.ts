type NativeMessageType =
  | 'OPEN_CAMERA'
  | 'OPEN_GALLERY'
  | 'REQUEST_NOTIFICATION'
  | 'GET_FCM_TOKEN'
  | 'BIOMETRIC_AUTH'
  | 'GET_APP_VERSION';

class NativeBridge {
  private isNative: boolean;
  private listeners: Map<string, Function[]>;

  constructor() {
    this.isNative = this.checkIfNative();
    this.listeners = new Map();

    if (this.isNative) {
      this.setupMessageListener();
      this.setupConsoleForwarding();
    }
  }

  private setupConsoleForwarding() {
    if (typeof window === 'undefined') return;

    const originalError = console.error;

    console.error = (...args: any[]) => {
      originalError(...args);
      window.ReactNativeWebView?.postMessage(
        JSON.stringify({
          type: 'WEB_CONSOLE',
          data: { level: 'error', message: args },
        }),
      );
    };
  }

  private checkIfNative(): boolean {
    // WebView에서 실행 중인지 확인
    return (
      typeof window !== 'undefined' && window.ReactNativeWebView !== undefined
    );
  }

  private setupMessageListener() {
    if (typeof window === 'undefined') return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const message =
          typeof event.data === 'string'
            ? event.data
            : JSON.stringify(event.data);
        const { type, data } = JSON.parse(message);

        const callbacks = this.listeners.get(type) || [];
        callbacks.forEach((cb) => cb(data));
      } catch (error) {
        console.error('Failed to parse native message:', error);
      }
    };

    document.addEventListener('message', handleMessage as any);
    window.addEventListener('message', handleMessage);
  }

  // 네이티브로 메시지 보내기
  sendMessage(type: NativeMessageType, data?: any) {
    if (!this.isNative) {
      console.warn('Not running in native app');
      return;
    }

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type, data }));
  }

  // 네이티브에서 메시지 받기
  onMessage(type: string, callback: Function) {
    this.listeners.set(type, [callback]);
  }

  // 이미지 선택 공통 로직
  private openImagePicker(
    type: 'OPEN_CAMERA' | 'OPEN_GALLERY',
    timeoutMs: number,
  ): Promise<{ uri: string; base64: string }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error(`${type} timeout`));
      }, timeoutMs);

      this.onMessage('IMAGE_RESULT', (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      });

      this.onMessage('IMAGE_ERROR', (data: any) => {
        clearTimeout(timeout);
        reject(new Error(data.message || 'Image error'));
      });

      this.sendMessage(type);
    });
  }

  // 카메라 열기
  openCamera(): Promise<{ uri: string; base64: string }> {
    return this.openImagePicker('OPEN_CAMERA', 30000);
  }

  // 갤러리(앨범) 열기
  openGallery(): Promise<{ uri: string; base64: string }> {
    return this.openImagePicker('OPEN_GALLERY', 30000);
  }

  // 알림 권한 요청
  requestNotificationPermission(): Promise<{
    granted: boolean;
    token?: string | null;
  }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      this.onMessage('NOTIFICATION_PERMISSION', (data: any) => {
        resolve(data);
      });

      this.sendMessage('REQUEST_NOTIFICATION');
    });
  }

  // FCM 토큰 가져오기
  getFCMToken(): Promise<{ token: string }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('FCM token request timeout'));
      }, 10000);

      this.onMessage('FCM_TOKEN', (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      });

      this.sendMessage('GET_FCM_TOKEN');
    });
  }

  // 생체 인증
  authenticateWithBiometric(): Promise<{ success: boolean }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      this.onMessage('BIOMETRIC_RESULT', (data: any) => {
        resolve(data);
      });

      this.sendMessage('BIOMETRIC_AUTH');
    });
  }

  // 앱 버전 가져오기
  getAppVersion(): Promise<{ version: string; buildNumber?: string }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Get app version timeout'));
      }, 5000);

      this.onMessage('APP_VERSION', (data: any) => {
        clearTimeout(timeout);
        resolve(data);
      });

      this.sendMessage('GET_APP_VERSION');
    });
  }

  // 네이티브 환경인지 확인
  getIsNative(): boolean {
    return this.isNative;
  }
}

export const nativeBridge = new NativeBridge();

// TypeScript 타입 선언
declare global {
  interface Window {
    ReactNativeWebView?: {
      postMessage: (message: string) => void;
    };
  }
}
