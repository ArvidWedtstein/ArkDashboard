import { Form, FormProps, Submit, useForm } from "@redwoodjs/forms";
import { CheckmarkIcon } from "@redwoodjs/web/dist/toast";
import clsx from "clsx";
import { useState } from "react";
import Button from "../Button/Button";

interface Step {
  title: string;
  description?: string;
  optional?: boolean;
  children?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}
interface IStepperProps<FieldValues> {
  children?: React.ReactNode;
  completion?: boolean;
  currentStep?: number;
  onStepChange?: (step: number, direction: 'prev' | 'next') => void;
  onStepComplete?: (step: number, finalStep: boolean) => void;

}

export const Step = ({ title, description, optional, children, className }: Step) => {
  return <div className={className}>
    {children}
  </div>;
};

const Stepper = <TFieldValues extends Record<string, any>>({ children, completion = false, onStepChange, onStepComplete, currentStep: currentStepProp = 0 }: IStepperProps<TFieldValues>) => {
  const [currentStep, setCurrentStep] = useState(currentStepProp);
  const [completedSteps, setCompletedSteps] = useState([]);

  const completeStep = (step: number, finish: boolean) => {
    setCompletedSteps((prev) => [...prev, step]);
    onStepComplete(step, finish);
    nextStep();
  };
  // https://claritydev.net/blog/advanced-multistep-forms-with-react
  const prevStep = () => {
    if (
      completedSteps.includes(currentStep != 0 ? currentStep - 1 : currentStep)
    ) {
      setCompletedSteps((prev) =>
        prev.filter((step) => step != currentStep - 1)
      );
    }
    setCurrentStep((prev) => (prev != 0 ? prev - 1 : prev));

    onStepChange?.(currentStep != 0 ? currentStep - 1 : currentStep, 'prev')
  };

  const nextStep = () => {
    if (
      currentStep <
      (Array.isArray(children) ? children : [children]).length - 1
    ) {
      onStepChange?.(currentStep + 1, 'next')
      return setCurrentStep((prev) => prev + 1);
    }

    onStepChange?.(completedSteps.findIndex((step) => step == currentStep) !== -1
      ? completedSteps.findIndex((step) => step == currentStep)
      : currentStep == (Array.isArray(children) ? children : [children]).length - 1
        ? Math.max(...completedSteps) + 1
        : currentStep, 'next')
    return setCurrentStep((prev) =>
      completedSteps.findIndex((step) => step == prev) !== -1
        ? completedSteps.findIndex((step) => step == prev)
        : prev == (Array.isArray(children) ? children : [children]).length - 1
          ? Math.max(...completedSteps) + 1
          : prev
    );
  };

  return (
    <div>
      <div className="flex flex-row items-center justify-between space-x-2 dark:text-zinc-300">
        {(Array.isArray(children) ? children : [children])?.map(
          ({ props: step }, index) => {
            return (
              <React.Fragment key={`Stepper-step-${index}`}>
                <button
                  type="button"
                  disabled={
                    (Array.isArray(children) ? children : [children]).length ===
                    completedSteps.length || !completion
                  }
                  className="font-montserrat flex items-center space-x-2"
                  onClick={() => {
                    onStepChange?.(index, index < currentStep ? 'prev' : 'next');
                    setCurrentStep(index);
                  }}
                >
                  <span
                    className={clsx(
                      "inline-flex h-8 w-8 items-center justify-center rounded-full bg-zinc-600 text-center align-middle font-light text-white ring-1 ring-inset ring-zinc-500",
                      {
                        "ring-pea-500":
                          index === currentStep ||
                          completedSteps.includes(index),
                      }
                    )}
                  >
                    {completedSteps.includes(index) ? (
                      <CheckmarkIcon />
                    ) : (
                      step?.icon || index + 1
                    )}
                  </span>
                  <div className="flex flex-col">
                    <span
                      className={clsx("text-base", {
                        "font-semibold": index === currentStep,
                      })}
                    >
                      {step.title}
                    </span>
                    {step.optional && <span className="text-xs">Optional</span>}
                  </div>
                </button>
                {index !==
                  (Array.isArray(children) ? children : [children]).length -
                  1 && (
                    <div className="relative h-px w-full grow overflow-hidden bg-zinc-500">
                      <span
                        className={clsx(
                          "bg-pea-500 absolute left-0 bottom-0 top-0 w-full -translate-x-full transition-transform duration-300 ease-in-out",
                          {
                            "translate-x-0": index < currentStep,
                          }
                        )}
                      />
                    </div>
                  )}
              </React.Fragment>
            );
          }
        )}
      </div>

      <div className="my-3">
        {(Array.isArray(children) ? children : [children]).map(
          ({ props: step }, index) => {
            return (
              <Step {...step} key={`Stepper-step-child-${index}`} className={clsx(step.className, {
                "block": index === currentStep,
                "hidden": index !== currentStep
              })}>
                {step.children}
              </Step>
            );
          }
        )}
        <div className="flex items-center justify-between">
          {completedSteps.length !==
            (Array.isArray(children) ? children : [children]).length && (
              <Button
                disabled={currentStep == 0}
                onClick={() => prevStep()}
                color="DEFAULT"
                variant="outlined"
              >
                Back
              </Button>
            )}
          <div className="inline-flex items-center space-x-3">
            {(completion && completedSteps.length !==
              (Array.isArray(children) ? children : [children]).length) && (
                <Button
                  onClick={() => nextStep()}
                  color="DEFAULT"
                  variant="outlined"
                >
                  Next
                </Button>
              )}
            <Button
              disabled={completedSteps.includes(currentStep) && completion && !(completedSteps.length >=
                (Array.isArray(children) ? children : [children]).length)}
              onClick={() => completeStep(currentStep, completedSteps.length >=
                (Array.isArray(children) ? children : [children]).length)}
              color="DEFAULT"
              variant="outlined"
            >
              {completedSteps.length >=
                (Array.isArray(children) ? children : [children]).length
                ? "Finish"
                : completion
                  ? "Complete"
                  : "Next"}
            </Button>
          </div>
        </div>
      </div>
    </div >
  );
};

export default Stepper;
