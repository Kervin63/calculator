const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let expression = '0';
let justEvaluated = false;

function updateDisplay() {
  display.textContent = expression || '0';
}

function clearAll() {
  expression = '0';
  justEvaluated = false;
  updateDisplay();
}

function deleteLast() {
  if (justEvaluated) {
    clearAll();
    return;
  }

  if (expression.length <= 1) {
    expression = '0';
  } else {
    expression = expression.slice(0, -1);
  }

  updateDisplay();
}

function appendNumber(value) {
  if (justEvaluated) {
    expression = value;
    justEvaluated = false;
    updateDisplay();
    return;
  }

  if (expression === '0') {
    expression = value;
  } else {
    expression += value;
  }

  updateDisplay();
}

function appendDecimal() {
  if (justEvaluated) {
    expression = '0.';
    justEvaluated = false;
    updateDisplay();
    return;
  }

  const lastNumber = expression.split(/[+\-*/]/).pop();

  if (lastNumber.includes('.')) {
    return;
  }

  if (/[+\-*/]$/.test(expression) || expression === '0') {
    expression += '0';
  }

  expression += '.';
  updateDisplay();
}

function appendOperator(operator) {
  if (justEvaluated) {
    justEvaluated = false;
  }

  if (expression === '0' && operator === '-') {
    expression = '-';
    updateDisplay();
    return;
  }

  if (/[+\-*/]$/.test(expression)) {
    expression = expression.slice(0, -1) + operator;
    updateDisplay();
    return;
  }

  expression += operator;
  updateDisplay();
}

function evaluateExpression() {
  if (!expression || /[+\-*/]$/.test(expression)) {
    return;
  }

  const safeExpression = expression.replace(/×/g, '*').replace(/÷/g, '/');

  try {
    const result = Function(`"use strict"; return (${safeExpression});`)();

    if (!Number.isFinite(result)) {
      expression = 'Error';
      justEvaluated = true;
      updateDisplay();
      return;
    }

    expression = Number.isInteger(result) ? String(result) : result.toFixed(10).replace(/\.0+$|(?<=\.[0-9]*?)0+$/g, '').replace(/\.$/, '');
    justEvaluated = true;
    updateDisplay();
  } catch {
    expression = 'Error';
    justEvaluated = true;
    updateDisplay();
  }
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    switch (action) {
      case 'clear':
        clearAll();
        break;
      case 'delete':
        deleteLast();
        break;
      case 'number':
        appendNumber(value);
        break;
      case 'operator':
        appendOperator(value);
        break;
      case 'decimal':
        appendDecimal();
        break;
      case 'equals':
        evaluateExpression();
        break;
      default:
        break;
    }
  });
});

document.addEventListener('keydown', (event) => {
  const { key } = event;

  if (/^[0-9]$/.test(key)) {
    appendNumber(key);
  } else if (['+', '-', '*', '/'].includes(key)) {
    appendOperator(key);
  } else if (key === '.') {
    appendDecimal();
  } else if (key === 'Enter' || key === '=') {
    evaluateExpression();
  } else if (key === 'Backspace') {
    deleteLast();
  } else if (key === 'Escape') {
    clearAll();
  }
});

updateDisplay();
