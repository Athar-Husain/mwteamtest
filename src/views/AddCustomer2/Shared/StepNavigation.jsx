import React from 'react';
import { Box, Stack, Typography, alpha, useTheme } from '@mui/material';

const StepNavigation = ({ currentStep, totalSteps, stepLabels }) => {
  const theme = useTheme();

  return (
    <Box sx={{ width: '100%', mb: 5 }}>
      <Stack direction="row" spacing={2} justifyContent="center">
        {[...Array(totalSteps).keys()].map((index) => {
          const stepNum = index + 1;
          const isActive = currentStep === stepNum;
          const isCompleted = currentStep > stepNum;

          return (
            <Box key={index} sx={{ textAlign: 'center', flex: 1, maxWidth: 120 }}>
              {/* The Pill */}
              <Box
                sx={{
                  height: 6,
                  borderRadius: 3,
                  bgcolor: isCompleted
                    ? theme.palette.success.main
                    : isActive
                      ? theme.palette.primary.main
                      : alpha(theme.palette.divider, 0.5),
                  transition: 'all 0.4s ease',
                  mb: 1
                }}
              />
              <Typography
                variant="caption"
                sx={{
                  fontWeight: isActive || isCompleted ? 800 : 500,
                  color: isActive ? 'text.primary' : 'text.disabled',
                  fontSize: '0.65rem',
                  textTransform: 'uppercase',
                  letterSpacing: 1
                }}
              >
                {stepLabels[index]}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default StepNavigation;
