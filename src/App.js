import { useState } from "react";
import Keys from "./config.js";

const NavBar = (props) => {
  return (
    <nav className="navBar">
      <h1>My Cookbook</h1>
      <ul>
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
      className="searchBar"
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
    <div className="recipe">
      <img
        className="recipeImage"
        src={props.recipeObj.recipeImgUrl}
        alt="Recipe"
      />
      <h2 className="recipeName">{props.recipeObj.recipeName}</h2>
      <RecipeOverview
        recipePreparationTime={props.recipeObj.recipePreparationTime}
        recipeCostPerServing={props.recipeObj.recipeCostPerServing}
        recipeCalories={props.recipeObj.recipeCalories}
      />
      <p
        onClick={() => setViewingDetails(!viewingDetails)}
        className="recipeDetailsButton"
      >
        Details
      </p>
      <i
        className={
          (props.recipeObj.recipeSaved ? "fas" : "far") +
          " fa-heart fa-2x recipeHeartIcon"
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
  );
};

const RecipeOverview = (props) => {
  return (
    <div className="recipeOverview">
      <h4>Preparation Time: </h4>
      <p>{props.recipePreparationTime} minutes</p>
      <h4>Cost Per Serving: </h4>
      <p>${props.recipeCostPerServing}</p>
      <h4>Calories Per Serving: </h4>
      <p>{props.recipeCalories} calories</p>
    </div>
  );
};

const RecipeDetails = (props) => {
  return (
    <div className="recipeDetails">
      <p className="recipeReturnOverview" onClick={props.onReturnToOverview}>
        Go back to overview
      </p>
      <div className="recipeIngredients">
        <h2>Ingredients</h2>
        <ul>
          {props.ingredients.map((ingredient, idx) => (
            <li key={idx}>{ingredient.original}</li>
          ))}
        </ul>
      </div>
      <div className="recipeInstructions">
        <h2>Instructions</h2>
        <ol>
          {props.instructions.map((instructions, idx) => (
            <li key={idx}>{instructions.step}</li>
          ))}
        </ol>
      </div>
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
          <div className="searchContainer">
            <SearchBar
              onSearchedRecipes={onSearchedRecipes}
              savedRecipes={savedRecipes}
            />
          </div>
          {recipes.map((recipe, idx) => (
            <Recipe
              recipeObj={recipe}
              key={recipe.recipeId}
              saveRecipe={onRecipeSaved}
              savedRecipes={savedRecipes}
            />
          ))}
        </div>
      );
    case "savedRecipes":
      return (
        <div>
          <NavBar changePage={onPageSelected} />
          <div className="recipeContainer">
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
