export function recipeTemplate(recipe) {
  function appendIngredient(ingredient) {
    return `<li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">${
                    ingredient.ingredient
                  }</p>
                  <p class="text-[14px] font-body text-grey">
                    ${ingredient.quantity}  
                    ${ingredient.unit !== undefined ? `${ingredient.unit}` : ""}
                  </p>
              </li>`;
  }
  const template = document.createElement("template");
  template.innerHTML = `
          <article id="recipe-${
            recipe.id
          }" class="rounded-[21px] flex flex-col relative bg-white  w-[380px]">
            <div class="h-[253px] rounded-t-[21px] bg-red-500">
              <img class="object-cover w-full h-full rounded-t-[21px]" src="./assets/img/recipe/${
                recipe.image
              }" alt="${recipe.name}">
            </div>
            <div class="pt-[32px] flex flex-1 flex-col pb-[61px] px-[25px]">
              <h2 class="font-main text-[18px]">${recipe.name}</h2>
              <h3 class="mt-[29px] text-[12px] font-body font-bold uppercase">Recette</h3>
              <p class="mt-[15px] text-[14px]">${
                recipe.description
              }</p>              
              <h3 class="mt-[32px] mt-auto mb-[15px] text-[12px] font-body font-bold uppercase">Ingrédients</h3>
              <ul class="flex flex-wrap gap-y-[21px]">
              ${recipe.ingredients
                .map((ingredient) => appendIngredient(ingredient))
                .join("")}
              </ul>
            </div>
            <span class="absolute top-[22px] right-[22px] bg-warning py-[5px] px-[15px] rounded-[14px]">${
              recipe.time
            } min<span>
          </article>
          `;
  return template.content;
}
