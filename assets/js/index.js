import { search, filter, formatRecipe } from "./utils/search.js";
import { recipeTemplate } from "./template/recipe.js";
import { tagTemplate } from "./template/tag.js";
import { listItemTemplate } from "./template/list-item.js";
import { ajaxRequest } from "./utils/ajaxRequest.js";

async function initPage() {
  /* GET DATA */
  let unformattedRecette = await ajaxRequest("GET", "/backEnd/data.json", null)
    .then((res) => res)
    .catch((err) => console.log(err));
  const searchBar = document.querySelector('[name="searchbar"]');
  appendToSelects(unformattedRecette);
  const allSelectOptions = document.querySelectorAll(".select-option");
  const allSelect = document.querySelectorAll(".custom-select-action");
  buildRecipeWpChild(unformattedRecette);
  searchBar.addEventListener("input", (e) =>
    handleSearchBar(e, unformattedRecette)
  );
  allSelect.forEach((select) => {
    select.addEventListener("click", handleCustomSelect);
  });
  allSelectOptions.forEach((selectOption) => {
    selectOption.addEventListener("click", (e) =>
      handleSelectFilter(e, unformattedRecette)
    );
  });
}
async function handleSearchBar(e, unformattedRecette) {
  let userSearch = e.target.value;
  if (userSearch.length > 2) {
    e.target.setAttribute("data-userSearch", userSearch);
    buildRecipeWpChild(unformattedRecette);
  } else {
  }
}
/* Filter data & build recipe card */
async function buildRecipeWpChild(unformattedRecette) {
  let formattedRecipe = formatRecipe(unformattedRecette);
  // Mettre dans une var data-userSearch
  const searchBar = document.querySelector('[name="searchbar"]');
  let userSearch = searchBar.getAttribute("data-userSearch");
  // Récupère valeurs des tags pour filtrer
  const tagValues = Array.from(
    document.querySelectorAll("[data-tagValue]")
  ).map((element) => element.getAttribute("data-tagValue"));
  tagValues && console.log(tagValues);

  /* Initialize the card section */
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();

  //Mettre condition pour chaque filtrage pour les rendre optionnels
  if (userSearch != "") {
    formattedRecipe = search(formattedRecipe, userSearch);
  }
  // foreach() Tags => filter()
  if (tagValues.length > 0) {
    tagValues.forEach(
      (tagValue) => (formattedRecipe = filter(formattedRecipe, tagValue))
    );
    //formattedRecipe = filter(formattedRecipe);
  }
  let allRecipe = Object.values(formattedRecipe);
  updateRecipeCounter(allRecipe.length);
  allRecipe.forEach((recipe) => recipeWp.append(recipeTemplate(recipe)));
}

function updateRecipeCounter(counter) {
  let recipeCounter = document.querySelector("#nb-recipe");
  recipeCounter.innerHTML = `${counter} Recette(s)`;
}

function handleCustomSelect(e) {
  const dropdown = document.querySelector(".custom-select-search");
  const selectAction = e.currentTarget;
  if (dropdown.classList.contains("hidden")) {
    selectAction.parentNode.classList.add("custom-select--reverse");
    dropdown.classList.remove("hidden");
  } else {
    selectAction.parentNode.classList.remove("custom-select--reverse");
    dropdown.classList.add("hidden");
  }
}
function handleSelectFilter(e, unformattedRecette) {
  let filterValue = e.target.getAttribute("data-value");
  let tag = document.querySelector(`[data-tagValue="${filterValue}"]`);
  
  // crée un tag pour la valeur sélectionnée
  tag || tagTemplate(filterValue);
  tag || buildRecipeWpChild(unformattedRecette);
  tag = document.querySelector(`[data-tagValue="${filterValue}"]`).parentNode;
  const tagBtnClose = tag.querySelector('.btn-close');
  console.log(tagBtnClose);
  tagBtnClose.addEventListener("click", (e) => {
    tag.remove();
    buildRecipeWpChild(unformattedRecette);
  });
;
}
function getIngredient(unformattedRecette) {
  const allIngredients = unformattedRecette.map((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase())
  );
  const ingredientsList = allIngredients.flat();

  /* Supprime les doublons */
  let uniqueIngredient = [...new Set(ingredientsList)];
const sortedIngredientsList = uniqueIngredient.sort((a, b) =>
  a.localeCompare(b, "fr", { ignorePunctuation: true })
);

return sortedIngredientsList;
}
function appendToSelects(unformattedRecette) {
  const ingredients = getIngredient(unformattedRecette);
  const ingredientsDomList = document.querySelector(
    ".custom-select--ingredient .custom-select-search ul"
  );
  ingredients.forEach(ingredient => {
    listItemTemplate(ingredient, ingredientsDomList);
    })
  
}
initPage();
