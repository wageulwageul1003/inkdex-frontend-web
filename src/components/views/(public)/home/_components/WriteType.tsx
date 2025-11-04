import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Icons } from '@/components/shared/icons';
import { SELECTED_IMAGE } from '@/constants/tokens';
import { nativeBridge } from '@/lib/native-bridge';

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
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleImageResult = (imageData: string) => {
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

  const handleItemClick = async (value: string) => {
    try {
      let result;

      if (value === 'photo') {
        // 네이티브 카메라 열기
        result = await nativeBridge.openCamera();
      } else if (value === 'album') {
        // 네이티브 갤러리 열기
        result = await nativeBridge.openGallery();
      }

      if (result) {
        // Base64 이미지를 사용 (file:// URI는 웹에서 사용 불가)
        const imageData = result.base64 || result.uri;
        handleImageResult(imageData);
      }
    } catch (error) {
      console.error('Image selection error:', error);
      // 네이티브 앱이 아닌 경우 에러 무시 (웹 브라우저에서는 작동하지 않음)
      if (error instanceof Error && error.message !== 'Not in native app') {
        alert('이미지 선택 중 오류가 발생했습니다.');
      }
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

      {selectedImage}
    </div>
  );
};
