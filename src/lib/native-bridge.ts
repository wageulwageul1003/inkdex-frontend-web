type NativeMessageType =
  | 'OPEN_CAMERA'
  | 'OPEN_GALLERY'
  | 'REQUEST_NOTIFICATION'
  | 'BIOMETRIC_AUTH';

class NativeBridge {
  private isNative: boolean;
  private listeners: Map<string, Function[]>;

  constructor() {
    this.isNative = this.checkIfNative();
    this.listeners = new Map();

    console.log('NativeBridge initialized, isNative:', this.isNative);
    console.log(
      'window.ReactNativeWebView:',
      typeof window !== 'undefined' ? window.ReactNativeWebView : 'undefined',
    );

    if (this.isNative) {
      this.setupMessageListener();
    }
  }

  private checkIfNative(): boolean {
    // WebView에서 실행 중인지 확인
    return (
      typeof window !== 'undefined' && window.ReactNativeWebView !== undefined
    );
  }

  private setupMessageListener() {
    if (typeof window === 'undefined') return;

    console.log('Setting up message listener, isNative:', this.isNative);

    // React Native WebView 메시지 리스너
    const handleMessage = (event: MessageEvent) => {
      console.log('Raw message received:', event);
      try {
        const message =
          typeof event.data === 'string'
            ? event.data
            : JSON.stringify(event.data);
        console.log('Parsed message:', message);
        const { type, data } = JSON.parse(message);
        console.log('Received message from native:', type, data);

        const callbacks = this.listeners.get(type) || [];
        console.log('Callbacks found:', callbacks.length);
        callbacks.forEach((cb) => cb(data));

        // 리스너는 각 Promise에서 직접 정리함 (중복 삭제 방지)
      } catch (error) {
        console.error('Failed to parse native message:', error, event.data);
      }
    };

    // React Native WebView는 document에 메시지를 보냅니다
    document.addEventListener('message', handleMessage as any);
    window.addEventListener('message', handleMessage);

    console.log('Message listeners attached');
  }

  // 네이티브로 메시지 보내기
  sendMessage(type: NativeMessageType, data?: any) {
    if (!this.isNative) {
      console.warn('Not running in native app');
      return;
    }

    window.ReactNativeWebView?.postMessage(JSON.stringify({ type, data }));
  }

  // 네이티브에서 메시지 받기 (기존 리스너 교체)
  onMessage(type: string, callback: Function) {
    // 기존 리스너를 교체 (누적 방지)
    console.log('Setting listener for type:', type);
    this.listeners.set(type, [callback]);
  }

  // 카메라 열기
  openCamera(): Promise<{ uri: string; base64: string }> {
    console.log('openCamera called, isNative:', this.isNative);
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        console.error('Not in native app, rejecting');
        reject(new Error('Not in native app'));
        return;
      }

      // 타임아웃 설정 (10초)
      const timeout = setTimeout(() => {
        console.error('Camera timeout after 10 seconds');
        // 타임아웃 시 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        reject(new Error('Camera timeout'));
      }, 10000);

      this.onMessage('IMAGE_RESULT', (data: any) => {
        clearTimeout(timeout);
        console.log('Image result received:', data);
        // 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        resolve(data);
      });

      this.onMessage('IMAGE_ERROR', (data: any) => {
        clearTimeout(timeout);
        console.error('Image error:', data);
        // 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        reject(new Error(data.message || 'Image error'));
      });

      console.log('Sending OPEN_CAMERA message to native');
      this.sendMessage('OPEN_CAMERA');
    });
  }

  // 갤러리(앨범) 열기
  openGallery(): Promise<{ uri: string; base64: string }> {
    return new Promise((resolve, reject) => {
      if (!this.isNative) {
        reject(new Error('Not in native app'));
        return;
      }

      // 타임아웃 설정 (30초 - 갤러리는 선택 시간이 더 필요)
      const timeout = setTimeout(() => {
        // 타임아웃 시 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        reject(new Error('Gallery timeout'));
      }, 30000);

      this.onMessage('IMAGE_RESULT', (data: any) => {
        clearTimeout(timeout);
        console.log('Image result received:', data);
        // 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        resolve(data);
      });

      this.onMessage('IMAGE_ERROR', (data: any) => {
        clearTimeout(timeout);
        console.error('Image error:', data);
        // 리스너 정리
        this.listeners.delete('IMAGE_RESULT');
        this.listeners.delete('IMAGE_ERROR');
        reject(new Error(data.message || 'Image error'));
      });

      console.log('Sending OPEN_GALLERY message to native');
      this.sendMessage('OPEN_GALLERY');
    });
  }

  // 알림 권한 요청
  requestNotificationPermission(): Promise<{ granted: boolean }> {
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
