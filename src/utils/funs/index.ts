// Function to generate a random string of a specified length
export function generateRandomString(length: number): string {
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      randomString += charset[randomIndex];
    }
    return randomString;
}

export function capitalize(word) {
  if (typeof word !== 'string') {
    return word; // Handle non-string inputs
  }
  return word.charAt(0).toUpperCase() + word.slice(1);
}

export function roundHalfPreserving(value) {
  const decimalPart = value % 1;
  // Check if the decimal part is exactly 0.5 using strict equality
  if (decimalPart === 0.5) {
    return value;
  } else {
    return Math.round(value);
  }
}

export function formatCurrency(currency_value: string){
  const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency_value,
    
      // These options are needed to round to whole numbers if that's what you want.
      //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
      //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });
  return formatter
}