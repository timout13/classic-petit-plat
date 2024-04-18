export function getSortedList(duplicatesList) {
     const list = duplicatesList.flat();
     /* deletes doublons */
     let unduplicatesList = [...new Set(list)];
     const sortedList = unduplicatesList.sort((a, b) =>
       a.localeCompare(b, "fr", { ignorePunctuation: true })
     );
    return sortedList;
}