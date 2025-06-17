const mealContainer = document.getElementById('meal-container');
const buttonContainer = document.getElementById('button-container');
const addMealBtn = document.getElementById('add-meal-btn');
const grandTotalDisplay = document.getElementById('grand-total');

// Calories and Proteins per 100g
const foodCalories = {
  "rice": 130,
  "bread": 75,
  "apple": 52,
  "banana": 89,
  "egg": 155
};

const foodProteins = {
  "rice": 2.7,
  "bread": 8.1,
  "apple": 0.3,
  "banana": 1.1,
  "egg": 13
};

const averageWeights = {
  "apple": 100,
  "banana": 120,
  "egg": 50,
  "rice": 100
};

function unitToGrams(value, unit) {
  switch (unit) {
    case 'g': return value;
    case 'kg': return value * 1000;
    case 'mg': return value / 1000;
    case 'oz': return value * 28.35;
    default: return value;
  }
}

function calculateMealNutrition(mealBlock) {
  const foodRows = mealBlock.querySelectorAll('.food-row');
  let mealCalories = 0;
  let mealProteins = 0;

  foodRows.forEach(row => {
    const food = row.querySelector('.food-name')?.value.toLowerCase().trim();
    const amount = parseFloat(row.querySelector('.food-amount')?.value);
    const unit = row.querySelector('.food-unit')?.value;
    const count = parseFloat(row.querySelector('.food-count')?.value) || 1;

    if (food in foodCalories) {
      let totalGrams;
      if (!amount || isNaN(amount)) {
        totalGrams = averageWeights[food] ? averageWeights[food] * count : 0;
      } else {
        totalGrams = unitToGrams(amount, unit) * count;
      }

      mealCalories += (totalGrams / 100) * foodCalories[food];
      mealProteins += (totalGrams / 100) * (foodProteins[food] || 0);
    }
  });

  const output = mealBlock.querySelector('.calories-output');
  output.innerHTML = `
    Calories: ${mealCalories.toFixed(2)} kcal<br>
    Protein: ${mealProteins.toFixed(2)} g
  `;

  return { calories: mealCalories, proteins: mealProteins };
}

function calculateAllNutrition() {
  const mealBlocks = document.querySelectorAll('.meal-block');
  let grandCalories = 0;
  let grandProteins = 0;

  mealBlocks.forEach(mealBlock => {
    const result = calculateMealNutrition(mealBlock);
    grandCalories += result.calories;
    grandProteins += result.proteins;
  });

  grandTotalDisplay.innerHTML = `
    <strong>Grand Total:</strong><br>
    Calories: ${grandCalories.toFixed(2)} kcal<br>
    Protein: ${grandProteins.toFixed(2)} g
  `;
}

function updateButtonVisibility() {
  const blocks = document.querySelectorAll('.meal-block');

  // Calories Button
  if (blocks.length >= 2 && !document.getElementById('count-all-btn')) {
    const calBtn = document.createElement('button');
    calBtn.id = 'count-all-btn';
    calBtn.textContent = 'Calculate All Calories & Protein';
    calBtn.onclick = calculateAllNutrition;
    buttonContainer.appendChild(calBtn);
  } else if (blocks.length < 2 && document.getElementById('count-all-btn')) {
    document.getElementById('count-all-btn').remove();
  }
}

function updateRemoveButtonsVisibility(mealBlock) {
  const foodRows = mealBlock.querySelectorAll('.food-row');
  if (foodRows.length === 1) {
    foodRows[0].querySelector('.remove-food-btn').style.display = 'none';
  } else {
    foodRows.forEach(row => {
      row.querySelector('.remove-food-btn').style.display = 'inline-block';
    });
  }
}

function addFoodRow(container) {
  const row = document.createElement('div');
  row.className = 'food-row';
  row.innerHTML = `
    <label>Food:</label>
    <input type="text" class="food-name" placeholder="e.g., Apple">
    <label>Amount:</label>
    <input type="number" class="food-amount" placeholder="e.g., 100">
    <select class="food-unit">
      <option value="g">g</option>
      <option value="kg">kg</option>
      <option value="mg">mg</option>
      <option value="oz">oz</option>
    </select>
    <br>
    <label>Units (e.g. 2 apples):</label>
    <input type="number" class="food-count" placeholder="e.g., 2">
    <button type="button" class="remove-food-btn">X</button>
  `;

  row.querySelector('.remove-food-btn').addEventListener('click', () => {
    row.remove();
    updateRemoveButtonsVisibility(container.closest('.meal-block'));
    calculateMealNutrition(container.closest('.meal-block'));
  });

  container.appendChild(row);
  updateRemoveButtonsVisibility(container.closest('.meal-block'));
}

function addMealBlock() {
  const block = document.createElement('div');
  block.className = 'meal-block';
  block.innerHTML = `
    <div class="meal-name-container">
      <label for="meal-name">Meal Name:</label>
      <select class="meal-name-select">
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        <option value="Dinner">Dinner</option>
        <option value="Snack">Snack</option>
        <option value="Custom">Custom</option>
      </select>
      <input type="text" class="custom-meal-name" placeholder="Enter custom name" style="display:none;">
    </div>
    <div class="foods-container"></div>
    <div class="food-entry">
      <button type="button" class="add-food-btn">+ Add Another Food</button>
    </div>
    <div class="calories-output"></div>
  `;

  const foodsContainer = block.querySelector('.foods-container');
  addFoodRow(foodsContainer);

  block.querySelector('.add-food-btn').addEventListener('click', () => {
    addFoodRow(foodsContainer);
  });

  mealContainer.appendChild(block);
  updateButtonVisibility();
}

mealContainer.addEventListener('input', (e) => {
  const meal = e.target.closest('.meal-block');
  if (meal) {
    calculateMealNutrition(meal);
  }
});

function setupDefaultMealBlock() {
  const defaultMealBlock = document.querySelector('.meal-block');
  const addFoodBtn = defaultMealBlock.querySelector('.add-food-btn');
  const foodsContainer = defaultMealBlock.querySelector('.foods-container');

  addFoodBtn.addEventListener('click', () => {
    addFoodRow(foodsContainer);
  });

  updateRemoveButtonsVisibility(defaultMealBlock);
  calculateMealNutrition(defaultMealBlock);
}

setupDefaultMealBlock();
