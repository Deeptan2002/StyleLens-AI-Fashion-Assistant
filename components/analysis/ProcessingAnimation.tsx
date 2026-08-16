"use client";

import { useEffect, useState } from "react";
import { Sparkles, Shirt, Wand2, CheckCircle2 } from "lucide-react";

const processingSteps = [
  {
    icon: Sparkles,
    title: "Analyzing your photo",
    subtitle: "AI is understanding your features and style...",
  },
  {
    icon: Shirt,
    title: "Processing clothing item",
    subtitle: "Extracting fabric details and fit information...",
  },
  {
    icon: Wand2,
    title: "Creating virtual try-on",
    subtitle: "Applying AI magic to generate your look...",
  },
  {
    icon: CheckCircle2,
    title: "Almost ready!",
    subtitle: "Finalizing your personalized result...",
  },
];

const funFacts = [
  "💡 Virtual try-on reduces online returns by up to 40%",
  "✨ Our AI analyzes over 100 style attributes per image",
  "🎨 The perfect outfit can boost confidence by 50%",
  "🚀 Processing uses cutting-edge computer vision AI",
  "👗 Fashion AI is revolutionizing online shopping",
  "🌟 Your unique style DNA is being calculated",
];

export default function ProcessingAnimation() {
  const [currentStep, setCurrentStep] = useState(0);
  const [currentFact, setCurrentFact] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // Cap at 95% until actually done
        return prev + 0.5;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    // Step progression (every 45 seconds for ~3 min total)
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => (prev < processingSteps.length - 1 ? prev + 1 : prev));
    }, 45000);

    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    // Fun facts rotation (every 8 seconds)
    const factInterval = setInterval(() => {
      setCurrentFact((prev) => (prev + 1) % funFacts.length);
    }, 8000);

    return () => clearInterval(factInterval);
  }, []);

  const CurrentIcon = processingSteps[currentStep].icon;

  return (
    <div className="w-full space-y-8">
      {/* Main Processing Card */}
      <div className="rounded-3xl border border-indigo-200 bg-white p-8 shadow-lg">
        {/* Animated Icon */}
        <div className="flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full bg-indigo-400 opacity-20"></div>
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl">
              <CurrentIcon className="text-white" size={40} />
            </div>
          </div>
        </div>

        {/* Current Step */}
        <div className="mt-6 text-center">
          <h3 className="text-2xl font-bold text-slate-900">
            {processingSteps[currentStep].title}
          </h3>
          <p className="mt-2 text-slate-600">
            {processingSteps[currentStep].subtitle}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mt-8">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-semibold text-slate-700">Processing</span>
            <span className="font-semibold text-indigo-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Step Indicators */}
        <div className="mt-8 grid grid-cols-4 gap-3">
          {processingSteps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = index < currentStep;

            return (
              <div
                key={index}
                className={`flex flex-col items-center gap-2 rounded-xl p-3 transition-all ${
                  isActive
                    ? "bg-indigo-50 ring-2 ring-indigo-500"
                    : isCompleted
                    ? "bg-green-50"
                    : "bg-slate-50"
                }`}
              >
                <StepIcon
                  size={20}
                  className={
                    isActive
                      ? "text-indigo-600"
                      : isCompleted
                      ? "text-green-600"
                      : "text-slate-400"
                  }
                />
                <span
                  className={`text-xs font-medium ${
                    isActive
                      ? "text-indigo-900"
                      : isCompleted
                      ? "text-green-900"
                      : "text-slate-500"
                  }`}
                >
                  Step {index + 1}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fun Fact Card */}
      <div className="rounded-2xl border border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-6">
        <p className="text-center text-slate-700 font-medium transition-all duration-500">
          {funFacts[currentFact]}
        </p>
      </div>

      {/* Time Estimate */}
      <div className="text-center">
        <p className="text-sm text-slate-500">
          ⏱️ Estimated time: 2-3 minutes • AI processing in progress
        </p>
      </div>
    </div>
  );
}
