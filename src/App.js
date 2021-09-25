// Temporary placeholder recipe
const placeholderRecipe = {
  recipeName: "Minced Beef",
  recipePreparationTime: 40,
  recipeCostPerServing: 7.99,
  recipeCalories: 700,
  recipeImgUrl:
    "https://www.safefood.net/getmedia/7cd50be3-8aca-40d0-b3d0-9520561f5a23/mince_1.jpg?w=2048&h=1152&ext=.jpg&width=1360&resizemode=force",
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

const SearchBar = () => {
  return <input className="searchBar" placeholder="what's cooking..." />;
};

const Recipe = (props) => {
  return (
    <div className="recipe">
      <img
        className="recipe image"
        src={props.recipeObj.recipeImgUrl}
        alt="Recipe"
      />
      <h2 className="recipe name">{props.recipeObj.recipeName}</h2>
      <div className="recipe overview">
        <h4>Preparation Time: </h4>
        <p>{props.recipeObj.recipePreparationTime} minutes</p>
        <h4>Cost Per Serving: </h4>
        <p>${props.recipeObj.recipeCostPerServing}</p>
        <h4>Calories Per Serving: </h4>
        <p>{props.recipeObj.recipeCalories} calories</p>
      </div>
      <div className="recipe details">
        <h3 className="recipe ingredients">Ingredients</h3>
        <h3 className="recipe instructions">Instructions</h3>
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
