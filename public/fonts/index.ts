import localFont from 'next/font/local';

// Load the SpoqaHanSansNeo font with different weights
const SpoqaHanSansNeo = localFont({
  src: [
    {
      path: '../../public/fonts/SpoqaHanSansNeo-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpoqaHanSansNeo-Light.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpoqaHanSansNeo-Medium.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpoqaHanSansNeo-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../public/fonts/SpoqaHanSansNeo-Thin.otf',
      weight: '100',
      style: 'normal',
    },
  ],
  variable: '--font-SpoqaHanSansNeo',
});

export {SpoqaHanSansNeo};
