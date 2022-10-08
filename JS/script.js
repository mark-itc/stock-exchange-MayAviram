let searchButton = document.getElementById("searchButton");
let searchInput = document.getElementById("searchInput");
let loader = document.getElementById("loader");

async function loadAPI(url) {
  try {
    let response = await fetch(url);
    let result = await response.json();
    return result;
  } catch (err) {
    console.log("err: ", err);
  }
}
// export { loadAPI };

async function searchCompany() {
  let inputText = searchInput.value;
  let url =
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
    inputText +
    "&limit=10&exchange=NASDAQ";
  let apiResult = await loadAPI(url);
  showSearchResult(apiResult);
}

function showSearchResult(apiResult) {
  let resultList = document.getElementById("resultList");
  let template = document.getElementById("template");
  resultList.innerHTML = "";
  apiResult.forEach((element) => {
    let cloneLinkTemplate = template.content.cloneNode(true);
    cloneLinkTemplate.querySelector("h7").innerHTML =
      element.name + " (" + element.symbol + ")";
    cloneLinkTemplate
      .querySelector("a")
      .setAttribute("href", "../HTML/company.html?symbol=" + element.symbol);
    resultList.appendChild(cloneLinkTemplate);
  });
}

searchButton.addEventListener("click", async (e) => {
  e.preventDefault();
  loader.style.display = "block";
  searchCompany();
  loader.style.display = "none";
});

searchInput.addEventListener("input", (e) => {
  if (searchInput.value != "") {
    loader.style.display = "block";
  } else {
    loader.style.display = "none";
  }
});
