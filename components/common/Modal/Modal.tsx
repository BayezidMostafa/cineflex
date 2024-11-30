"use client";

import React, { useEffect } from "react";
import { useModalStore } from "@/store/useModalStore";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import LoginModal from "@/components/Auth/Login/LoginModal";
import SignUpModal from "@/components/Auth/SignUp/SignUpModal";
import ForgotPasswordModal from "@/components/Auth/ForgotPassword/ForgotPasswordModal";

// Dynamically import particles-bg
const ParticlesBg = dynamic(() => import("particles-bg"), { ssr: false });

const modalComponents: Record<string, React.FC> = {
  SIGN_UP_MODAL: SignUpModal,
  LOGIN_MODAL: LoginModal,
  FORGOT_PASSWORD_MODAL: ForgotPasswordModal,
};

const Modal: React.FC = () => {
  const { isOpen, modalView, closeModal } = useModalStore();

  const ModalContent = modalView ? modalComponents[modalView] : null;

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur z-[60] center-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5, x: "-100%" }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.5, x: "100%" }}
            transition={{
              duration: 0.3,
              type: "tween",
              ease: "linear",
            }}
            className="bg-primary p-6 rounded-lg shadow-lg relative z-[70]"
          >
            <X
              className="absolute right-3 top-3 cursor-pointer hover:scale-x-110 active:scale-95 transition-all duration-300"
              onClick={() => closeModal()}
            />
            <ParticlesBg num={15} type="lines" bg={true} />
            {ModalContent && <ModalContent />}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
