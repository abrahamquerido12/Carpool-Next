import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Stepper from '@mui/material/Stepper';
import * as React from 'react';

interface HStepperProps {
  steps: {
    title: string;
    component: React.ReactNode;
  }[];
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;

  actionOnFinish?: () => void;
  labelOnLastStep?: string;
}

export default function HorizontalNonLinearStepper({
  steps,
  activeStep,
  setActiveStep,
  actionOnFinish,
  labelOnLastStep,
}: HStepperProps) {
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;

    if (isLastStep() && actionOnFinish) {
      return actionOnFinish();
    }
    setCompleted({ ...completed, [activeStep]: true });
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step: number) => () => {
    setActiveStep(step);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((step, index) => (
          <Step key={`${step.title} ${index}`} completed={completed[index]}>
            <StepButton color="inherit" onClick={handleStep(index)}>
              {step.title}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        <React.Fragment>
          {steps[activeStep].component}
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
            <Button
              color="inherit"
              disabled={activeStep === 0}
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              Atrás
            </Button>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext} sx={{ mr: 1 }}>
              {isLastStep() && labelOnLastStep ? labelOnLastStep : 'Siguiente'}
            </Button>
          </Box>
        </React.Fragment>
      </div>
    </Box>
  );
}
