const search = document.getElementById('input-box');
const submitArea = document.getElementById('submit-area');
const foodItem = document.getElementById('meals');
const resultHeading = document.getElementById('result-heading');
const foodIngredients = document.getElementById('food-ingredient');

function searchMeal(beef) {
    beef.preventDefault();
    foodIngredients.innerHTML = '';
    const term = search.value;

    if (term.trim()) {
        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
            .then(res => res.json())
            .then(data => {
                resultHeading.innerHTML = `<h2>Search results for ${term}:</h2>`;

                if (data.meals == null) {
                    resultHeading.innerHTML = `Sorry we have nothing for you. Please try again!!!`;
                } else {
                    foodItem.innerHTML = data.meals.map(meal => `
                        <div class="meal">
                          <img src="${meal.strMealThumb}" alt="${meal.strMeal}" />
                          <div class="meal-info" data-mealID="${meal.idMeal}">
                            <h3>${meal.strMeal}</h3>
                          </div>
                        </div>
                    `).join('');
                }
            });
        search.value = '';
    } else { 
        alert('Input area is empty. Please search food item...'); 
    }
}
function getMealById(mealID) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}
function getDetailsMeal(mealID) {
    foodItem.innerHTML = '';
    resultHeading.innerHTML = '';

    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${mealID}`)
        .then(res => res.json())
        .then(data => {
            const meal = data.meals[0];
            addMealToDOM(meal);
        });
}
function addMealToDOM(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        if (meal[`strIngredient${i}`]) {
            ingredients.push(`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`);
        } else {
            break;
        }
    }
    foodIngredients.innerHTML = `
        <div class="food-ingredient">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}"/>
            <div class="main">
                <h1 >Food Name: ${meal.strMeal}</h1>
                <h2 id="heading">Ingredients</h2>
                <ol>
                  ${ingredients.map(ing => `<li>${ing}</li>`).join('')}
                </ol>
            </div>
        </div>
    `;
}
submitArea.addEventListener('submit', searchMeal);
meals.addEventListener('click', getDetailsMeal);
foodItem.addEventListener('click', apple => {
    const mealInfo = apple.path.find(item => {
        if (item.classList) {
            return item.classList.contains('meal-info');
        } else {
            return false;
        }
    });
    if (mealInfo) {
        const mealID = mealInfo.getAttribute('data-mealID');
        getMealById(mealID);
    }
});