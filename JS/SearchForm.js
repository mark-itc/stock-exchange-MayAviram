class SearchForm {
  constructor(element) {
    this.element = element;
    this.#build();
    this.loader = document.getElementById("loader");
  }

  #build() {
    this.form = document.createElement("form");
    Object.assign(this.form, {
      class: "d-flex",
      role: "search",
    });
    this.form.setAttribute("class", "d-flex");
    this.input = document.createElement("input");
    Object.assign(this.input, {
      class: "form-control me-2",
      type: "search",
      placeholder: "Search",
      id: "searchInput",
    });
    this.input.setAttribute("class", "form-control me-2");
    this.button = document.createElement("button");
    Object.assign(this.button, {
      class: "btn btn-outline-success",
      type: "submit",
      id: "searchButton",
      innerHTML: "Search",
    });
    this.span = document.createElement("span");
    Object.assign(this.span, {
      class: "loader",
      id: "loader",
    });
    this.span.setAttribute("class", "loader");
    this.button.setAttribute("class", "btn btn-outline-success");
    this.form.appendChild(this.input);
    this.form.appendChild(this.button);
    this.element.appendChild(this.form);
    this.element.appendChild(this.span);

    this.button.addEventListener("click", async (e) => {
      e.preventDefault();
      this.loader.setAttribute("style", "display:block;");
      let companies = await this.searchCompany();
      this.renderSearchResult(companies);
      this.loader.setAttribute("style", "display:none;");
    });

    this.input.addEventListener("input", (e) => {
      if (this.input.value != "") {
        this.loader.setAttribute("style", "display:block;");
      } else {
        this.loader.setAttribute("style", "display:none;");
      }
    });
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
  async searchCompany() {
    this.inputText = this.input.value;
    this.url =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=" +
      this.inputText +
      "&limit=10&exchange=NASDAQ";
    let apiResult = await this.loadAPI(this.url);
    return apiResult;
  }

  onSearch(renderSearchResult) {
    this.renderSearchResult = renderSearchResult;
  }
}
