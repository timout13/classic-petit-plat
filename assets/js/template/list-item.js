/* Create the item li for the custom selects */
export function listItemTemplate(
  itemList,
  domList,
  tagValues,
  buildRecipesAndSelectLists
) {
  let listItemTemplate = document.querySelector("#list-item");
  let node = listItemTemplate.content.cloneNode(true);

  const itemDom = node.querySelector(".select-option");
  itemDom.textContent = itemList;
  itemDom.setAttribute("data-value", itemList);
  itemDom.setAttribute("data-delete", true);
  domList.append(itemDom);
  /* Add the btn in the item to remove the tag */
  if (tagValues.includes(itemList)) {
    let listItemTemplate = document.querySelector("#list-item");
    let node = listItemTemplate.content.cloneNode(true);
    itemDom.classList.add("bg-warning");
    let btn = node.querySelector(".btn-list-remove");
    itemDom.append(btn);
    btn &&
      btn.addEventListener(
        "click",
        (e) => {
          e.stopPropagation();
          let tagSpan = document.querySelector(`[data-tagvalue="${itemList}"]`);
          let tag = tagSpan.parentNode;
          tag.remove();
          buildRecipesAndSelectLists();
          return false;
        },
        false
      );
  }
}
