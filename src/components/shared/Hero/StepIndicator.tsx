import { motion } from "framer-motion";

interface StepIndicatorProps {
  steps: number;
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  steps,
  currentStep,
  onStepClick,
}) => {
  return (
    <div className="flex justify-center space-x-2">
      {Array.from({ length: steps }).map((_, index) => (
        <motion.button
          key={index}
          className={`w-3 h-3 rounded-full ${
            index === currentStep ? "bg-primary" : "bg-gray-300"
          }`}
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onStepClick(index)}
        />
      ))}
    </div>
  );
};

