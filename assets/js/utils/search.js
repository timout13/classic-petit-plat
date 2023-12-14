export function formatRecipe(unformattedRecette) {
  /* FORMAT DATA */
  let formattedRecette = unformattedRecette.map((recette) => {
    let ingredients = recette.ingredients.reduce((acc, current) => {
      //console.log(acc, current);
      return (acc == "" ? acc : acc + ",") + current.ingredient.toLowerCase();
    }, "");
    recette.formattedIngredients = ingredients;
    return recette;
  });
  return formattedRecette;
}
export function search(formattedRecette, userSearch) {
  /* FILTER DATA */
  let filteredRecette = formattedRecette.filter((recette) => {
    return (
      recette.name.includes(userSearch) ||
      recette.description.includes(userSearch) ||
      recette.formattedIngredients.includes(userSearch)
    );
  });

  return filteredRecette;
}

export function filter(formattedRecette, tagValue) {
  let filteredRecette = formattedRecette.filter((recette) => {
    return recette.formattedIngredients.includes(tagValue);
  });
  return filteredRecette;
}
