
/* STEP 1: Recipe Data */

const recipes = [
    {
        id: 1,
        title: "Classic Spaghetti Carbonara",
        time: 25,
        difficulty: "easy",
        description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.",
        category: "pasta"
    },
    {
        id: 2,
        title: "Chicken Tikka Masala",
        time: 45,
        difficulty: "medium",
        description: "Tender chicken pieces in a creamy, spiced tomato sauce.",
        category: "curry"
    },
    {
        id: 3,
        title: "Homemade Croissants",
        time: 180,
        difficulty: "hard",
        description: "Buttery, flaky French pastries that require patience but deliver amazing results.",
        category: "baking"
    },
    {
        id: 4,
        title: "Greek Salad",
        time: 15,
        difficulty: "easy",
        description: "Fresh vegetables, feta cheese, and olives tossed in olive oil and herbs.",
        category: "salad"
    },
    {
        id: 5,
        title: "Beef Wellington",
        time: 120,
        difficulty: "hard",
        description: "Tender beef fillet coated with mushroom duxelles and wrapped in puff pastry.",
        category: "meat"
    },
    {
        id: 6,
        title: "Vegetable Stir Fry",
        time: 20,
        difficulty: "easy",
        description: "Colorful mixed vegetables cooked quickly in a savory sauce.",
        category: "vegetarian"
    },
    {
        id: 7,
        title: "Pad Thai",
        time: 30,
        difficulty: "medium",
        description: "Thai stir-fried rice noodles with shrimp, peanuts, and tangy tamarind sauce.",
        category: "noodles"
    },
    {
        id: 8,
        title: "Margherita Pizza",
        time: 60,
        difficulty: "medium",
        description: "Classic Italian pizza with fresh mozzarella, tomatoes, and basil.",
        category: "pizza"
    }
];


/* STEP 2: State Management */

let currentFilter = "all";
let currentSort = "none";


/* STEP 3: DOM References */

const recipeContainer = document.querySelector("#recipe-container");
const filterButtons = document.querySelectorAll(".filter-btn");
const sortButtons = document.querySelectorAll(".sort-btn");


/* STEP 4: Pure Filter Functions */

const filterByDifficulty = (recipes, difficulty) => {
    return recipes.filter(recipe => recipe.difficulty === difficulty);
};

const filterByTime = (recipes, maxTime) => {
    return recipes.filter(recipe => recipe.time < maxTime);
};

const applyFilter = (recipes, filterType) => {
    switch (filterType) {
        case "easy":
            return filterByDifficulty(recipes, "easy");

        case "medium":
            return filterByDifficulty(recipes, "medium");

        case "hard":
            return filterByDifficulty(recipes, "hard");

        case "quick":
            return filterByTime(recipes, 30);

        case "all":
        default:
            return [...recipes];
    }
};


/* STEP 5: Pure Sort Functions */

const sortByName = (recipes) => {
    return [...recipes].sort((a, b) =>
        a.title.localeCompare(b.title)
    );
};

const sortByTime = (recipes) => {
    return [...recipes].sort((a, b) => a.time - b.time);
};

const applySort = (recipes, sortType) => {
    switch (sortType) {
        case "name":
            return sortByName(recipes);

        case "time":
            return sortByTime(recipes);

        case "none":
        default:
            return [...recipes];
    }
};


/* STEP 6: Create Recipe Card */

const createRecipeCard = (recipe) => {
    return `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>

            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">
                    ${recipe.difficulty}
                </span>
            </div>

            <p>${recipe.description}</p>
        </div>
    `;
};


/* STEP 7: Render Recipes */

const renderRecipes = (recipesToRender) => {
    recipeContainer.innerHTML = recipesToRender
        .map(createRecipeCard)
        .join("");
};


/* STEP 8: Update Active Button States */

const updateActiveButtons = () => {
    filterButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });

    sortButtons.forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.sort === currentSort
        );
    });
};


/* STEP 9: Update Display */

const updateDisplay = () => {
    let recipesToDisplay = applyFilter(recipes, currentFilter);

    recipesToDisplay = applySort(recipesToDisplay, currentSort);

    renderRecipes(recipesToDisplay);
    updateActiveButtons();

    console.log(
        `Displaying ${recipesToDisplay.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`
    );
};


/* STEP 10: Event Listeners */

const setupEventListeners = () => {
    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentFilter = button.dataset.filter;
            updateDisplay();
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener("click", () => {
            currentSort = button.dataset.sort;
            updateDisplay();
        });
    });
};


/* STEP 11: Initialize Application */

setupEventListeners();
updateDisplay();
