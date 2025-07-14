module.exports = async (number) => {
  if (!number) throw new Error('Number is not defined');
  
  // Remove spaces and dashes
  number = number.replace(/[\s-]/g, '');
  
  if (number.startsWith('0')) {
    number = '+62' + number.substring(1);
  }
  if (number.startsWith('62')) {
    number = '+' + number;
  }
  
  return number;
};