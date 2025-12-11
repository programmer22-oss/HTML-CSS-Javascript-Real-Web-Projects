const display = document.getElementById('display');
const buttons = document.querySelectorAll('button');
let currentInput = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const value = button.textContent;
    if (value === '=') {
      try {
        currentInput = eval(currentInput);
        display.value = currentInput;
      } catch (error) {
        display.value = 'Error';
      }
    } else if (value === 'C') {
      currentInput = currentInput.slice(0, -1);
      display.value = currentInput;
    } else if (value === 'AC') {
      currentInput = '';
      display.value = '';
    } else {
      currentInput += value;
      display.value = currentInput;
    }
  });
});