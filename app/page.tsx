import Image from "next/image";

import BirthdaysClient from '@/components/BirthdaysClient';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center px-4 lg:px-24 xl:px-48 py-8 lg:py-16 min-h-screen">
    <BirthdaysClient />
  </main>
  
  );
}
