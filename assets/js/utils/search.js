import { ajaxRequest } from "../utils/ajaxRequest.js";

export async function search(userSearch) {
  /* GET DATA */
  let unformattedRecette = await ajaxRequest("GET", "/backEnd/data.json", null)
    .then((res) => res)
    .catch((err) => console.log(err));

  /* FORMAT DATA */
  let formattedRecette = unformattedRecette.map((recette) => {
    let ingredients = recette.ingredients.reduce((acc, current) => {
      //console.log(acc, current);
      return (acc == "" ? acc : acc + ",") + current.ingredient;
    }, "");
    recette.formattedIngredients = ingredients;
    return recette;
  });

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
