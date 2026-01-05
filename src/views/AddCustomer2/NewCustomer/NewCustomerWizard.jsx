import React, { useState } from 'react';
import { Box, Fade } from '@mui/material';
import StepNavigation from '../Shared/StepNavigation';

// Internal Steps - We will create these next
import Step1_Profile from './Step1_Profile.jsx';
import Step2_Connection from './Step2_Connection.jsx';
import Step3_PlanSelection from './Step3_PlanSelection.jsx';

const NewCustomerWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);

  // Local state to hold data as we move forward
  const [createdCustomer, setCreatedCustomer] = useState(null);
  const [createdConnection, setCreatedConnection] = useState(null);

  const stepLabels = ['Customer Profile', 'Hardware Setup', 'Plan Selection'];

  const handleStep1Complete = (customer) => {
    setCreatedCustomer(customer);
    setCurrentStep(2);
  };

  const handleStep2Complete = (connection) => {
    setCreatedConnection(connection);
    setCurrentStep(3);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setCreatedCustomer(null);
    setCreatedConnection(null);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <StepNavigation currentStep={currentStep} totalSteps={3} stepLabels={stepLabels} />

      <Box sx={{ mt: 2 }}>
        {currentStep === 1 && (
          <Fade in={currentStep === 1}>
            <Box>
              <Step1_Profile onNext={handleStep1Complete} />
            </Box>
          </Fade>
        )}

        {currentStep === 2 && (
          <Fade in={currentStep === 2}>
            <Box>
              <Step2_Connection customer={createdCustomer} onNext={handleStep2Complete} onBack={handleBack} />
            </Box>
          </Fade>
        )}

        {currentStep === 3 && (
          <Fade in={currentStep === 3}>
            <Box>
              <Step3_PlanSelection customer={createdCustomer} connection={createdConnection} onComplete={handleReset} onBack={handleBack} />
            </Box>
          </Fade>
        )}
      </Box>
    </Box>
  );
};

export default NewCustomerWizard;
