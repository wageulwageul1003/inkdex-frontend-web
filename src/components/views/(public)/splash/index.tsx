import Image from 'next/image';

export default function Splash() {
  return (
    <div className="flex flex-1 items-center justify-center">
      <Image
        src={'/logos/logo.png'}
        alt="Logo"
        width={100}
        height={100}
        className="aspect-[4/1] w-full"
      />
    </div>
  );
}
