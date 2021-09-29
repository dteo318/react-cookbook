import { useState } from "react";
import Keys from "./config.js";

const NavBar = (props) => {
  return (
    <nav className="flex items-center px-4 py-5 bg-gray-700 text-white">
      <h1 className="mr-12 text-xl font-semibold">My Cookbook</h1>
      <ul className="list-none flex justify-between w-1/3 font-light">
        <li onClick={() => props.changePage("searchRecipes")}>Find Recipes</li>
        <li onClick={() => props.changePage("savedRecipes")}>Saved Recipes</li>
        <li>Costs & Calories</li>
      </ul>
    </nav>
  );
};

const getRecipes = (query, savedRecipes) => {
  const searchRecipeUrl =
    `https://api.spoonacular.com/recipes/complexSearch?apiKey=${Keys.api_key}` +
    `&query=${query}&instructionsRequired=true&addRecipeInformation=true&addRecipeNutrition=true&fillIngredients=true`;

  return fetch(searchRecipeUrl)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      let recipes = [];
      const results = data.results;
      for (let i = 0; i < results.length; i++) {
        const result = results[i];
        try {
          let savedRecipeFound = false;

          for (let i = 0; i < savedRecipes.length; i++) {
            const savedRecipe = savedRecipes[i];
            if (
              savedRecipe.recipeId === result.id &&
              savedRecipe.recipeName === result.title
            ) {
              recipes.push(savedRecipe);
              savedRecipeFound = true;
              break;
            }
          }

          if (!savedRecipeFound) {
            const recipe = {
              recipeSaved: false,
              recipeId: result.id,
              recipeName: result.title,
              recipePreparationTime: result.readyInMinutes,
              recipeCostPerServing: result.pricePerServing,
              recipeCalories: result.nutrition.nutrients[0].amount,
              recipeImgUrl: result.image,
              recipeInstructions: result.analyzedInstructions[0].steps,
              recipeIngredients: result.extendedIngredients,
            };
            recipes.push(recipe);
          }
        } catch (e) {
          console.log("Unable to parse recipe for: ", result);
          console.log("Error: " + e);
        }
      }
      return recipes;
    });
};

function handleOnSearchBarKeyPress(
  e,
  searchText,
  onSearchedRecipes,
  savedRecipes
) {
  if (e.key === "Enter") {
    console.log("Searching for " + searchText + "...");
    getRecipes(searchText, savedRecipes).then((searchedRecipes) => {
      console.log("Found: ", searchedRecipes);
      onSearchedRecipes(searchedRecipes);
    });
  }
}

const SearchBar = (props) => {
  const [searchText, onSearchBarTextChange] = useState("");

  return (
    <input
      className="w-full h-12 my-8 px-4 focus:outline-none rounded"
      placeholder="what's cooking..."
      onKeyPress={(e) =>
        handleOnSearchBarKeyPress(
          e,
          searchText,
          props.onSearchedRecipes,
          props.savedRecipes
        )
      }
      onChange={(e) => onSearchBarTextChange(e.target.value)}
    />
  );
};

function handleRecipeSaved(recipeObj, savedRecipes, saveRecipe) {
  if (recipeObj.recipeSaved) {
    recipeObj.recipeSaved = false;
    saveRecipe(
      savedRecipes.filter(
        (savedRecipe) =>
          savedRecipe.recipeName !== recipeObj.recipeName &&
          savedRecipe.recipeId !== recipeObj.recipeId
      )
    );
    console.log("Unsaved " + recipeObj.recipeName);
    return;
  }

  recipeObj.recipeSaved = true;
  saveRecipe([...savedRecipes, recipeObj]);
  console.log("Saved " + recipeObj.recipeName);
}

const Recipe = (props) => {
  const [viewingDetails, setViewingDetails] = useState(false);

  if (viewingDetails) {
    return (
      <RecipeDetails
        onReturnToOverview={() => setViewingDetails(!viewingDetails)}
        ingredients={props.recipeObj.recipeIngredients}
        instructions={props.recipeObj.recipeInstructions}
      />
    );
  }

  return (
    <div className="box-border w-full grid grid-cols-3 justify-items-center items-center bg-gray-200 mb-6 py-8 px-4 rounded-md">
      <img
        className="col-start-1 col-end-3 w-3/4"
        src={props.recipeObj.recipeImgUrl}
        alt="Recipe"
      />
      <div className="h-full flex flex-col justify-evenly items-center font-light">
        <h2 className="font-extrabold text-xl">{props.recipeObj.recipeName}</h2>
        <RecipeOverview
          recipePreparationTime={props.recipeObj.recipePreparationTime}
          recipeCostPerServing={props.recipeObj.recipeCostPerServing}
          recipeCalories={props.recipeObj.recipeCalories}
        />
        <p
          onClick={() => setViewingDetails(!viewingDetails)}
          className="font-medium"
        >
          Details
        </p>
        <i
          className={
            (props.recipeObj.recipeSaved ? "fas" : "far") +
            " fa-heart fa-2x recipeHeartIcon" +
            ""
          }
          onClick={() =>
            handleRecipeSaved(
              props.recipeObj,
              props.savedRecipes,
              props.saveRecipe
            )
          }
        ></i>
      </div>
    </div>
  );
};

const RecipeOverview = (props) => {
  return (
    <div className="h-3/5 flex flex-col justify-evenly items-center">
      <h4 className="font-medium">Preparation Time: </h4>
      <p>{props.recipePreparationTime} minutes</p>
      <h4 className="font-medium">Cost Per Serving: </h4>
      <p>${props.recipeCostPerServing}</p>
      <h4 className="font-medium">Calories Per Serving: </h4>
      <p>{props.recipeCalories} calories</p>
    </div>
  );
};

const RecipeDetails = (props) => {
  return (
    <div className="box-border flex flex-col items-center font-light bg-gray-200 mb-6 py-8 px-12 rounded-md">
      <div className="grid grid-cols-2 gap-x-8">
        <div className="col-start-1">
          <h2 className="font-bold text-lg mb-4">Ingredients</h2>
          <ul className="list-disc">
            {props.ingredients.map((ingredient, idx) => (
              <li key={idx} className="mb-2">
                {ingredient.original}
              </li>
            ))}
          </ul>
        </div>
        <div className="col-start-2">
          <h2 className="font-bold text-lg mb-4">Instructions</h2>
          <ol className="list-decimal">
            {props.instructions.map((instructions, idx) => (
              <li key={idx} className="mb-2">
                {instructions.step}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <p className="font-medium" onClick={props.onReturnToOverview}>
        Go back to overview
      </p>
    </div>
  );
};

function App() {
  const [recipes, onSearchedRecipes] = useState([]);
  const [currentPage, onPageSelected] = useState("searchRecipes");
  const [savedRecipes, onRecipeSaved] = useState([]);

  switch (currentPage) {
    case "searchRecipes":
      return (
        <div>
          <NavBar changePage={onPageSelected} />

          <div className="flex flex-col items-center mx-56">
            <SearchBar
              onSearchedRecipes={onSearchedRecipes}
              savedRecipes={savedRecipes}
            />
            {recipes.map((recipe, idx) => (
              <Recipe
                recipeObj={recipe}
                key={recipe.recipeId}
                saveRecipe={onRecipeSaved}
                savedRecipes={savedRecipes}
              />
            ))}
          </div>
        </div>
      );
    case "savedRecipes":
      return (
        <div>
          <NavBar changePage={onPageSelected} />
          <div className="flex flex-col items-center mx-56 mt-12">
            {savedRecipes.map((savedRecipe, idx) => (
              <Recipe
                recipeObj={savedRecipe}
                key={savedRecipe.recipeId}
                saveRecipe={onRecipeSaved}
                savedRecipes={savedRecipes}
              />
            ))}
          </div>
        </div>
      );
    default:
      console.log("Loaded null page");
      break;
  }
}

export default App;
