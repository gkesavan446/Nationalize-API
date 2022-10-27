// Style background color of the body
let body = document.querySelector("body");
body.style.backgroundColor = "lightgreen"; // alternate background


// Adding heading to the output
let heading = document.createElement("h1");
heading.innerHTML = "Nationalize API";
heading.setAttribute("class", "text-center h1 px-1 py-3");
heading.style.color = "White";
body.appendChild(heading);

// Creating Card
let card = document.createElement("div");
card.style.maxWidth = "30rem";
card.setAttribute("class", "card d-flex mx-auto my-3 container-sm");

let cardBody = document.createElement("div");
cardBody.setAttribute("class", "card-body text-center");

let cardTitle = document.createElement("h4");
cardTitle.setAttribute("class", "card-title");
cardTitle.innerHTML = "Enter your Name";
cardTitle.style.color = "grey";

let cardInput = document.createElement("input");
cardInput.setAttribute("type", "text");
cardInput.setAttribute("placeholder", "ex: John");
cardInput.setAttribute("class", "form-control my-3");

let buttonLink = document.createElement("a");
buttonLink.setAttribute("href", "#");
buttonLink.setAttribute("class", "btn btn-primary px-5");
buttonLink.innerHTML = "Search";

// buttonDiv.append(buttonLink);
cardBody.append(cardTitle, cardInput, buttonLink);
card.append(cardBody);
body.append(card);

// display note on default load

var errorMsg = document.createElement("p");
errorMsg.setAttribute("class", "text-center");
errorMsg.style.fontSize = "30px";
errorMsg.innerHTML = "Ready to provide results for you!";
errorMsg.style.color = "White";
body.append(errorMsg);

// Handling Button click

let btn = document.querySelector("a");
let enteredText = document.querySelector("input");

btn.addEventListener("click", async (event) => {

  // prevents page reload
  event.preventDefault();

  // removes table and input which was rendered previously
  let removeTab = document.querySelector("table");
  let removeEle = document.getElementsByClassName(
    "p-3 my-2 mx-auto text-center container"
  )[0];
  if (removeTab) {
    removeTab.remove();
  }
  if (removeEle) {
    removeEle.remove();
  }

  // try catch and handle errors

  try {
    // validation on submit
    if (enteredText.value.trim().length === 0) {
      alert("Please enter the Name!!!");
    }

    // parsing results based on API response  
    let req = await fetch(`https://api.nationalize.io?name=${enteredText.value.trim()}`);  
    let res = await req.json();    
  
    var inputEntered = document.createElement("div");
    inputEntered.setAttribute("class","p-3 my-2 mx-auto text-center container");
    inputEntered.style.fontSize = "1.3rem";
    inputEntered.maxWidth = "30rem";
    inputEntered.style.whiteSpace = "initial";
    inputEntered.style.color = "white";     
    inputEntered.innerHTML = "For the Name: " +  `<span><mark style="color: red;"> ${enteredText.value.toUpperCase()} </mark></span>`
    body.append(inputEntered);

    // clearing text post submit
    enteredText.value = "";

    // check if response containes more country
    if (res["country"].length === 0) {
      throw "Oops!..No Matches Found.";
    }

    // creating table
    let table = document.createElement("table");
    table.style.backgroundColor = "#fff";
    table.setAttribute(
      "class",
      "table table-striped table-hover text-center w-50 mx-auto container-fluid table-bordered align-items-center"
    );
    let thead = document.createElement("thead");
    let tableRow = table.insertRow();
    let thead1 = tableRow.insertCell();
    thead1.innerHTML = "Country Name";
    thead1.style.color = "blue";
    thead1.style.fontSize = "20px";
    let thead2 = tableRow.insertCell();
    thead2.innerHTML = "Probability";
    thead2.style.color = "blue";
    thead2.style.fontSize = "20px";
    tableRow.append(thead1, thead2);
    thead.append(tableRow);
    table.append(thead);

    // sorting value based on probability value
    let ans = Object.entries(res["country"]).sort(
      (a, b) => +b[1]["probability"] - +a[1]["probability"]
    );

    // construction of table body with two results
    let tbody = document.createElement("tbody");
    let len = res["country"].length;
    if (len > 2) {
      len = 2;
    }
    for (let i = 0; i < len; i++) {
      let tableBodyRow = table.insertRow();
      let countryCode = tableBodyRow.insertCell();

      //convert country code into country name
      const rep = new Intl.DisplayNames(['en'], { type: 'region' });
      countryCode.innerHTML = rep.of(ans[i][1]["country_id"]);
      countryCode.setAttribute("class", "text-danger");
      countryCode.style.fontWeight = "bolder";
      let probability = tableBodyRow.insertCell();
      probability.innerHTML = ans[i][1]["probability"];
      probability.setAttribute("class", "text-danger");
      probability.style.fontWeight = "bolder";
      tableBodyRow.append(countryCode, probability);
      tbody.append(tableBodyRow);
    }
    table.append(tbody);
    body.append(table);
    errorMsg.innerHTML = "Results";
  } catch (Error) {
    errorMsg.innerHTML = Error;
  }
});

