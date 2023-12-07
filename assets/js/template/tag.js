export function tagTemplate(tagValue) {
    let tagTemplate = document.querySelector('#tag');
    let node = tagTemplate.content.cloneNode(true);
    const tag = node.querySelector('.tag');
    const tagNameEl = node.querySelector('.tagValue');
    const tagBtnClose = node.querySelector('.btn-close');
    const tagWp = document.querySelector('.tagWp');
    
    tagNameEl.textContent = tagValue;
    tagNameEl.setAttribute('data-tagValue',tagValue);
    tagBtnClose.addEventListener('click', e => tag.remove());
    tagWp.append(tag);
}
