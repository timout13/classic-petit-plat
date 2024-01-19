export function formatRecipes(unformattedRecette) {
  /* FORMAT DATA */
  let formattedRecette = unformattedRecette.map((recette) => {
    let ingredients = recette.ingredients.reduce((acc, current) => {
      return (acc == "" ? acc : acc + ",") + current.ingredient.toLowerCase();
    }, "");
    recette.formattedIngredients = ingredients;
    let ustensils = recette.ustensils.map((ustensil) => ustensil.toLowerCase());
    recette.formattedUstensils = ustensils;
    return recette;
  });
  return formattedRecette;
}
export function search(formattedRecette, userSearch) {
  /* FILTER DATA */
  let filteredRecette = formattedRecette.filter((recette) => {
    console.log(recette.name , userSearch);
    return (
      recette.name.includes(userSearch) ||
      recette.description.includes(userSearch) ||
      recette.formattedIngredients.includes(userSearch)
    );
  });

  return filteredRecette;
}

export function advancedFilter(formattedRecette, tagValue) {
  let filteredRecette = formattedRecette.filter((recette) => {
    console.log(recette.appliance,tagValue);
    return (
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