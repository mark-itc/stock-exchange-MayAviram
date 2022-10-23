class SearchResult {
  constructor(element) {
    this.element = element;
    this.#build();
  }

  #build() {
    this.div = document.createElement("div");
    Object.assign(this.div, {
      class: "list-group list-group-flush",
      id: "searchResultList",
    });
    this.div.setAttribute("class", "list-group list-group-flush");

    this.template = document.createElement("template");
    this.template.setAttribute("id", "template");

    this.a = document.createElement("a");
    this.a.setAttribute("class", "list-group-item company-link");

    this.img = document.createElement("img");
    this.img.setAttribute("class", "companyLogo");

    this.h = document.createElement("h7");
    this.aSpan = document.createElement("span");
    this.aSpan.setAttribute("id", "percentageSpan");

    this.divResult = document.createElement("div");
    this.divResult.setAttribute("id", "resultList");

    this.a.appendChild(this.img);
    this.a.appendChild(this.h);
    this.a.appendChild(this.aSpan);
    this.template.content.appendChild(this.a);
    this.div.appendChild(this.template);
    this.div.appendChild(this.divResult);
    this.element.appendChild(this.div);
  }
  async loadAPI(url) {
    try {
      this.response = await fetch(url);
      this.result = await this.response.json();
      return this.result;
    } catch (err) {
      console.log("err: ", err);
    }
  }

  async showSearchResult(apiResult) {
    this.divResult.innerHTML = "";

    apiResult.forEach(async (element) => {
      this.companyInfo = await this.getCompanyInfo(element.symbol);
      let name = this.highlightSameWord(element.name);
      let symbol = this.highlightSameWord(element.symbol);
      console.log("element.name: ", element.name);
      console.log("element.symbol: ", element.symbol);
      console.log("name: ", name);
      console.log("symbol: ", symbol);
      this.cloneLinkTemplate = this.template.content.cloneNode(true);
      this.cloneLinkTemplate
        .querySelector("img")
        .setAttribute("src", this.companyInfo.profile.image);
      this.cloneLinkTemplate.querySelector(
        "h7"
      ).innerHTML = `${name}( ${symbol} )`;
      this.cloneLinkTemplate
        .querySelector("a")
        .setAttribute("href", "../HTML/company.html?symbol=" + element.symbol);
      this.changesPercentage =
        this.cloneLinkTemplate.querySelector("#percentageSpan");
      if (this.companyInfo.profile.changesPercentage > 0) {
        this.changesPercentage.style.color = "LightGreen";
      } else {
        this.changesPercentage.style.color = "Red";
      }
      this.sign = this.companyInfo.profile.changesPercentage > 0 ? "+" : "";
      this.changesPercentage.innerHTML = `${this.sign}${parseFloat(
        this.companyInfo.profile.changesPercentage
      ).toFixed(2)}%`;
      this.divResult.appendChild(this.cloneLinkTemplate);
    });
  }

  async getCompanyInfo(symbol) {
    this.companyInfo = await this.loadAPI(
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
        symbol
    );
    return this.companyInfo;
  }

  highlightSameWord(text) {
    let inputText = document.getElementById("searchInput").value;
    inputText = inputText.toLowerCase();
    let newText = text.toLowerCase();
    var index = newText.indexOf(inputText);
    if (index >= 0) {
      text =
        text.substring(0, index) +
        "<span class='highlight'>" +
        text.substring(index, index + inputText.length) +
        "</span>" +
        text.substring(index + inputText.length);
    }
    return text;
  }
}
