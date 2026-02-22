"use client";

import { Suspense, useEffect, useState } from "react";
import { SearchForm } from "@/components/SearchForm";
import { SupportButton } from "@/components/SupportButton";
import { SupportModal } from "@/components/SupportModal";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSupportButton, setShowSupportButton] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsModalOpen(true);
    }, 30000); // 30 seconds

    return () => clearTimeout(timer);
  }, []);

  const openModal = () => {
    setIsModalOpen(true);
    setShowSupportButton(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setShowSupportButton(true);
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchForm />
      </Suspense>
      <SupportModal isOpen={isModalOpen} onClose={closeModal} />
      {showSupportButton && <SupportButton onClick={openModal} />}
    </>
  );
}
