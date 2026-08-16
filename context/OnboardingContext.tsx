"use client";

import {
  createContext,
  ReactNode,
  useContext,
  useState,
} from "react";

import { OnboardingData } from "@/types/onboarding";

interface OnboardingContextType {
  data: OnboardingData;
  updateData: (values: Partial<OnboardingData>) => void;
  resetData: () => void;
}

const initialData: OnboardingData = {
  selfieFile: null,
  selfiePreview: null,

  wardrobeMode: null,
  wardrobeItems: [],
  wardrobeDescription: "",

  occasion: null,

  preferences: [],
};

const OnboardingContext = createContext<
  OnboardingContextType | undefined
>(undefined);

export function OnboardingProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [data, setData] = useState(initialData);

  const updateData = (values: Partial<OnboardingData>) => {
    setData((prev) => ({
      ...prev,
      ...values,
    }));
  };

  const resetData = () => {
    setData(initialData);
  };

  return (
    <OnboardingContext.Provider
      value={{
        data,
        updateData,
        resetData,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error(
      "useOnboarding must be used inside OnboardingProvider."
    );
  }

  return context;
}