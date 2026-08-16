interface ProgressStepsProps {
  currentStep: number;
}

const steps = ["Selfie", "Wardrobe", "Occasion", "Preferences", "Result"];

export default function ProgressSteps({
  currentStep,
}: ProgressStepsProps) {
  return (
    <div className="mb-16 flex items-center justify-center gap-3 overflow-x-auto pb-2">
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const active = stepNumber <= currentStep;

        return (
          <div key={step} className="flex items-center">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold transition-all
              ${
                active
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-200 text-slate-500"
              }`}
            >
              {stepNumber}
            </div>

            <span className="ml-3 mr-5 hidden text-sm font-medium text-slate-600 md:block">
              {step}
            </span>

            {index !== steps.length - 1 && (
              <div className="h-[2px] w-8 bg-slate-300" />
            )}
          </div>
        );
      })}
    </div>
  );
}