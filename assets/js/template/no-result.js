export function noResultText(userSearch) {
    const template_noresult = document.querySelector("#template_noresult");
    let node = template_noresult.content.cloneNode(true);
    const no_result_text = node.querySelector(".no_result_text");
    no_result_text.textContent = `Aucune recette ne contient ‘${userSearch}’ vous pouvez chercher « tarte aux pommes », « poisson », etc.`;
    return no_result_text;
}