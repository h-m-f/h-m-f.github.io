var importScript = function(soa, f, sza, bzf) {
  sza = sza != undefined ? sza : ".js";
  if (importScript.gotten.indexOf(soa) == -1) {
    var script = document.createElement("script");
    if (soa[0] == "/") {
      script.src = "https://" + (/^\/[0-9A-Za-z-.]+/).exec(soa)[0].split("").slice(1).join("").split(".").reverse().join(".") + (/^[0-9A-Za-z-./]+?(?=[0-9A-Za-z-.]+\/$)/).exec(soa.split("").reverse().join(""))[0].split("").reverse().join("") + sza;
    } else if (soa[0] == "~") {
      script.src = "/" + soa.substr(1) + sza;
    } else if (soa[0] == "!") {
      script.src = importScript(soa.substr(1), f, "", true).src;
    } else {
      script.src = "/js/" + soa + sza;
    }
    script.onload = f;
    return bzf ? script : document.head.appendChild(script), script;
  }
};

importScript.gotten = [];

var importJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
      }
    };
    xhr.send();
  });
};
