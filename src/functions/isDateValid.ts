//* Function to check if the input date is in 'dd/mm/yy' format and is valid
export function isDateValid(dateString: string) {
  //* Regex to check if date is in the 'dd/mm/yy' format
  const dateFormatRegex = /^\d{2}\/\d{2}\/\d{2}$/;

  if (!dateFormatRegex.test(dateString)) {
    return false;
  }

  //* Separate day, month, and year from the string
  const [day, month, year] = dateString
    .split('/')
    .map((num) => parseInt(num, 10));

  //* Validate the month (should be 1-12) and the year (should be a valid 2-digit year)
  if (month < 1 || month > 12) {
    return false;
  }

  //* Generate a Date object with the given day, month, and year
  const fullYear = 2000 + year;
  const dateObj = new Date(fullYear, month - 1, day);

  //* Validate
  if (
    dateObj.getDate() !== day ||
    dateObj.getMonth() !== month - 1 ||
    dateObj.getFullYear() !== fullYear
  ) {
    return false;
  }

  return true;
}
