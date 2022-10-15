let urlQueryString = window.location.search;
let companySymbol = new URLSearchParams(urlQueryString).get("symbol");
let myChart = document.getElementById("myChart");
let chartDiv = document.getElementById("chartDiv");
async function loadAPI(url) {
  try {
    let response = await fetch(url);
    let result = await response.json();
    return result;
  } catch (err) {
    console.log("err: ", err);
  }
}

async function getCompanyInfo() {
  let companyInfo = await loadAPI(
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/" +
      companySymbol
  );
  return companyInfo;
}

async function getCompanyProfile() {
  let companyProfile = await getCompanyInfo();

  companyProfile = companyProfile.profile;
  let companyImage = document.getElementById("companyImage");
  let companyName = document.getElementById("companyName");
  let companyDescription = document.getElementById("companyDescription");
  let companyWebsite = document.getElementById("companyWebsite");
  let stockPrice = document.getElementById("stockPrice");
  let changesPercentage = document.getElementById("changesPercentage");

  companyImage.setAttribute("src", companyProfile.image);
  companyName.innerHTML = companyProfile.companyName;
  companyDescription.innerHTML = companyProfile.description;
  companyWebsite.setAttribute("href", companyProfile.website);

  if (companyProfile.changesPercentage > 0) {
    changesPercentage.style.color = "LightGreen";
  } else {
    changesPercentage.style.color = "Red";
  }

  stockPrice.innerHTML =
    "Stock Price: " + companyProfile.price + companyProfile.currency;

  changesPercentage.innerHTML = " (" + companyProfile.changesPercentage + ")";

  let historyOfStockPrice = await getHistoryOfStockPrice();
  let lableDate = [];
  let dataClose = [];
  historyOfStockPrice.forEach((element) => {
    lableDate.push(element.date);
    dataClose.push(element.close);
  });

  let wrapper = document.getElementById("wrapper");
  wrapper.classList.remove("none");
  let wrapperLoader = document.getElementById("wrapper-loader");
  wrapperLoader.classList.remove("loader");
  getCharthistoryOfStockPrice(lableDate, dataClose);
}

async function getHistoryOfStockPrice() {
  chartDiv.classList.add("loader");
  let historyOfStockPrice = await loadAPI(
    "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/" +
      companySymbol +
      "?serietype=line"
  );
  return historyOfStockPrice.historical;
}

function getCharthistoryOfStockPrice(lableDate, dataClose) {
  const labels = lableDate;

  const data = {
    labels: labels,
    datasets: [
      {
        label: "Stock Price History",
        backgroundColor: "rgb(255, 99, 132)",
        borderColor: "rgb(255, 99, 132)",
        data: dataClose,
      },
    ],
  };

  const config = {
    type: "line",
    data: data,
    options: {},
  };

  chartDiv.classList.remove("loader");
  const newChart = new Chart(myChart, config);
}

getCompanyProfile();
