import Image from 'next/image';

export default function ThankYouPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FFB800]">
      <div className="flex flex-col items-center">
        <div className="rounded-full bg-white p-6 mb-8 shadow-md">
          <Image
            src="/logo.png"
            alt="Piyasena Super Logo"
            width={140}
            height={140}
            className="object-contain"
            priority
          />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-4">Thank you for your feedback!</h1>
        <p className="text-md text-center mb-12 max-w-md">We appreciate your time and hope to see you again soon.</p>
        <div className="mt-8 text-xl font-semibold">Piyasena Super</div>
      </div>
    </div>
  );
} 