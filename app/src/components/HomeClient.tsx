"use client";

import { useEffect, useState } from "react";
import { SupportButton } from "@/components/SupportButton";
import { SupportModal } from "@/components/SupportModal";

export function HomeClient() {
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
      <SupportModal isOpen={isModalOpen} onClose={closeModal} />
      {showSupportButton && <SupportButton onClick={openModal} />}
    </>
  );
}
