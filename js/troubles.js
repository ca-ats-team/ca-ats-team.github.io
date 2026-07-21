let startIndex = 0;
const pageSize = 9;
let result = [];
let records = [];

async function fetchTroubleDetails(id) {
  let innerContent = "";
  const query = await actionsNmDB("get", Number(id));
  switch (query.caseType) {
    case "online":
      innerContent += `<h4>${query.ticketId}</h4>`;
      innerContent += `<h5>${query.caseType}</h5>`;
      innerContent += `<p>${query.troubleType}</p>`;
      innerContent += `<p>${query.empId}</p>`;
      innerContent += `<p>${query.empName}</p>`;
      innerContent += `<p>${query.cbrNum}</p>`;
      innerContent += `<p>${query.actions}</p>`;
      innerContent += `<p>${query.description}</p>`;
      innerContent += `<p>${query.resolution}</p>`;
      innerContent += `<p>${query.dateCreated}</p>`;
      break;
    case "offline":
      innerContent += `<h4>${query.ticketId}</h4>`;
      innerContent += `<h5>${query.caseType}</h5>`;
      innerContent += `<p>${query.troubleType}</p>`;
      innerContent += `<p>${query.description}</p>`;
      innerContent += `<p>${query.contactType}</p>`;
      innerContent += `<p>${query.questionCmds}</p>`;
      innerContent += `<p>${query.questionDisp}</p>`;
      innerContent += `<p>${query.questionONT}</p>`;
      innerContent += `<p>${query.questionProv}</p>`;
      innerContent += `<p>${query.questionRG}</p>`;
      innerContent += `<p>${query.questionReso}</p>`;
      innerContent += `<p>${query.questionSpoke}</p>`;
      innerContent += `<p>${query.contactName}</p>`;
      innerContent += `<p>${query.contactNumber}</p>`;
      innerContent += `<p>${query.dateCreated}</p>`;
      break;
  }
  document.getElementById("troubleDetailContainer").innerHTML +=
    "<p>" + innerContent + "</p> ";
}
async function generateTroubleCards(filteredRecords) {
  cardContainer = document.getElementById("card-container-trouble-list");
  cardContainer.innerHTML = "";
  
  if (!filteredRecords) {
    console.log("No filtered records provided, fetching all records...");
    filteredRecords = await actionsNmDB("getAll", "");
  }
  console.log("Filtered records in generateTroubleCards():", filteredRecords);
  records = filteredRecords;

  let sliced = records.slice(startIndex, startIndex + pageSize);
  cardContainer = document.getElementById("card-container-trouble-list");
  cardContainer.innerHTML = "";
  const cardNav = document.createElement("div");
  cardNav.className = "d-flex justify-content-center m-4";
  sliced.forEach((item) => {
    const card = document.createElement("div");
    card.className = "col-md-4 mb-4";
    if (item.caseType == "online") {
      card.innerHTML = `
      <div class="card h-100">
          <div class="form-floating">
          <input readonly class="form-control text-capitalize text-center fs-5 fw-semibold bg-light" id="cardFloatingCaseType" placeholder="${item.caseType}" value="${item.caseType}" />
          <label class="text-capitalize text-muted" for="cardFloatingCaseType">Case Type:</label>
          </div>
          <img src="https://placehold.co/25/orange/white" class="card-img-top" alt="...">
          <div class="card-body">
              <div class="card-subtitle text-capitalize text-muted">Ticket/BTN#:</div>
              <h5 class="card-title mb-3">${item.ticketId}</h5>
              <dl class="row">
                  <dt class="col-md-4">Trouble Type:</dt>
                  <dd class="col-md-8">${item.troubleType}</dd>
                  <dt class="col-md-4">Description:</dt>
                  <dd class="col-md-8">${item.description}</dd>
                  <dt class="col-md-4">Tech ID:</dt>
                  <dd class="col-md-8">${item.empId}</dd>
                  <dt class="col-md-4">Tech Name:</dt>
                  <dd class="col-md-8">${item.empName}</dd>
              </dl>
              <button class="btn btn-sm btn-outline-primary" onclick="troubleDetails(${item.id})">View Details</button>
          </div>
          
          <div class="card-footer"><small class="text-muted">Created on: ${new Date(
            item.dateCreated,
          ).toLocaleString()}</small>
          </div> 
      </div>
    `;
    } else if (item.caseType == "offline") {
      card.innerHTML = `
      <div class="card h-100">
          <div class="form-floating">
          <input readonly class="form-control text-capitalize text-center fs-5 fw-semibold bg-light" id="cardFloatingCaseType" placeholder="${item.caseType}" value="${item.caseType}" />
          <label class="text-capitalize text-muted" for="cardFloatingCaseType">Case Type:</label>
          </div>
          <img src="https://placehold.co/25/orange/white" class="card-img-top" alt="...">    
          <div class="card-body">
              <div class="card-subtitle text-capitalize text-muted">Ticket/BTN#:</div>
              <h5 class="card-title mb-3">${item.ticketId}</h5>
              <dl class="row">
                  <dt class="col-md-4">Trouble Type:</dt>
                  <dd class="col-md-8">${item.troubleType}</dd>
                  <dt class="col-md-4">Description:</dt>
                  <dd class="col-md-8">${item.description}</dd>
              </dl>
              <button class="btn btn-sm btn-outline-primary" onclick="troubleDetails(${item.id})">View Details</button>
          </div>
          <div class="card-footer"><small class="text-muted">Created on: ${new Date(
            item.dateCreated,
          ).toLocaleString()}</small>
          </div> 
      </div>
    `;
    }
    cardContainer.appendChild(card);
    document.getElementById("prevBtn").disabled = startIndex === 0;
    document.getElementById("nextBtn").disabled =
      startIndex + pageSize >= records.length;
    document.getElementById("pageIndicator").textContent =
      `Page ${Math.floor(startIndex / pageSize) + 1} of ${Math.ceil(records.length / pageSize)}`;
  });
}
    

function troublesButton(selection) {
      switch (selection) {
        case "prevBtn":
          if (startIndex > 0) {
            startIndex -= pageSize;
            generateCards("troubles.html");
          }
          break;
        case "nextBtn":
          if (startIndex + pageSize < records.length) {
            startIndex += pageSize;
            generateCards("troubles.html");
          }
          break;
      }
}

function troubleDetails(id) {
      window.open("troubledetail.html?id=" + id, "_self");
}

function testGenerateCards(page, filteredRecords) {
      generateCards(page, filteredRecords);
}
async function getAllDb(params) {
  const db = actionsNmDB("getAll", "");
  return db;
}
document.getElementById("troubleSearchBtn").addEventListener("click", async function() {
      const query = document.getElementById("troubleSearch").value.toLowerCase();
      console.log("Search query:", query);
      if (!query) {
          console.log("No search query provided");
          generateCards("troubles.html");
      }

      const terms = query.split(/\s+/).filter(Boolean);
      console.log("Search terms:", terms);
      console.log("records", await getAllDb());
      const db = await getAllDb();
      const filteredRecords = db.filter((item) =>
        terms.every((term) =>
          item.ticketId.toLowerCase().includes(term) ||
          item.troubleType.toLowerCase().includes(term) ||
          item.description.toLowerCase().includes(term) ||
          (item.empId && item.empId.toLowerCase().includes(term)) ||
          (item.empName && item.empName.toLowerCase().includes(term)),
        ),
      );
      startIndex = 0;
      console.log("Filtered records in addEventListener:", filteredRecords);
      generateCards("troubles.html", filteredRecords);

});

document.getElementById("troubleResetBtn").addEventListener("click", function() {
      document.getElementById("troubleSearch").value = "";
      startIndex = 0;
      generateCards("troubles.html");
});

document.getElementById("troubleSearch").addEventListener("keypress", function(event) {
      if (event.key === "Enter") {
          document.getElementById("troubleSearchBtn").click();
      }

      
});

window.addEventListener("load", function () {
      actionsNmDB("getAll", "").then((data) => {
            records = data;
            generateCards("troubles.html", records);
      });
});

