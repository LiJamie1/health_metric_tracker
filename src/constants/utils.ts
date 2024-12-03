export const defaultMealInput = {
  breakfast: { stringInput: '', format: false },
  lunch: { stringInput: '', format: false },
  dinner: { stringInput: '', format: false },
  snack: { stringInput: '', format: false },
};

//* Force timeZone to stop day drifting due to generating as local time
//* and toLocaleDateString again applying local time
export const defaultDateString = () =>
  new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
    timeZone: 'UTC',
  });
