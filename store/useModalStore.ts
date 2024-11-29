// store/useModalStore.ts
import { create } from "zustand";

type ModalStore = {
  isOpen: boolean;
  modalView: string | null;
  openModal: (view: string) => void;
  closeModal: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  isOpen: false,
  modalView: null,
  openModal: (view) => set({ isOpen: true, modalView: view }),
  closeModal: () => set({ isOpen: false, modalView: null }),
}));
