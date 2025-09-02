import { useRouter } from 'next/navigation';
import { ChangeEvent, useEffect, useRef, useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { SELECTED_IMAGE } from '@/constants/tokens';

const wirteTypeItems = [
  {
    value: 'photo',
    label: '카메라',
  },
  {
    value: 'album',
    label: '앨범',
  },
];

export const TypeItemComponent = ({
  value,
  label,
  onClick,
}: {
  value: string;
  label: string;
  onClick: () => void;
}) => {
  return (
    <div
      className="flex cursor-pointer items-center justify-center justify-between rounded-[16px] border border-gray-300 p-4"
      onClick={onClick}
    >
      <span>{label}</span>
      <Icons.keyboardArrowRight className="size-6" />
    </div>
  );
};

export const WriteType = () => {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (isCameraOn) {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: true,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } else if (videoRef.current && videoRef.current.srcObject) {
          // Stop all tracks when camera is turned off
          const tracks = (
            videoRef.current.srcObject as MediaStream
          ).getTracks();
          tracks.forEach((track) => track.stop());
          videoRef.current.srcObject = null;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    initCamera();

    return () => {
      // Clean up when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isCameraOn]);

  const handleItemClick = (value: string) => {
    if (value === 'photo') {
      setIsCameraOn((prev) => !prev);
      setSelectedType(isCameraOn ? null : 'photo');
      // 카메라를 켤 때 선택된 이미지 초기화
      if (!isCameraOn) {
        setSelectedImage(null);
      }
    } else if (value === 'album') {
      // 앨범 선택 시 파일 선택 다이얼로그 열기
      fileInputRef.current?.click();
      setSelectedType('album');
      // 앨범 선택 시 카메라 끄기
      if (isCameraOn) {
        setIsCameraOn(false);
      }
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result as string;
        setSelectedImage(imageData);
        try {
          sessionStorage.setItem(SELECTED_IMAGE, imageData);
          setTimeout(() => {
            router.push('/posts/write');
          }, 300);
        } catch (error) {
          console.error('이미지 저장 실패:', error);
          alert('이미지가 너무 큽니다. 다른 이미지를 선택해주세요.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-5 mt-6">
      <div className="mb-4 grid grid-cols-2 gap-2">
        {wirteTypeItems.map((item) => (
          <TypeItemComponent
            key={item.value}
            {...item}
            onClick={() => handleItemClick(item.value)}
          />
        ))}
      </div>

      {/* 숨겨진 파일 입력 */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      {/* 카메라 뷰 */}
      {selectedType === 'photo' && isCameraOn && (
        <div className="mt-4 overflow-hidden rounded-lg border border-gray-300">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="h-auto w-full"
          />
          <div className="flex justify-center bg-gray-100 p-2">
            <button
              className="rounded-md bg-blue-500 px-4 py-2 text-white"
              onClick={() => setIsCameraOn(false)}
            >
              카메라 끄기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
