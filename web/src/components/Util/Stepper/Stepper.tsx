import { Form, FormProps, Submit, useForm } from "@redwoodjs/forms";
import { CheckmarkIcon } from "@redwoodjs/web/dist/toast";
import clsx from "clsx";
import { useState } from "react";

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
  onStepChange?: (step: number, direction: 'prev' | 'next') => void
}

export const Step = ({ title, description, optional, children, className }: Step) => {
  return <div className={className}>
    {children}
  </div>;
};

const Stepper = <TFieldValues extends Record<string, any>>({ children, completion = false, onStepChange, currentStep: currentStepProp = 0 }: IStepperProps<TFieldValues>) => {
  const [currentStep, setCurrentStep] = useState(currentStepProp);
  const [completedSteps, setCompletedSteps] = useState([]);

  const completeStep = (step: number) => {
    setCompletedSteps((prev) => [...prev, step]);
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
              <React.Fragment>
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
              <Step {...step} className={clsx(step.className, {
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
              <>
                <button
                  type={'button'}
                  className="rw-button rw-button-gray-outline rw-button-medium"
                  disabled={currentStep == 0}
                  onClick={() => prevStep()}
                >
                  Back
                </button>
                <div className="inline-flex items-center space-x-3">
                  {completion && (
                    <button
                      type={'button'}
                      className="rw-button rw-button-gray-outline rw-button-medium"
                      onClick={() => nextStep()}
                    >
                      Next
                    </button>
                  )}
                  <button
                    type={'button'}
                    className="rw-button rw-button-gray-outline rw-button-medium"
                    disabled={completedSteps.includes(currentStep) && completion}
                    onClick={() => {
                      completeStep(currentStep);
                    }}
                  >
                    {completedSteps.length ==
                      (Array.isArray(children) ? children : [children]).length - 1
                      ? "Finish"
                      : completion
                        ? "Complete"
                        : "Next"}
                  </button>
                </div>
              </>
            )}
        </div>
      </div>
    </div >
  );
};

export default Stepper;
