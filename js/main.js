// --------------------
// Main body code
// --------------------

function navbarClick(e) {
  console.log("***navbar clicked: " + e.target.innerHTML.trim());
  switch (e.target.innerHTML.trim()) {
    case "Home":
      window.location.href = "index.html";
      break;
    case "My Portal":
      window.location.href = "myportal.html";
      break;
    case "Notemaker":
      nmFormActions();
      // Open offcanvas
      // const offcanvasElement = document.getElementById("offcanvasNotemaker");
      // const offcanvas = new bootstrap.Offcanvas(offcanvasElement);
      // offcanvas.show();
      break;
    case "Data":
      window.location.href = "data.html";
      break;
    case "Video":
      window.location.href = "video.html";
      break;
    case "Voice":
      window.location.href = "voice.html";
      break;
  }
}
function navbarInit() {
  document
    .getElementById("navbarNav")
    .addEventListener("click", (e) => navbarClick(e));
}

async function generateCards(selection, filteredRecords) {
  let cardContainer = "";
  const query = await actionsNmDB("getAll", "");
  // records = query;
  switch (selection) {
    case "index.html":
      //todo
      break;
    case "myportal.html":
      cardContainer = document.getElementById("card-container-troubles");
      result = query.slice(0, 6); // Show only first 6 records
      cardContainer.innerHTML = "";
      result.forEach((item) => {
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
      });
      break;
    case "troubles.html":
      await generateTroubleCards(filteredRecords);
      break;
  }
}
// --------------------
// IndexedDB Code
// --------------------
async function loadNmDB() {
  const dbHelper = new AsyncIndexedDB("NotemakerDB", 1, [
    {
      name: "nmTroubles",
      keyPath: "id",
      autoIncrement: true,
      indexes: [
        {
          name: "caseType_idx",
          keyPath: "caseType",
          options: { unique: false },
        },
        {
          name: "ticketId_idx",
          keyPath: "ticketId",
          options: { unique: false },
        },
        { name: "empId_idx", keyPath: "empId", options: { unique: false } },
        { name: "empName_idx", keyPath: "empName", options: { unique: false } },
        {
          name: "trblType_idx",
          keyPath: "troubleType",
          options: { unique: false },
        },
        {
          name: "description_idx",
          keyPath: "description",
          options: { unique: false },
        },
        { name: "actions_idx", keyPath: "actions", options: { unique: false } },
        {
          name: "resolution_idx",
          keyPath: "resolution",
          options: { unique: false },
        },
        {
          name: "dateCreated_idx",
          keyPath: "dateCreated",
          options: { unique: true },
        },
      ],
    },
    {
      name: "nmTempNmForm",
      keyPath: "id",
      options: { unique: false },
    },
  ]);
  await dbHelper.init();
  return dbHelper;
}

function nmTest() {
  console.log("nmTest function called");
  const descriptionSelect = document.getElementById("nmOnlineDescription");
  const choices = new Choices(descriptionSelect);
  console.log("Choices instance created: ", choices);

}

async function actionsNmTempFormDB(action, items) {
  let storeName = "nmTempNmForm";
  const nmdb = await loadNmDB();
  switch (action) {
    case "put":
      await nmdb.put(storeName, items);
      break;
    case "get":
      console.log("actionsNmDB get items: ", items);
      return await nmdb.get(storeName, items);
    case "getAll":
      return await nmdb.getAll(storeName);
    case "delete":
      // await nmdb.delete(storeName, id);
      break;
    case "clear":
      await nmdb.clear(storeName);
      break;
    default:
      console.log(
        "No actions taken on [actionsNmTempFormDB()], please review.",
      );
  }
}

async function actionsNmDB(action, items) {
  let storeName = "nmTroubles";
  const nmdb = await loadNmDB();
  switch (action) {
    case "put":
      await nmdb.put(storeName, items);
      break;
    case "get":
      console.log("actionsNmDB get items: ", items);
      return await nmdb.get(storeName, items);
    case "getAll":
      return await nmdb.getAll(storeName);
    case "delete":
      // await nmdb.delete(storeName, id);
      break;
    case "clear":
      await nmdb.clear(storeName);
      break;
    case "count":
      await nmdb.count(storeName);
      break;
    case "getByIndex":
      // await nmdb.getByIndex(storeName, indexName, query);
      break;
    case "getAllByIndex":
      // await nmdb.getAllByIndex(storeName, indexName, query);
      break;
    default:
      console.log("No actions taken on [actionsNmDB()], please review.");
  }
}
// --------------------
// PageLoad Code
// --------------------
window.addEventListener("load", function () {
  let docUrl = this.document.URL;
  const docUrlSplit = docUrl.split("/");
  generateCards(docUrlSplit[docUrlSplit.length - 1]);
});
