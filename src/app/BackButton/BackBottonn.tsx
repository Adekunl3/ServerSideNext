// components/BackButton.tsx
"use client";

import { useRouter } from 'next/navigation';

const BackBotton = () => {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <button onClick={handleBack} className="btn btn-primary  mt-12  mb-2">
      ← Back
    </button>
  );
};

export default BackBotton;
