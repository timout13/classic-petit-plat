export function ajaxRequest(method, url, data = null) {
  return new Promise((resolve, reject) => {
    var xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onload = function () {
      if (xhr.status >= 200 && xhr.status < 300) {
        var responseData = JSON.parse(xhr.responseText);
        resolve(responseData);
      } else if (xhr.status === 404 || xhr.status === 500) {
        var responseData = JSON.parse(xhr.responseText);
        reject(responseData);
      } else {
        reject("Erreur lors de la requête: " + xhr.status);
      }
    };

    xhr.onerror = function () {
      reject("Erreur réseau");
    };

    if (method === "POST") {
      xhr.send(JSON.stringify(data));
    } else {
      xhr.send();
    }
  });
}
