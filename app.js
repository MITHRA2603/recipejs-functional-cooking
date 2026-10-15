
(() => {
    console.log("RecipeApp initializing...");

    // Private recipe data
    const recipes = [
        {
            title: "Classic Pancakes",
            category: "Breakfast",
            time: 20,
            difficulty: "Easy",
            ingredients: ["1 cup flour", "1 egg", "3/4 cup milk", "1 tbsp sugar", "1 tsp baking powder", "2 tbsp butter"],
            steps: [
                "Mix flour, sugar, and baking powder.",
                "Whisk egg, milk, and melted butter in another bowl.",
                "Combine wet and dry ingredients.",
                "Heat a lightly greased pan.",
                "Pour a small amount of batter into the pan.",
                "Cook until bubbles appear, then flip.",
                "Cook until golden and serve warm."
            ]
        },
        {
            title: "Spaghetti Carbonara",
            category: "Dinner",
            time: 30,
            difficulty: "Medium",
            ingredients: ["200 g spaghetti", "100 g bacon", "2 eggs", "1/2 cup Parmesan", "2 garlic cloves", "Salt and pepper"],
            steps: [
                "Boil salted water and cook the spaghetti.",
                "Reserve a cup of pasta water before draining.",
                "Cook bacon in a pan until crisp.",
                "Whisk eggs, Parmesan, and pepper in a bowl.",
                {
                    text: "Combine the pasta and sauce.",
                    substeps: [
                        "Add the hot pasta to the bacon pan.",
                        "Turn off the heat and add the egg mixture.",
                        {
                            text: "Make the sauce creamy.",
                            substeps: [
                                "Add a little reserved pasta water.",
                                "Toss quickly without scrambling the eggs."
                            ]
                        }
                    ]
                },
                "Serve immediately with extra Parmesan."
            ]
        },
        {
            title: "Chicken Stir Fry",
            category: "Dinner",
            time: 25,
            difficulty: "Easy",
            ingredients: ["300 g chicken", "1 bell pepper", "1 carrot", "2 tbsp soy sauce", "2 garlic cloves", "1 tbsp oil"],
            steps: [
                "Slice the chicken and vegetables.",
                "Mix soy sauce with minced garlic.",
                "Heat oil in a large pan.",
                "Cook chicken until fully cooked.",
                "Add the vegetables.",
                "Stir-fry for 4–5 minutes.",
                "Add the sauce and mix well.",
                "Serve hot with rice."
            ]
        },
        {
            title: "Chocolate Chip Cookies",
            category: "Dessert",
            time: 35,
            difficulty: "Medium",
            ingredients: ["1 1/4 cups flour", "1/2 cup butter", "1/2 cup brown sugar", "1 egg", "1/2 tsp baking soda", "3/4 cup chocolate chips"],
            steps: [
                "Preheat the oven to 175°C.",
                "Cream butter and sugar together.",
                "Beat in the egg.",
                "Mix flour and baking soda separately.",
                "Combine the dry and wet mixtures.",
                "Fold in chocolate chips.",
                "Place spoonfuls of dough on a baking tray.",
                "Bake for 10–12 minutes and allow to cool."
            ]
        },
        {
            title: "Caesar Salad",
            category: "Lunch",
            time: 15,
            difficulty: "Easy",
            ingredients: ["Romaine lettuce", "1/2 cup croutons", "1/4 cup Parmesan", "3 tbsp Caesar dressing", "Lemon juice", "Black pepper"],
            steps: [
                "Wash and dry the lettuce.",
                "Tear the leaves into bite-sized pieces.",
                "Place lettuce in a large bowl.",
                "Add Caesar dressing and lemon juice.",
                "Toss until the leaves are coated.",
                "Add croutons and Parmesan.",
                "Season with pepper and serve."
            ]
        },
        {
            title: "Beef Tacos",
            category: "Dinner",
            time: 25,
            difficulty: "Medium",
            ingredients: ["250 g ground beef", "6 taco shells", "1 tsp cumin", "1 tsp paprika", "1 tomato", "Shredded lettuce", "Grated cheese", "Salsa"],
            steps: [
                "Chop the tomato and prepare the toppings.",
                "Heat a pan over medium heat.",
                "Cook the beef until browned.",
                "Add cumin and paprika.",
                "Add a little water and simmer.",
                "Warm the taco shells.",
                "Fill shells with the cooked beef.",
                "Add lettuce, tomato, cheese, and salsa."
            ]
        },
        {
            title: "Vegetable Curry",
            category: "Dinner",
            time: 40,
            difficulty: "Hard",
            ingredients: ["1 potato", "1 cup cauliflower", "1 carrot", "1 onion", "2 tomatoes", "1 tbsp curry powder", "1 cup coconut milk", "1 tbsp oil"],
            steps: [
                "Chop all vegetables into small pieces.",
                "Heat oil and sauté the onion.",
                "Add curry powder and stir.",
                {
                    text: "Prepare the curry base.",
                    substeps: [
                        "Add chopped tomatoes and cook until soft.",
                        "Pour in coconut milk and half a cup of water."
                    ]
                },
                "Add the potato, carrot, and cauliflower.",
                "Bring the curry to a gentle simmer.",
                "Cover and cook until the vegetables are tender.",
                "Taste, adjust seasoning, and serve with rice."
            ]
        },
        {
            title: "Pad Thai",
            category: "Dinner",
            time: 30,
            difficulty: "Hard",
            ingredients: ["200 g rice noodles", "200 g shrimp or tofu", "2 eggs", "2 tbsp tamarind sauce", "Bean sprouts", "Crushed peanuts", "Lime wedges"],
            steps: [
                "Soak the rice noodles according to the package.",
                "Mix tamarind sauce with fish or soy sauce.",
                "Heat oil in a wok.",
                "Cook shrimp or tofu and set aside.",
                "Scramble the eggs in the wok.",
                "Add noodles and sauce, then toss.",
                "Return shrimp or tofu to the wok.",
                "Add bean sprouts and serve with peanuts and lime."
            ]
        }
    ];

    let currentFilter = "all";
    let currentSort = "none";

    const recipeContainer = document.getElementById("recipe-container");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // Filtering
    const applyFilter = (items) => {
        switch (currentFilter) {
            case "easy":
                return items.filter(recipe => recipe.difficulty === "Easy");
            case "medium":
                return items.filter(recipe => recipe.difficulty === "Medium");
            case "hard":
                return items.filter(recipe => recipe.difficulty === "Hard");
            case "quick":
                return items.filter(recipe => recipe.time < 30);
            default:
                return items;
        }
    };

    // Sorting
    const applySort = (items) => {
        if (currentSort === "name") {
            return [...items].sort((a, b) =>
                a.title.localeCompare(b.title)
            );
        }

        if (currentSort === "time") {
            return [...items].sort((a, b) => a.time - b.time);
        }

        return items;
    };

    // Recursion: render nested steps at any depth
    const renderSteps = (steps, level = 0) => {
        return `
            <ol class="steps-list level-${level}">
                ${steps.map(step => {
                    if (typeof step === "string") {
                        return `<li>${step}</li>`;
                    }

                    return `
                        <li>
                            ${step.text}
                            ${step.substeps
                                ? renderSteps(step.substeps, level + 1)
                                : ""}
                        </li>
                    `;
                }).join("")}
            </ol>
        `;
    };

    const createStepsHTML = (steps) => renderSteps(steps);

    const createIngredientsHTML = (ingredients) => `
        <ul class="ingredients-list">
            ${ingredients.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

    // Create each recipe card
    const createRecipeCard = (recipe) => {
        const recipeId = recipes.indexOf(recipe);

        return `
            <article class="recipe-card" data-recipe-id="${recipeId}">
                <div class="recipe-meta">
                    <span class="difficulty-badge ${recipe.difficulty.toLowerCase()}">
                        ${recipe.difficulty}
                    </span>
                    <span class="recipe-time">⏱ ${recipe.time} min</span>
                </div>

                <h2>${recipe.title}</h2>
                <p>${recipe.category}</p>

                <div class="recipe-actions">
                    <button class="toggle-btn"
                        data-recipe-id="${recipeId}"
                        data-toggle="steps"
                        aria-expanded="false">
                        Show Steps
                    </button>

                    <button class="toggle-btn"
                        data-recipe-id="${recipeId}"
                        data-toggle="ingredients"
                        aria-expanded="false">
                        Show Ingredients
                    </button>
                </div>

                <section class="expandable-section"
                    data-section="steps" hidden>
                    <h3>Cooking Steps</h3>
                    ${createStepsHTML(recipe.steps)}
                </section>

                <section class="expandable-section"
                    data-section="ingredients" hidden>
                    <h3>Ingredients</h3>
                    ${createIngredientsHTML(recipe.ingredients)}
                </section>
            </article>
        `;
    };

    const renderRecipes = (items) => {
        recipeContainer.innerHTML = items.length
            ? items.map(createRecipeCard).join("")
            : "<p>No recipes found.</p>";
    };

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

    const updateDisplay = () => {
        const filtered = applyFilter(recipes);
        const sorted = applySort(filtered);

        renderRecipes(sorted);
        updateActiveButtons();
    };

    // Event delegation: one listener handles all toggle buttons
    const handleToggleClick = (event) => {
        const button = event.target.closest(".toggle-btn");

        if (!button || !recipeContainer.contains(button)) return;

        const recipeId = button.dataset.recipeId;
        const toggleType = button.dataset.toggle;

        const card = recipeContainer.querySelector(
            `.recipe-card[data-recipe-id="${recipeId}"]`
        );

        if (!card) return;

        const section = card.querySelector(
            `[data-section="${toggleType}"]`
        );

        if (!section) return;

        const isOpening = section.hidden;
        section.hidden = !isOpening;
        section.classList.toggle("visible", isOpening);

        const label = toggleType === "steps" ? "Steps" : "Ingredients";
        button.textContent = isOpening
            ? `Hide ${label}`
            : `Show ${label}`;

        button.setAttribute("aria-expanded", String(isOpening));
    };

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

        recipeContainer.addEventListener("click", handleToggleClick);
        console.log("Event listeners attached!");
    };

    const init = () => {
        setupEventListeners();
        updateDisplay();
        console.log("RecipeApp ready!");
    };

    // Public API; other variables and functions stay private
    window.RecipeApp = Object.freeze({
        init,
        updateDisplay
    });

    init();
})();
