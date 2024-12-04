export const defaultMealInput = {
  breakfast: { stringInput: '', format: false },
  lunch: { stringInput: '', format: false },
  dinner: { stringInput: '', format: false },
  snack: { stringInput: '', format: false },
};

export const defaultBPInput = {
  systolic: [0, 0, 0],
  diastolic: [0, 0, 0],
  pulse: [0, 0, 0],
};

export const defaultDateString = new Date().toLocaleDateString(
  'en-GB',
  {
    day: '2-digit',
    month: '2-digit',
    year: '2-digit',
  }
);
