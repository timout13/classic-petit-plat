export function recipeTemplate(recipe) {
    const template = document.createElement("template");
    template.innerHTML = `
          <article class="rounded-[21px] relative bg-white h-article w-[380px]">
            <div class="h-[253px] rounded-t-[21px] bg-red-500">
              <img class="object-cover w-full h-full rounded-t-[21px]" src="./assets/img/recipe/${recipe.image}" alt="${recipe.name}">
            </div>
            <div class="pt-[32px] px-[25px]">
              <h2 class="font-main text-[18px]">${recipe.name}</h2>
              <h3 class="mt-[29px] text-[12px] font-body font-bold uppercase">Recette</h3>
              <p class="mt-[15px] text-[14px]">${recipe.description}</p>              
              <h3 class="mt-[32px] mb-[15px] text-[12px] font-body font-bold uppercase">Ingrédients</h3>
              <ul class="flex flex-wrap gap-y-[21px]">
                <li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">Lait de coco</p>
                  <p class="text-[14px] font-body text-grey">400ml</p>
                </li>
                <li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">Lait de coco</p>
                  <p class="text-[14px] font-body text-grey">400ml</p>
                </li>
                <li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">Lait de coco</p>
                  <p class="text-[14px] font-body text-grey">400ml</p>
                </li>
                <li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">Lait de coco</p>
                  <p class="text-[14px] font-body text-grey">400ml</p>
                </li>
                <li class="flex-[50%]">
                  <p class="text-[14px] font-body font-medium">Lait de coco</p>
                  <p class="text-[14px] font-body text-grey">400ml</p>
                </li>
                
              </ul>
            </div>
            <span class="absolute top-[22px] right-[22px] bg-warning py-[5px] px-[15px] rounded-[14px]">${recipe.time} min<span>
          </article>
          `;
          return template.content
}