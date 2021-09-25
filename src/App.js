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

function App() {
  return (
    <div>
      <NavBar />
      <div className="searchContainer">
        <SearchBar />
        <div className="recipeContainer"></div>
      </div>
    </div>
  );
}

export default App;
