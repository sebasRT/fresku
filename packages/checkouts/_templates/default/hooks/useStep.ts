"use client";
import { create } from "zustand";

type StepState = {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
};

const useStep = create<StepState>((set) => ({
  step: 0,
  nextStep: () => set((state) => ({ step: state.step + 1 })),
  prevStep: () => set((state) => ({ step: state.step - 1 })),
}));

export default useStep;
