import localFont from 'next/font/local';

// Load the Pretendard font with different weights
const wantedSans = localFont({
  src: [
    {
      path: '../../public/fonts/wantedSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/Pretendard-SemiBold.otf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-wantedSans',
});

export {wantedSans};
