export function formatRecipes(unformattedRecipes) {
  let formattedRecipes = [];
  for (let recipe of unformattedRecipes) {
    let ingredients = "";
    let ustensils = [];
    for (const recipeIngredient of recipe.ingredients) {
      ingredients +=
        ingredients === ""
          ? recipeIngredient.ingredient.toLowerCase()
          : ", " + recipeIngredient.ingredient.toLowerCase();
    }
    for (const recipeUstensil of recipe.ustensils) {
      ustensils +=
        ustensils === ""
          ? recipeUstensil.toLowerCase()
          : ", " + recipeUstensil.toLowerCase();
    }
    recipe.formattedIngredients = ingredients;
    recipe.formattedUstensils = ustensils;
    formattedRecipes.push(recipe);
  }
  return formattedRecipes;
}
export function search(allRecipes, userSearch) {
  /* FILTER DATA */
  let filteredRecipes = [];
  userSearch = userSearch.toLowerCase();
  console.log(allRecipes);
  for (let i = 0; i < allRecipes.length; i++) {
    if (allRecipes[i].name.toLowerCase().indexOf(userSearch) !== -1) {
      filteredRecipes[allRecipes[i].id] = allRecipes[i];
    }
    if (!filteredRecipes[allRecipes[i].id]) {
      if (allRecipes[i].description.toLowerCase().indexOf(userSearch) !== -1) {
        filteredRecipes[allRecipes[i].id] = allRecipes[i];
      }
      if (!filteredRecipes[allRecipes[i].id]) {
        for (const ingredient of allRecipes[i].ingredients) {
          if (ingredient.ingredient.toLowerCase().indexOf(userSearch) !== -1) {
            filteredRecipes[allRecipes[i].id] = allRecipes[i];
          }
        }
      }
    }
  }
  return filteredRecipes;
}

export function advancedFilter(formattedRecette, tagValue) {
  let filteredRecette = formattedRecette.filter((recette) => {
    return (
      recette.name.toLowerCase().includes(tagValue) ||
      recette.formattedIngredients.includes(tagValue) ||
      recette.formattedUstensils.includes(tagValue) ||
      recette.appliance.toLowerCase().includes(tagValue)
    );
  });
  return filteredRecette;
}

export function searchInFilters(list, userSearch) {
  /* FILTER DATA */
  list = list.filter((item) => item.includes(userSearch));
  return list;
}
