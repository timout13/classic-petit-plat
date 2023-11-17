import { ajaxRequest } from "../utils/ajaxRequest.js";

export async function search(userSearch) {
  /* GET DATA */
  let unformattedRecette = await ajaxRequest("GET", "/backEnd/data.json", null)
    .then((res) => res)
    .catch((err) => console.log(err));

  /* FORMAT DATA */
  let allRecette = unformattedRecette.map((recette) => {
    let ingredients = recette.ingredients.reduce((acc, current) => {
      //console.log(acc, current);
      return (acc == "" ? acc : acc + ",") + current.ingredient;
    }, "");
    recette.ingredients = ingredients;
    return recette;
  });

  /* FILTER DATA */
  let filteredRecette = allRecette.filter((recette) => {
    return (
      recette.name.includes(userSearch) ||
      recette.description.includes(userSearch) ||
      recette.ingredients.includes(userSearch)
    );
  });
  return filteredRecette;
}
