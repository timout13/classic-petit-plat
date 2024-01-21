import {
  search,
  advancedFilter,
  formatRecipes,
  searchInFilters,
} from "./utils/search.js";
import { recipeTemplate } from "./template/recipe.js";
import { noResultText } from "./template/no-result.js";
import { tagTemplate } from "./template/tag.js";
import { listItemTemplate } from "./template/list-item.js";
import { ajaxRequest } from "./utils/ajaxRequest.js";
import { getSortedList } from "./utils/getSortedList.js";

async function initPage() {
  /* GET DATA */
  let unformattedRecipes = await ajaxRequest("GET", "/backEnd/data.json", null)
    .then((res) => res)
    .catch((err) => console.log(err));
  const searchBar = document.querySelector('[name="searchbar"]');
  appendToSelects(
    { keyname: "ingredient", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  appendToSelects(
    { keyname: "ustensil", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  appendToSelects(
    { keyname: "appliance", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  filterSearchBar(unformattedRecipes);

  const allSelect = document.querySelectorAll(".custom-select-action");
  buildRecipeWpChild(unformattedRecipes);
  searchBar.addEventListener("input", (e) =>
    handleSearchBar(e, unformattedRecipes)
  );
  allSelect.forEach((select) => {
    select.addEventListener("click", handleCustomSelect);
  });
  selectAddEventToItem(unformattedRecipes);
  btn_mainSearchBar.addEventListener("click", (e) => {
    let tagValue = searchbar.value;
    let tag = document.querySelector(`[data-tagValue="${tagValue}"`);
    tag || tagTemplate(tagValue);
    tag = document.querySelector(`[data-tagValue="${tagValue}"]`).parentNode;
    searchbar.value = "";
    searchbar.setAttribute('data-userSearch', "");
    const tagBtnClose = tag.querySelector(".btn-close");
    tagBtnClose.addEventListener("click", (e) => {
      tag.remove();
      buildRecipeWpChild(unformattedRecipes);
    });
  });
}
function handleSearchBar(e, unformattedRecipes) {
  let userSearch = e.target.value;
  if (userSearch.length > 2) {
    btn_mainSearchBar.disabled = false;
    btn_mainSearchBar.setAttribute("data-value", userSearch);
    e.target.setAttribute("data-userSearch", userSearch);
    buildRecipeWpChild(unformattedRecipes);
  } else {
    btn_mainSearchBar.disabled = true;
    btn_mainSearchBar.setAttribute("data-value", "");
  }
}
/* Filter data & build recipe card */
function buildRecipeWpChild(unformattedRecipes) {
  let { formattedRecipes, userSearchBar, tagValues } =
    getVarsToFilter(unformattedRecipes);

  let filteredRecipes = filter(formattedRecipes, userSearchBar, tagValues);

  /* Initialize the card section */
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();
  if (filteredRecipes.length > 0) {
    appendToSelects({
      keyname: "ingredient",
      unformattedRecipes: unformattedRecipes,
    });
    appendToSelects({
      keyname: "ustensil",
      unformattedRecipes: unformattedRecipes,
    });
    appendToSelects({
      keyname: "appliance",
      unformattedRecipes: unformattedRecipes,
    });
    updateRecipeCounter(filteredRecipes.length);
    filteredRecipes.forEach((recipe) => recipeWp.append(recipeTemplate(recipe)));
  } else {
    recipeWp.append(noResultText(userSearchBar));
    updateRecipeCounter(0);
  }
}
function getVarsToFilter(unformattedRecipes) {
  let formattedRecipes = formatRecipes(unformattedRecipes);
  // Mettre dans une var data-userSearch
  const searchBar = document.querySelector('[name="searchbar"]');
  let userSearchBar = searchBar.getAttribute("data-userSearch");
  // Récupère valeurs des tags pour filtrer
  const tagValues = Array.from(
    document.querySelectorAll("[data-tagValue]")
  ).map((element) => element.getAttribute("data-tagValue"));
  return { formattedRecipes, userSearchBar, tagValues };
}
function filter(recipes, userSearch = "", tagValues = []) {
  if (userSearch != "") {
    recipes = search(recipes, userSearch);
  }
  // foreach() Tags => filter()
  if (tagValues.length > 0) {
    tagValues.forEach(
      (tagValue) => (recipes = advancedFilter(recipes, tagValue))
    );
  }
  // Ajouter la userSearch à la searchBar du select concerné ?
  return Object.values(recipes);
}

function updateRecipeCounter(counter) {
  let recipeCounter = document.querySelector("#nb-recipe");
  recipeCounter.innerHTML = `${counter} Recette(s)`;
}
/* Apply listeners to all select item */
function selectAddEventToItem(unformattedRecipes) {
  const allSelectOptions = document.querySelectorAll(".select-option");
  allSelectOptions.forEach((selectOption) => {
    selectOption.addEventListener("click", (e) =>
      handleSelectFilter(e, unformattedRecipes)
    );
  });
}
function handleCustomSelect(e) {
  const selectAction = e.currentTarget;
  const dropdown = selectAction.nextElementSibling;
  if (dropdown.classList.contains("hidden")) {
    selectAction.parentNode.classList.add("custom-select--reverse");
    dropdown.classList.remove("hidden");
  } else {
    selectAction.parentNode.classList.remove("custom-select--reverse");
    dropdown.classList.add("hidden");
  }
}
function handleSelectFilter(e, unformattedRecipes) {
  let filterValue = e.target.getAttribute("data-value");
  let tag = document.querySelector(`[data-tagValue="${filterValue}"]`);
  // crée un tag pour la valeur sélectionnée
  tag || tagTemplate(filterValue);
  tag || buildRecipeWpChild(unformattedRecipes);
  tag = document.querySelector(`[data-tagValue="${filterValue}"]`).parentNode;
  const tagBtnClose = tag.querySelector(".btn-close");
  tagBtnClose.addEventListener("click", (e) => {
    tag.remove();
    buildRecipeWpChild(unformattedRecipes);
  });
}
function getIngredient(recipes) {
  const allIngredients = recipes.map((recipe) =>
    recipe.ingredients.map((ingredient) => ingredient.ingredient.toLowerCase())
  );
  const sortedIngredientsList = getSortedList(allIngredients);
  return sortedIngredientsList;
}
function getUstensils(recipes) {
  const allUstensils = recipes.map((recipe) =>
    recipe.ustensils.map((ustensil) => ustensil.toLowerCase())
  );
  const sortedUstensilsList = getSortedList(allUstensils);
  return sortedUstensilsList;
}
function getAppliances(recipes) {
  const allAppliances = recipes.map((recipe) => recipe.appliance.toLowerCase());
  const sortedAppliancesList = getSortedList(allAppliances);
  return sortedAppliancesList;
}
/* Function -- appendToSelects() :
  Filter list by userSearch / 
  Remove old list /
  Create new items /
  Append its & apply listeners
*/
function appendToSelects(
  { keyname, unformattedRecipes },
  advancedUserSearch,
  init = false
) {
  //Filter by userSearch

  let domList = null;
  let filterList = [];

  let { formattedRecipes, userSearchBar, tagValues } =
    getVarsToFilter(unformattedRecipes);

  let filteredRecipes = filter(formattedRecipes, userSearchBar, tagValues);

  if (keyname?.includes("ingredient")) {
    filterList = getIngredient(filteredRecipes);
    domList = document.querySelector(
      ".custom-select--ingredient .custom-select-search ul"
    );
  } else if (keyname?.includes("ustensil")) {
    filterList = getUstensils(filteredRecipes);
    domList = document.querySelector(
      ".custom-select--ustensil .custom-select-search ul"
    );
  } else if (keyname?.includes("appliance")) {
    filterList = getAppliances(filteredRecipes);
    domList = document.querySelector(
      ".custom-select--appliance .custom-select-search ul"
    );
  }

filterList = advancedUserSearch
? searchInFilters(filterList, advancedUserSearch)
: searchInFilters(filterList, "");
  //Remove old list
  let allChilds = domList.querySelectorAll("[data-delete]"); //Selectionner les enfants du select concerné uniquement
  if (!init) {
    allChilds.length > 0 &&
      allChilds.forEach((child) => {
        child.remove();
      });
  }
  // Create new items
  filterList.forEach((itemList) => {
    listItemTemplate(itemList, domList);
  });
  // Apply listeners
  selectAddEventToItem(unformattedRecipes);
}
function filterSearchBar(unformattedRecipes) {
  const allFilterSearchBar = document.querySelectorAll(".filter-searchbar");
  allFilterSearchBar.forEach((filterSearchBar) => {
    filterSearchBar.addEventListener("input", (e) => {
      const advancedUserSearch = e.currentTarget.value
        ? e.currentTarget.value
        : "";
      let filterObject = {
        keyname: filterSearchBar.name,
        unformattedRecipes: unformattedRecipes,
      };
      appendToSelects(filterObject, advancedUserSearch);
    });
  });
}

initPage();

// Filtrer dans recherche principale 'tomate'

// Est-ce qu'il faut faire une liste de tous les ingrédients dont la recette comporte aussi l'ingrédient 'tomate'

// Au clique de la serachbar du select quel réaction ?

// Prendre toutes les recettes et filtrer par 'tomate'
// Envoyer les recettes dans les selects
// Prends les ingrédients, etc, de chaque recette et faire la liste
// Afficher la liste