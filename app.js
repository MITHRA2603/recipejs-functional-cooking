
(() => {
    console.log("RecipeApp initializing...");

    // 1. Recipe data
    const recipes = [
        {
            title: "Classic Pancakes",
            category: "Breakfast",
            time: 20,
            difficulty: "Easy",
            ingredients: ["1 cup flour", "1 egg", "3/4 cup milk", "1 tbsp sugar", "1 tsp baking powder", "2 tbsp butter"],
            steps: ["Mix flour, sugar, and baking powder.", "Whisk egg, milk, and melted butter.", "Combine wet and dry ingredients.", "Heat a greased pan.", "Pour batter into the pan.", "Flip when bubbles appear.", "Cook until golden and serve."]
        },
        {
            title: "Spaghetti Carbonara",
            category: "Dinner",
            time: 30,
            difficulty: "Medium",
            ingredients: ["200 g spaghetti", "100 g bacon", "2 eggs", "Parmesan cheese", "2 garlic cloves", "Salt and pepper"],
            steps: ["Boil spaghetti and reserve some pasta water.", "Cook bacon until crisp.", "Whisk eggs with Parmesan.", {
                text: "Combine the pasta and sauce.",
                substeps: ["Add pasta to the bacon.", "Turn off the heat and add egg mixture.", {
                    text: "Make the sauce creamy.",
                    substeps: ["Add pasta water gradually.", "Toss quickly without scrambling the eggs."]
                }]
            }, "Serve with extra Parmesan."]
        },
        {
            title: "Chicken Stir Fry",
            category: "Dinner",
            time: 25,
            difficulty: "Easy",
            ingredients: ["300 g chicken", "1 bell pepper", "1 carrot", "2 tbsp soy sauce", "2 garlic cloves", "1 tbsp oil"],
            steps: ["Slice chicken and vegetables.", "Mix soy sauce and garlic.", "Heat oil in a pan.", "Cook chicken thoroughly.", "Add vegetables.", "Stir-fry for 4–5 minutes.", "Add sauce and mix.", "Serve hot with rice."]
        },
        {
            title: "Chocolate Chip Cookies",
            category: "Dessert",
            time: 35,
            difficulty: "Medium",
            ingredients: ["1 1/4 cups flour", "1/2 cup butter", "1/2 cup brown sugar", "1 egg", "1/2 tsp baking soda", "3/4 cup chocolate chips"],
            steps: ["Preheat oven to 175°C.", "Cream butter and sugar.", "Beat in the egg.", "Mix flour and baking soda.", "Combine wet and dry mixtures.", "Fold in chocolate chips.", "Place dough on a baking tray.", "Bake for 10–12 minutes and cool."]
        },
        {
            title: "Caesar Salad",
            category: "Lunch",
            time: 15,
            difficulty: "Easy",
            ingredients: ["Romaine lettuce", "Croutons", "Parmesan cheese", "Caesar dressing", "Lemon juice", "Black pepper"],
            steps: ["Wash and dry the lettuce.", "Tear lettuce into pieces.", "Place lettuce in a bowl.", "Add dressing and lemon juice.", "Toss until coated.", "Add croutons and Parmesan.", "Season with pepper and serve."]
        },
        {
            title: "Beef Tacos",
            category: "Dinner",
            time: 25,
            difficulty: "Medium",
            ingredients: ["250 g ground beef", "6 taco shells", "1 tsp cumin", "1 tsp paprika", "1 tomato", "Lettuce", "Grated cheese", "Salsa"],
            steps: ["Prepare the toppings.", "Heat a pan.", "Cook beef until browned.", "Add cumin and paprika.", "Simmer with a little water.", "Warm the taco shells.", "Fill shells with beef.", "Add toppings and salsa."]
        },
        {
            title: "Vegetable Curry",
            category: "Dinner",
            time: 40,
            difficulty: "Hard",
            ingredients: ["1 potato", "Cauliflower", "1 carrot", "1 onion", "2 tomatoes", "Curry powder", "Coconut milk", "Oil"],
            steps: ["Chop the vegetables.", "Heat oil and sauté onion.", "Add curry powder.", {
                text: "Prepare the curry base.",
                substeps: ["Add tomatoes and cook until soft.", "Add coconut milk and water."]
            }, "Add the vegetables.", "Bring to a gentle simmer.", "Cover and cook until tender.", "Adjust seasoning and serve."]
        },
        {
            title: "Pad Thai",
            category: "Dinner",
            time: 30,
            difficulty: "Hard",
            ingredients: ["200 g rice noodles", "Shrimp or tofu", "2 eggs", "Tamarind sauce", "Bean sprouts", "Crushed peanuts", "Lime"],
            steps: ["Soak the rice noodles.", "Mix the tamarind sauce.", "Heat oil in a wok.", "Cook shrimp or tofu.", "Scramble the eggs.", "Add noodles and sauce.", "Return shrimp or tofu to the wok.", "Add bean sprouts and serve with peanuts and lime."]
        }
    ];

    // 2. Private state
    let currentFilter = "all";
    let currentSort = "none";
    let searchQuery = "";
    let debounceTimer;

    // Load saved favorites safely
    const loadFavorites = () => {
        try {
            const saved = JSON.parse(localStorage.getItem("recipeFavorites"));
            return Array.isArray(saved)
                ? saved.filter(id => Number.isInteger(id) && id >= 0 && id < recipes.length)
                : [];
        } catch (error) {
            console.warn("Could not load favorites.", error);
            return [];
        }
    };

    let favorites = loadFavorites();

    // 3. DOM references
    const recipeContainer = document.getElementById("recipe-container");
    const searchInput = document.getElementById("search-input");
    const clearSearchButton = document.getElementById("clear-search");
    const recipeCounter = document.getElementById("recipe-counter");
    const filterButtons = document.querySelectorAll("[data-filter]");
    const sortButtons = document.querySelectorAll("[data-sort]");

    // 4. Search recipes by title, ingredients, or optional description
    const filterBySearch = (items, query) => {
        const lowerQuery = query.toLowerCase().trim();

        if (!lowerQuery) return items;

        return items.filter(recipe => {
            const titleMatch = recipe.title.toLowerCase().includes(lowerQuery);

            const ingredientMatch = recipe.ingredients.some(ingredient =>
                ingredient.toLowerCase().includes(lowerQuery)
            );

            const descriptionMatch = (recipe.description || "")
                .toLowerCase()
                .includes(lowerQuery);

            return titleMatch || ingredientMatch || descriptionMatch;
        });
    };

    // 5. Filter recipes
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
            case "favorites":
                return items.filter(recipe => favorites.includes(recipes.indexOf(recipe)));
            default:
                return items;
        }
    };

    // 6. Sort recipes without changing the original array
    const applySort = (items) => {
        if (currentSort === "name") {
            return [...items].sort((a, b) => a.title.localeCompare(b.title));
        }

        if (currentSort === "time") {
            return [...items].sort((a, b) => a.time - b.time);
        }

        return items;
    };

    // 7. Recursively render nested cooking steps
    const renderSteps = (steps, level = 0) => `
        <ol class="steps-list level-${level}">
            ${steps.map(step => {
                if (typeof step === "string") {
                    return `<li>${step}</li>`;
                }

                return `
                    <li>
                        ${step.text}
                        ${step.substeps ? renderSteps(step.substeps, level + 1) : ""}
                    </li>
                `;
            }).join("")}
        </ol>
    `;

    const createIngredientsHTML = ingredients => `
        <ul class="ingredients-list">
            ${ingredients.map(item => `<li>${item}</li>`).join("")}
        </ul>
    `;

    // 8. Create recipe card
    const createRecipeCard = recipe => {
        const recipeId = recipes.indexOf(recipe);
        const isFavorite = favorites.includes(recipeId);

        return `
            <article class="recipe-card" data-recipe-id="${recipeId}">
                <div class="recipe-meta">
                    <span class="difficulty-badge ${recipe.difficulty.toLowerCase()}">
                        ${recipe.difficulty}
                    </span>
                    <span class="recipe-time">⏱ ${recipe.time} min</span>
                </div>

                <button
                    class="favorite-btn ${isFavorite ? "is-favorite" : ""}"
                    data-recipe-id="${recipeId}"
                    aria-label="${isFavorite ? "Remove from favorites" : "Add to favorites"}"
                    aria-pressed="${isFavorite}"
                    type="button">
                    ${isFavorite ? "♥" : "♡"}
                </button>

                <h2>${recipe.title}</h2>
                <p>${recipe.category}</p>

                <div class="recipe-actions">
                    <button class="toggle-btn" data-toggle="steps"
                        data-recipe-id="${recipeId}" aria-expanded="false" type="button">
                        Show Steps
                    </button>
                    <button class="toggle-btn" data-toggle="ingredients"
                        data-recipe-id="${recipeId}" aria-expanded="false" type="button">
                        Show Ingredients
                    </button>
                </div>

                <section class="expandable-section" data-section="steps" hidden>
                    <h3>Cooking Steps</h3>
                    ${renderSteps(recipe.steps)}
                </section>

                <section class="expandable-section" data-section="ingredients" hidden>
                    <h3>Ingredients</h3>
                    ${createIngredientsHTML(recipe.ingredients)}
                </section>
            </article>
        `;
    };

    // 9. Render cards and update the counter
    const renderRecipes = items => {
        recipeContainer.innerHTML = items.length
            ? items.map(createRecipeCard).join("")
            : '<p class="empty-message">No recipes found. Try another search.</p>';
    };

    const updateRecipeCounter = count => {
        recipeCounter.textContent = `Showing ${count} of ${recipes.length} recipes`;
    };

    const updateActiveButtons = () => {
        filterButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.filter === currentFilter);
        });

        sortButtons.forEach(button => {
            button.classList.toggle("active", button.dataset.sort === currentSort);
        });
    };

    // Search first, then filter, then sort
    const updateDisplay = () => {
        const searched = filterBySearch(recipes, searchQuery);
        const filtered = applyFilter(searched);
        const sorted = applySort(filtered);

        renderRecipes(sorted);
        updateRecipeCounter(sorted.length);
        updateActiveButtons();
        clearSearchButton.hidden = searchQuery.length === 0;
    };

    // 10. Save favorites to localStorage
    const saveFavorites = () => {
        try {
            localStorage.setItem("recipeFavorites", JSON.stringify(favorites));
        } catch (error) {
            console.warn("Could not save favorites.", error);
        }
    };

    const toggleFavorite = recipeId => {
        if (favorites.includes(recipeId)) {
            favorites = favorites.filter(id => id !== recipeId);
        } else {
            favorites = [...favorites, recipeId];
        }

        saveFavorites();
        updateDisplay();
    };

    // 11. Toggle steps and ingredients using event delegation
    const handleToggleClick = event => {
        const button = event.target.closest(".toggle-btn");
        if (!button || !recipeContainer.contains(button)) return;

        const card = button.closest(".recipe-card");
        const section = card.querySelector(`[data-section="${button.dataset.toggle}"]`);

        if (!section) return;

        const isOpening = section.hidden;
        section.hidden = !isOpening;
        section.classList.toggle("visible", isOpening);

        const label = button.dataset.toggle === "steps" ? "Steps" : "Ingredients";
        button.textContent = isOpening ? `Hide ${label}` : `Show ${label}`;
        button.setAttribute("aria-expanded", String(isOpening));
    };

    const handleFavoriteClick = event => {
        const button = event.target.closest(".favorite-btn");
        if (!button || !recipeContainer.contains(button)) return;

        const recipeId = Number(button.dataset.recipeId);
        if (Number.isInteger(recipeId) && recipes[recipeId]) {
            toggleFavorite(recipeId);
        }
    };

    // 12. Debounced search: wait 300ms after typing stops
    const handleSearchInput = () => {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            searchQuery = searchInput.value;
            updateDisplay();
        }, 300);

        clearSearchButton.hidden = searchInput.value.length === 0;
    };

    const clearSearch = () => {
        clearTimeout(debounceTimer);
        searchInput.value = "";
        searchQuery = "";
        updateDisplay();
        searchInput.focus();
    };

    // 13. Event listeners
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

        searchInput.addEventListener("input", handleSearchInput);
        clearSearchButton.addEventListener("click", clearSearch);

        recipeContainer.addEventListener("click", event => {
            handleToggleClick(event);
            handleFavoriteClick(event);
        });

        console.log("Event listeners attached!");
    };

    // 14. Public API
    const init = () => {
        setupEventListeners();
        updateDisplay();
        console.log("RecipeApp ready!");
    };

    window.RecipeApp = Object.freeze({
        init,
        updateDisplay
    });

    init();
})();
