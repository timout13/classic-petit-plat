import { search } from "./utils/search.js";
import { recipeTemplate } from "./template/recipe.js";

initPage();
async function initPage() {
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();
  let allRecipeObject = await search("poisson")
    .then((res) => res)
    .catch((err) => console.log(err));
  let allRecipe = Object.values(allRecipeObject);
  updateRecipeCounter(allRecipe.length);
  allRecipe.forEach((recipe) => recipeWp.append(recipeTemplate(recipe)));
}

function updateRecipeCounter(counter) {
  let recipeCounter = document.querySelector("#nb-recipe");
  recipeCounter.innerHTML = `${counter} Recette(s)`;
}
