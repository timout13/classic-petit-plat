export function listItemTemplate(ingredient, domList) {
  let listItemTemplate = document.querySelector("#list-item");
  let node = listItemTemplate.content.cloneNode(true);

  const itemDom = node.querySelector(".select-option");
  itemDom.textContent = ingredient;
  itemDom.setAttribute("data-value", ingredient);
  itemDom.setAttribute("data-delete", true);
  domList.append(itemDom);
}
