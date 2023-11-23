import { search } from "./utils/search.js";
import { recipeTemplate } from "./template/recipe.js";


async function initPage() {
  const searchBar = document.querySelector('[name="searchbar"]');
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();
  let allRecipeObject = await search("")
    .then((res) => res)
    .catch((err) => console.log(err));
  let allRecipe = Object.values(allRecipeObject);
  updateRecipeCounter(allRecipe.length);
  allRecipe.forEach((recipe) => recipeWp.append(recipeTemplate(recipe)));
  searchBar.addEventListener('input', handleSearchBar);
}
async function handleSearchBar(e) {
  let userSearch = e.target.value;
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();
  if (userSearch.length > 2) {
    let allRecipeObject = await search(userSearch)
    .then((res) => res)
    .catch((err) => console.log(err));
    let allRecipe = Object.values(allRecipeObject);
    updateRecipeCounter(allRecipe.length);
    allRecipe.forEach((recipe) => recipeWp.append(recipeTemplate(recipe)));
  } else {

  }
}
function updateRecipeCounter(counter) {
  let recipeCounter = document.querySelector("#nb-recipe");
  recipeCounter.innerHTML = `${counter} Recette(s)`;
}

initPage();