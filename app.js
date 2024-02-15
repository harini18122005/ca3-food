
// Function to fetch a random meal
function getRandomMeal() {
    const apiUrl = 'https://www.themealdb.com/api/json/v1/1/random.php';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const meal = data.meals[0];

            // Display the random meal image
            const menuFoodImg = document.getElementById('menufood');
            menuFoodImg.src = meal.strMealThumb;
            menuFoodImg.alt = meal.strMeal;

            // Add click event listener to the meal image
            menuFoodImg.addEventListener('click', function() {
                // Display ingredients and procedure when image is clicked
                displayIngredientsAndProcedure(meal);
            });
        })
        .catch(error => {
            console.error('Error fetching random meal:', error);
        });
}

// Function to display ingredients and procedure
function displayIngredientsAndProcedure(meal) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];

        if (ingredient && measure) {
            ingredients.push(`${measure} ${ingredient}`);
        } else {
            break;
        }
    }

    // Display name and instructions in the 'meal-details' div
    const mealDetailsContainer = document.getElementById('meal-details');
    mealDetailsContainer.innerHTML = `
        <h2>${meal.strMeal}</h2>
        <h3>Ingredients:</h3>
        <ul>
            ${ingredients.map(ingredient => `<li>${ingredient}</li>`).join('')}
        </ul>
        <h3>Procedure:</h3>
        <p>${meal.strInstructions}</p>
    `;
}

// Get a random meal when the page loads
getRandomMeal();

document.addEventListener('DOMContentLoaded', function () {
    const foodGrid = document.getElementById('foodGrid');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const mealDetailsContainer = document.getElementById('mealDetailsContainer');

    async function searchMeals() {
        const searchTerm = searchInput.value.trim();

        if (searchTerm !== '') {
            const apiUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`;

            try {
                const response = await fetch(apiUrl);
                const data = await response.json();

                // Clear existing content in foodGrid
                foodGrid.innerHTML = '';

                if (data.meals) {
                    data.meals.forEach(meal => {
                        const container = document.createElement('div');
                        container.classList.add('container1');

                        const image = document.createElement('img');
                        image.src = meal.strMealThumb;
                        image.alt = meal.strMeal;

                        // Add click event listener to the image
                        image.addEventListener('click', function () {
                            displayMealDetails(meal.idMeal);
                        });

                        container.appendChild(image);
                        foodGrid.appendChild(container);
                    });
                } else {
                    const noResultsMessage = document.createElement('p');
                    noResultsMessage.textContent = 'No results found.';
                    foodGrid.appendChild(noResultsMessage);
                }
            } catch (error) {
                console.error('Error fetching meals:', error);
            }
        }
    }

    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        searchMeals();
    });

    searchInput.addEventListener('keyup', function (event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            searchMeals();
        }
    });

    async function displayMealDetails(mealId) {
        const apiUrl = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;

        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            if (data.meals && data.meals.length > 0) {
                const meal = data.meals[0];
                renderMealDetails(meal);
            } else {
                console.error('No meal found with the given ID.');
            }
        } catch (error) {
            console.error('Error fetching meal details:', error);
        }
    }

    function renderMealDetails(meal) {
        mealDetailsContainer.innerHTML = `
            <h2>${meal.strMeal}</h2>
            <h3>Ingredients:</h3>
            <ul>${getIngredientsList(meal)}</ul>
            <h3>Instructions:</h3>
            <p>${meal.strInstructions}</p>
        `;
    }

    function getIngredientsList(meal) {
        let ingredientsList = '';
        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`];
            if (ingredient) {
                ingredientsList += `<li>${meal[`strMeasure${i}`]} ${ingredient}</li>`;
            } else {
                break;
            }
        }
        return ingredientsList;
    }
});
