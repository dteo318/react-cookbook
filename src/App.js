import { useState } from "react";

// Temporary placeholder recipe
const placeholderRecipe = {
  recipeName: "Minced Beef",
  recipePreparationTime: 40,
  recipeCostPerServing: 7.99,
  recipeCalories: 700,
  recipeImgUrl:
    "https://www.safefood.net/getmedia/7cd50be3-8aca-40d0-b3d0-9520561f5a23/mince_1.jpg?w=2048&h=1152&ext=.jpg&width=1360&resizemode=force",
  recipeInstructions: [
    "Step 1",
    "Step 2",
    "Step 3",
    "Step 4",
    "Step 5",
    "Step 6",
    "Step 7",
    "Step 8",
    "Step 9",
    "Step 10",
  ],
  recipeIngredients: [
    "Ingredient 1",
    "Ingredient 2",
    "Ingredient 3",
    "Ingredient 4",
    "Ingredient 5",
    "Ingredient 6",
    "Ingredient 7",
    "Ingredient 8",
    "Ingredient 9",
    "Ingredient 10",
  ],
};

const NavBar = () => {
  return (
    <nav className="navBar">
      <h1>My Cookbook</h1>
      <ul>
        <li>Find Recipes</li>
        <li>Saved Recipes</li>
        <li>Costs & Calories</li>
      </ul>
    </nav>
  );
};

const handleOnSearchBarKeyPress = (e, searchText) => {
  if (e.key === "Enter") {
    console.log(searchText);
  }
};

const SearchBar = () => {
  const [searchText, onSearchBarTextChange] = useState("");

  return (
    <input
      className="searchBar"
      placeholder="what's cooking..."
      onKeyPress={(e) => handleOnSearchBarKeyPress(e, searchText)}
      onChange={(e) => onSearchBarTextChange(e.target.value)}
    />
  );
};

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
        className="recipe image"
        src={props.recipeObj.recipeImgUrl}
        alt="Recipe"
      />
      <h2 className="recipe name">{props.recipeObj.recipeName}</h2>
      <RecipeOverview
        recipePreparationTime={props.recipeObj.recipePreparationTime}
        recipeCostPerServing={props.recipeObj.recipeCostPerServing}
        recipeCalories={props.recipeObj.recipeCalories}
      />
      <h3
        onClick={() => setViewingDetails(!viewingDetails)}
        className="recipe details button"
      >
        Details
      </h3>
    </div>
  );
};

const RecipeOverview = (props) => {
  return (
    <div className="recipe overview">
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
    <div className="recipe details">
      <p className="recipe returnOverview" onClick={props.onReturnToOverview}>
        Go back to overview
      </p>
      <div className="recipe ingredients">
        <h2>Ingredients</h2>
        <ul>
          {props.ingredients.map((ingredient, idx) => (
            <li>{ingredient}</li>
          ))}
        </ul>
      </div>
      <div className="recipe instructions">
        <h2>Instructions</h2>
        <ol>
          {props.instructions.map((instructions, idx) => (
            <li>{instructions}</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

function App() {
  return (
    <div>
      <NavBar />
      <div className="searchContainer">
        <SearchBar />
      </div>
      <div className="recipeContainer">
        <Recipe recipeObj={placeholderRecipe} />
      </div>
    </div>
  );
}

export default App;
