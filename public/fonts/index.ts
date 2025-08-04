import localFont from 'next/font/local';

// Load the WantedSans font with different weights
const wantedSans = localFont({
  src: [
    {
      path: '../../public/fonts/WantedSans-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-ExtraBold.ttf',
      weight: '900',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/WantedSans-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
  ],
  variable: '--font-wantedSans',
});

export {wantedSans};
