import {
  search,
  advancedFilter,
  formatRecipes,
  searchInFilters,
} from "./utils/search.js";
import { recipeTemplate } from "./template/recipe.js";
import { noResultText } from "./template/no-result.js";
import { tagTemplate } from "./template/tag.js";
import { listItemTemplate, listItemRemove } from "./template/list-item.js";
import { ajaxRequest } from "./utils/ajaxRequest.js";
import { getSortedList } from "./utils/getSortedList.js";

async function initPage() {
  /* GET DATA */
  let unformattedRecipes = await ajaxRequest("GET", "backEnd/data.json", null)
    .then((res) => res)
    .catch((err) => console.log(err));
  const searchBar = document.querySelector('[name="searchbar"]');
  /* Init Custom Select */
  replaceSelectList(
    { keyname: "ingredient", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  replaceSelectList(
    { keyname: "ustensil", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  replaceSelectList(
    { keyname: "appliance", unformattedRecipes: unformattedRecipes },
    "",
    true
  );
  
  filterSearchBar(unformattedRecipes);

  const allSelect = document.querySelectorAll(".custom-select-action");
  buildRecipeWpChild(unformattedRecipes);
  let prevSearchbarVal = "";
  searchBar.addEventListener(
    "input",
    (e) =>
      (prevSearchbarVal = handleSearchBar(
        e,
        unformattedRecipes,
        prevSearchbarVal
      ))
  );
  allSelect.forEach((select) => {
    select.addEventListener("click", handleCustomSelect);
  });
  selectAddEventToItem(unformattedRecipes);
  
  /* Creates tag from the main searchbar */
  btn_mainSearchBar.addEventListener("click", (e) => {
    let tagValue = searchbar.value;
    let tag = document.querySelector(`[data-tagValue="${tagValue}"`);
    tag || tagTemplate(tagValue);
    tag = document.querySelector(`[data-tagValue="${tagValue}"]`).parentNode;
    searchbar.value = "";
    searchbar.setAttribute("data-userSearch", "");
    const tagBtnClose = tag.querySelector(".btn-close");
    tagBtnClose.addEventListener("click", (e) => {
      tag.remove();
      buildRecipeWpChild(unformattedRecipes);
    });
  });
  removeSbarContent(unformattedRecipes);
  displayRmvBtnSbar();
}

/* launch the search by taking into account the search length */
function handleSearchBar(e, unformattedRecipes, prevSearchbarVal) {
  let userSearch = e.target.value;
  if (userSearch.length < prevSearchbarVal.length) {
    btn_mainSearchBar.disabled = true;
    btn_mainSearchBar.setAttribute("data-value", "");
    e.target.setAttribute("data-userSearch", userSearch);
    buildRecipeWpChild(unformattedRecipes);
  } else {
    if (userSearch.length > 2) {
      btn_mainSearchBar.disabled = false;
      btn_mainSearchBar.setAttribute("data-value", userSearch);
      e.target.setAttribute("data-userSearch", userSearch);
      buildRecipeWpChild(unformattedRecipes);
    }
  }
  return (prevSearchbarVal = userSearch);
}

/* Filter data & build recipe card & select lists */
function buildRecipeWpChild(unformattedRecipes) {
  let { formattedRecipes, userSearchBar, tagValues } =
    getVarsToFilter(unformattedRecipes);

  let filteredRecipes = filter(formattedRecipes, userSearchBar, tagValues);

  /* Initialize the card section */
  let recipeWp = document.querySelector(".recipeWp");
  recipeWp.replaceChildren();
  if (filteredRecipes.length > 0) {
    replaceSelectList({
      keyname: "ingredient",
      unformattedRecipes: unformattedRecipes,
    });
    replaceSelectList({
      keyname: "ustensil",
      unformattedRecipes: unformattedRecipes,
    });
    replaceSelectList({
      keyname: "appliance",
      unformattedRecipes: unformattedRecipes,
    });
    updateRecipeCounter(filteredRecipes.length);
    filteredRecipes.forEach((recipe) =>
      recipeWp.append(recipeTemplate(recipe))
    );
  } else {
    recipeWp.append(noResultText(userSearchBar));
    updateRecipeCounter(0);
  }
}

/* Get all the mandatory variables to apply filter() */
function getVarsToFilter(unformattedRecipes) {
  let formattedRecipes = formatRecipes(unformattedRecipes);
  const searchBar = document.querySelector('[name="searchbar"]');
  let userSearchBar = searchBar.getAttribute("data-userSearch");
  const tagValues = Array.from(
    document.querySelectorAll("[data-tagValue]")
  ).map((element) => element.getAttribute("data-tagValue"));
  return { formattedRecipes, userSearchBar, tagValues };
}

/* Return all the recipes filtered by the  user search and the tag values */
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

/* Open/Close the selects */
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

/* Create a new tag & reload the search with new tag */
function handleSelectFilter(e, unformattedRecipes) {
  // get the value of the new tag
  let filterValue = e.target.getAttribute("data-value");
  // verify if tag exists, create one if not
  let tag = document.querySelector(`[data-tagValue="${filterValue}"]`);
  tag || tagTemplate(filterValue);
  // reload search with the new tag
  tag || buildRecipeWpChild(unformattedRecipes);
  // apply an listener on btn to remove the tag
  tag = document.querySelector(`[data-tagValue="${filterValue}"]`).parentNode;
  const tagBtnClose = tag.querySelector(".btn-close");
  tagBtnClose.addEventListener("click", (e) => {
    tag.remove();
    buildRecipeWpChild(unformattedRecipes);
  });
}

/* Functions to get filtered list for custom selects */
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

/* Function -- replaceSelectList() :
  Filter list by userSearch / 
  Remove old list /
  Create new items /
  Append its & apply listeners
*/
function replaceSelectList(
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
    listItemTemplate(itemList, domList, tagValues);
    listItemRemove(itemList);
  });
  // Apply listeners
  selectAddEventToItem(unformattedRecipes);
}

/* 
  Init select searchbars
  Get searbar's values & apply replaceSelectList()
 */
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
      replaceSelectList(filterObject, advancedUserSearch);
    });
  });
}

/* 
  Remove the content of the searchbars
  Reload the search by default
 */
function removeSbarContent(unformattedRecipes) {
  const btnSearbars = document.querySelectorAll(".btn-input-remove");
  btnSearbars.forEach((btnSearbar) => {
    btnSearbar.addEventListener("click", (e) => {
      const target = btnSearbar.getAttribute("data-target");
      const searchbar = document.querySelector(`.input-${target}`);
      searchbar.value = "";
      searchbar.setAttribute("data-userSearch", "");
      buildRecipeWpChild(unformattedRecipes);
      btnSearbar.style.display = "none";
    });
  });
}

/* 
  Handle the display of the remove btn of searchbars
 */
function displayRmvBtnSbar() {
  const allSbars = document.querySelectorAll(".input");
  allSbars.forEach((searchbar) => {
    let btnRmv = searchbar.nextElementSibling;
    searchbar.addEventListener("focusin", (e) => {
      btnRmv.style.display = "block";
    });
    searchbar.addEventListener("focusout", (e) => {
      if (searchbar.value.length == 0) {
        btnRmv.style.display = "none";
      }
    });
  });
}

initPage();
