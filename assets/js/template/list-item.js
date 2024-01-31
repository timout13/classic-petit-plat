/* Create the item li for the custom selects */
export function listItemTemplate(itemList, domList, tagValues) {
  let listItemTemplate = document.querySelector("#list-item");
  let node = listItemTemplate.content.cloneNode(true);

  const itemDom = node.querySelector(".select-option");
  itemDom.textContent = itemList;
  itemDom.setAttribute("data-value", itemList);
  itemDom.setAttribute("data-delete", true);
  domList.append(itemDom);
  
  if (tagValues.includes(itemList)) {
    let listItemTemplate = document.querySelector("#list-item");
    let node = listItemTemplate.content.cloneNode(true);
    itemDom.classList.add("bg-warning");
    let btn = node.querySelector(".btn-list-remove");
    itemDom.append(btn);
    
  }
}
// Injecte tag dans la function
// Si itemList == tag
// Ajoute une autre f() de créa item-sélectionné

export function listItemRemove( itemList) {
    let btn = document.querySelector(`[data-value="${itemList}"]`);

      btn.addEventListener('click', e => {
      let tagSpan = document.querySelector(`[data-tagValue="${itemList}"]`);
      let tag = tagSpan.parentElement;
      console.log(tag);
      tag.remove();
    }); 
}
