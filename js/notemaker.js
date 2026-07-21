// --------------------
// Notemaker Code
// --------------------
var nmOfflineDDContactType;
var nmOfflineContactName;
var nmFormCheckVal;
var nmTestInput;
var nmFormSwitches;
var nmFormSwitchesId;
var nmFormSwitchesSel;
var nmActiveTab;
var nmOfflineDescSel;
var nmOfflineDescGrpSel;
var nmOnlineDescSel;
var nmOnlineDescGrpSel;
var nmChoiceSelId;
function nmLoadInputs() {
  nmOfflineDDContactType = document.getElementById("nmOfflineDDContactType");
  nmOfflineContactName = document.getElementById("nmOfflineContactName");
  nmFormSwitches = document.querySelectorAll(".form-check-input");
  let nmOnlineDesc = document.getElementById("nmOnlineDescription");
  let nmOfflineDesc = document.getElementById("nmOfflineDescription");
  let nmDescValues = `
  <optgroup label="General">
                <option value="ACTV">ACT - ONT/DSLAM Activation</option>
                <option value="OOS">OOS - Out of Service</option>
                <option value="PHY">PHY - Physical Issue</option>
                <option value="AUDT">AUDT - CO/DSLAM/Hub Audit</option>
                <option value="GEN">GEN - General Question</option>
              </optgroup>
              <optgroup label="Voice">=
                <option value="NDT">NDT - No Dialtone</option>
                <option value="NSY">NSLY - Static/Noisy Line</option>
                <option value="CCO">CCO - Can't Call Out</option>
                <option value="CBC">CBC - Can't Be Called</option>
                <option value="MEM">MEM - Features Not Working</option>
              </optgroup>
              <optgroup label="Data">
                <option value="CON">CCON - Can't Connect</option>
                <option value="SLW">SLOW - Slow Speed</option>
                <option value="PCR">PCCR - No Route to Destination</option>
                <option value="FRQ">FRQD - Frequent Disconnects</option>
              </optgroup>
              <optgroup label="Video">
                <option value="ACO">ACO - All Channels Out</option>
                <option value="SCO">SCO - Some Channels Out</option>
                <option value="IMG">IMG - Program Guide Issue</option>
                <option value="VOD">VOD - Video On Demand Issue</option>
                <option value="STB">STB - Set-top Box Issue</option>
                <option value="WID">WID - Widgets Issue</option>
                <option value="PPV">PPV - PPV Issue</option>
                <option value="AUD">AUD - Poor Audio</option>
              </optgroup>
  `;
  nmOnlineDesc.innerHTML = nmDescValues;
  nmOfflineDesc.innerHTML = nmDescValues;
}
function nmLoadListeners() {
  //Listener for the Notemaker Nav tabs
  document.getElementById("notemakerTab").onclick = function (e) {
    console.log("***nmActiveTab: " + e.target.innerHTML.trim());
    nmActiveTab = e.target.innerHTML.trim();
    nmSaveActiveTab();
    nmResetForms("nm" + nmActiveTab);
  };
  //Listener for the Offline Nav tab > Customer Contact Dropdown
  nmOfflineDDContactType.addEventListener("change", function (e) {
    // console.log("e.target.value: " + e.target.value);
    const value = e.target.value;
    if (value == 1) {
      nmOfflineContactName.disabled = false;
      document.getElementById("nmformswitchSpoke").checked = true;
    } else {
      nmOfflineContactName.disabled = true;
      nmOfflineContactName.value = "";
      document.getElementById("nmformswitchSpoke").checked = false;
    }
  });
  //Listener for the Action Forms button and Bootstrap Switches elements
  nmFormSwitches.forEach((nmFormSwitches) => {
    nmFormSwitches.addEventListener("change", (event) => {
      // console.log(event.target.id + " is: " + event.target.checked);
      nmFormSwitchesId = event.target.id;
      nmFormSwitchesSel = event.target.checked;
      if (!document.getElementById("nmformswitchSpoke").checked) {
        document.getElementById("nmformswitchIssueReso").checked = false;
        document.getElementById("nmformswitchIssueReso").disabled = true;
        document.getElementById("nmformswitchDisp").checked = false;
        document.getElementById("nmformswitchDisp").disabled = true;
        document.getElementById("nmOfflineDDContactType").selectedIndex = 0;
        document.getElementById("nmOfflineContactName").disabled = true;
        document.getElementById("nmOfflineContactName").value = "";
      } else {
        document.getElementById("nmformswitchIssueReso").disabled = false;
        document.getElementById("nmformswitchDisp").disabled = false;
        document.getElementById("nmOfflineDDContactType").value = 1;
        document.getElementById("nmOfflineContactName").disabled = false;
      }
      if (!document.getElementById("nmformswitchONT").checked) {
        document.getElementById("nmformswitchRG").checked = false;
        document.getElementById("nmformswitchRG").disabled = true;
      } else {
        document.getElementById("nmformswitchRG").disabled = false;
      }
    });
  });
  //Listener for the Choices Dropdown list.
  document.getElementById("nmOnlineDescription").addEventListener(
    "addItem",
    function (event) {
      // each time a choice is selected
      nmOnlineDescSel = event.detail.element.innerHTML.replace(
        /^(?:\S+\s+){1}(\S+\s)/g,
        "",
      );
      nmOnlineDescGrpSel = event.detail.groupValue;
      nmChoiceSelId = event.detail.id;
      console.log("nmChoiceSelId: " + nmChoiceSelId);
    },
    false,
  );
  document.getElementById("nmOfflineDescription").addEventListener(
    "addItem",
    function (event) {
      // each time a choice is selected
      nmOfflineDescSel = event.detail.element.innerHTML.replace(
        /^(?:\S+\s+){1}(\S+\s)/g,
        "",
      );
      nmOfflineDescGrpSel = event.detail.groupValue;
    },
    false,
  );
  //Listener for the nmSaveFormData function
  document.querySelectorAll("input").forEach((input) => {
    input.addEventListener("change", nmSaveFormData);
  });
  document.querySelectorAll("select").forEach((select) => {
    select.addEventListener("change", nmSaveFormData);
  });
}
function nmGetItemValues(selectedItem) {
  let items;
  switch (selectedItem) {
    case "nmOnlineSubmit":
      items = {
        caseType: "online",
        empName: document.getElementById("nmOnlineEmpName").value,
        empId: document.getElementById("nmOnlineEmpId").value,
        cbrNum: document.getElementById("nmOnlineCbrNum").value,
        ticketId: document.getElementById("nmOnlineTicketId").value,
        choiceId: nmChoiceSelId,
        troubleType: nmOnlineDescGrpSel,
        description: nmOnlineDescSel,
        actions: document.getElementById("nmOnlineActions").value,
        resolution: document.getElementById("nmOnlineResolution").value,
        dateCreated: new Date().getTime(),
      };
      break;
    case "nmOfflineSubmit":
      //todo try to save the all the values from the select dropdown to the DB
      items = {
        caseType: "offline",
        contactName: document.getElementById("nmOfflineContactName").value,
        contactNumber: document.getElementById("nmOfflineContactNum").value,
        contactType: document.getElementById("nmOfflineDDContactType").options[
          document.getElementById("nmOfflineDDContactType").selectedIndex
        ].text,
        ticketId: document.getElementById("nmOfflineTicketId").value,
        choiceId: nmChoiceSelId,
        troubleType: nmOfflineDescGrpSel,
        description: nmOfflineDescSel,
        // actions: document.getElementById("nmOfflineActions").value,
        questionONT: getFormsSwitchValue(
          document.getElementById("nmformswitchONT"),
        ),
        questionRG: getFormsSwitchValue(
          document.getElementById("nmformswitchRG"),
        ),
        questionProv: getFormsSwitchValue(
          document.getElementById("nmformswitchProv"),
        ),
        questionCmds: getFormsSwitchValue(
          document.getElementById("nmformswitchCmds"),
        ),
        questionSpoke: getFormsSwitchValue(
          document.getElementById("nmformswitchSpoke"),
        ),
        questionReso: getFormsSwitchValue(
          document.getElementById("nmformswitchIssueReso"),
        ),
        questionDisp: getFormsSwitchValue(
          document.getElementById("nmformswitchDisp"),
        ),
        dateCreated: new Date().getTime(),
      };
      break;
  }
  function getFormsSwitchValue(item) {
    return item.checked;
  }
  return items;
}
async function nmDisplaySaveFormData(value) {
  let selectedItem = value;
  if (selectedItem == 0) {
    selectedItem = "Online";
  } else if (selectedItem == 1) {
    selectedItem = "Offline";
  } else if (!selectedItem) {
    selectedItem = "Online";
  }

  const query = await actionsNmTempFormDB("getAll", "");
  if (!query || query.length == 0) {
    console.log("No saved data found for selectedItem: " + selectedItem);
    return;
  }

  if (query && query.length > 0) {
    return Promise.resolve(query).then((query) => {
      console.log("nmDisplaySaveFormData query: ", query);
      console.log(selectedItem);
      switch (selectedItem) {
        case "Online":
          document.getElementById("nmOnlineEmpName").value =
            query[query.length - 1].empName || "";
          document.getElementById("nmOnlineEmpId").value =
            query[query.length - 1].empId || "";
          document.getElementById("nmOnlineCbrNum").value =
            query[query.length - 1].cbrNum || "";
          document.getElementById("nmOnlineTicketId").value =
            query[query.length - 1].ticketId || "";
          document.getElementById("nmOnlineDescription").selectedIndex =
            query[query.length - 1].choiceId || 0;
          document.getElementById("nmOnlineActions").value =
            query[query.length - 1].actions || "";
          document.getElementById("nmOnlineResolution").value =
            query[query.length - 1].resolution || "";
          break;
        case "Offline":
          document.getElementById("nmOfflineTicketId").value =
            query[query.length - 1].ticketId || "";
          document.getElementById("nmOfflineContactName").value =
            query[query.length - 1].contactName || "";
          document.getElementById("nmOfflineContactNum").value =
            query[query.length - 1].contactNumber || "";
          document.getElementById("nmOfflineDDContactType").value =
            query[query.length - 1].contactType || "";
          document.getElementById("nmOfflineDescription").value =
            query[query.length - 1].troubleType || "";
          setFormsSwitchValue(
            document.getElementById("nmformswitchONT"),
            query[query.length - 1].questionONT || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchRG"),
            query[query.length - 1].questionRG || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchProv"),
            query[query.length - 1].questionProv || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchCmds"),
            query[query.length - 1].questionCmds || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchSpoke"),
            query[query.length - 1].questionSpoke || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchIssueReso"),
            query[query.length - 1].questionReso || false,
          );
          setFormsSwitchValue(
            document.getElementById("nmformswitchDisp"),
            query[query.length - 1].questionDisp || false,
          );
          break;
      }
    });
    function setFormsSwitchValue(item, value) {
      item.checked = value;
    }
  } 
}
function nmSearch(selectedItem) {
  switch (selectedItem) {
    case "nmOnlineEmpName":
      const EmpName = document.getElementById("nmOnlineEmpName").value;
      var myurl =
        "https://vxfield.ftr.com/sh/RTS_HTML_Pages/Customized_Pages/UtilityJSPs/TechLookUp.jsp?techName=" +
        EmpName.toUpperCase();
      window.open(myurl, "_blank");
      break;
    case "nmOnlineEmpId":
      const EmpId = document.getElementById("nmOnlineEmpId").value;
      var myurl =
        "https://vxfield.ftr.com/sh/RTS_HTML_Pages/Customized_Pages/UtilityJSPs/TechLookUp.jsp?techName=" +
        EmpId;
      window.open(myurl, "_blank");
      break;
    case "nmOnlineTicketId":
      const TicketIdOnline = document.getElementById("nmOnlineTicketId").value;
      ticketIdSearch(TicketIdOnline);
      break;
    case "nmOfflineTicketId":
      const TicketIdOffline =
        document.getElementById("nmOfflineTicketId").value;
      ticketIdSearch(TicketIdOffline);
      break;
  }
  function ticketIdSearch(TicketId) {
    if (TicketId.length <= 8) {
      let myurl =
        "https://vxfield.ftr.com/sh/RTS_HTML_Pages/Customized_Pages/UtilityJSPs/RelatedOrderLookUp.jsp?relatedOrderNumber=&call__t=" +
        TicketId +
        "&phoneNumber=&opNumber=&cbr=&callStatus=ALL";
      window.open(myurl, "_blank");
    } else if (TicketId.length == 10) {
      let myurl =
        "https://vxfield.ftr.com/sh/RTS_HTML_Pages/Customized_Pages/UtilityJSPs/RelatedOrderLookUp.jsp?relatedOrderNumber=&call__t=&phoneNumber=" +
        TicketId +
        "&opNumber=&cbr=&callStatus=ALL";
      window.open(myurl, "_blank");
    }
  }
}
function nmSaveItems(selectedItem) {
  actionsNmDB("put", nmGetItemValues(selectedItem));
  nmResetForms("nm" + nmActiveTab);
}
function nmLoadSelectSearch() {
  nmChoiceSet(document.getElementById("nmOnlineDescription"));
  nmChoiceSet(document.getElementById("nmOfflineDescription"));
  function nmChoiceSet(item) {
    const choice = new Choices(item, {
      // removeItemButton: true,
      placeholder: true,
      placeholderValue: "Select Description...",
      closeDropdownOnSelect: true,
      shouldSort: false,
      shouldSortItems: true,
      maxItemCount: 4,
      duplicateItemsAllowed: false,
    });
  }
}
function copyToClipboard() {
  console.log("***copyToClipboard() called");
  console.log("Label: " + document.querySelector('[for="nmformswitchONT"]'));
  var str = "<br>\r\n************ ATS Notemaker ************<br>\r\n";
  switch (nmActiveTab) {
    case "Online":
      str +=
        "FT Name: " +
        document.getElementById("nmOnlineEmpName").value +
        "<br>\r\n";
      str +=
        "FT ID: " + document.getElementById("nmOnlineEmpId").value + "<br>\r\n";
      str +=
        "CBR: " + document.getElementById("nmOnlineCbrNum").value + "<br>\r\n";
      str +=
        "Ticket ID: " +
        document.getElementById("nmOnlineTicketId").value +
        "<br>\r\n";
      str +=
        "---Description: " +
        nmOnlineDescGrpSel +
        " - " +
        nmOnlineDescSel +
        "<br>\r\n";
      str +=
        "---Actions: " +
        document.getElementById("nmOnlineActions").value +
        "<br>\r\n";
      str +=
        "---Resolution: " +
        document.getElementById("nmOnlineResolution").value +
        "<br>\r\n";
      // console.log("***Cliboard str: " + str);
      navigator.clipboard.writeText(str);
      break;
    case "Offline":
      str +=
        "Ticket ID: " +
        document.getElementById("nmOfflineTicketId").value +
        "<br>\r\n";
      str +=
        "---Description: " +
        nmOfflineDescGrpSel +
        " - " +
        nmOfflineDescSel +
        "<br>\r\n";
      str += "---Actions: " + "<br>\r\n";
      if (document.getElementById("nmformswitchONT").checked) {
        str +=
          document.querySelector('[for="nmformswitchONT"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchONT"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchRG").checked) {
        str +=
          document.querySelector('[for="nmformswitchRG"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchRG"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchProv").checked) {
        str +=
          document.querySelector('[for="nmformswitchProv"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchProv"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchCmds").checked) {
        str +=
          document.querySelector('[for="nmformswitchCmds"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchCmds"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchSpoke").checked) {
        str +=
          document.querySelector('[for="nmformswitchSpoke"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchSpoke"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchIssueReso").checked) {
        str +=
          document
            .querySelector('[for="nmformswitchIssueReso"]')
            .innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document
            .querySelector('[for="nmformswitchIssueReso"]')
            .innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      if (document.getElementById("nmformswitchDisp").checked) {
        str +=
          document.querySelector('[for="nmformswitchDisp"]').innerHTML.trim() +
          " Yes" +
          "<br>\r\n";
      } else {
        str +=
          document.querySelector('[for="nmformswitchDisp"]').innerHTML.trim() +
          " No" +
          "<br>\r\n";
      }
      str +=
        "---Contact Number: " +
        document.getElementById("nmOfflineContactNum").value +
        "<br>\r\n";
      if (document.getElementById("nmOfflineDDContactType").value > 0) {
        str +=
          "---Contact Type: " +
          document.getElementById("nmOfflineDDContactType").options[
            document.getElementById("nmOfflineDDContactType").selectedIndex
          ].text +
          "<br>\r\n";
      }
      if (document.getElementById("nmOfflineContactName").disabled == false) {
        str +=
          "---Contact Name: " +
          document.getElementById("nmOfflineContactName").value +
          "<br>\r\n";
      }
      str +=
        "---Resolution: " +
        document.getElementById("nmOfflineResolution").value +
        "<br>\r\n";
      navigator.clipboard.writeText(str);
      break;
  }
}
function nmSubmit(selectedItem) {
  switch (selectedItem) {
    case "nmOnlineSubmit":
      nmSaveItems("nmOnlineSubmit");
      break;
    case "nmOfflineSubmit":
      nmSaveItems("nmOfflineSubmit");
      break;
  }
}
function nmSaveFormData(e) {
  console.log("***nmSaveFormData() called");
  console.log("e.target.id: " + e.target.value);
  console.log("nmActiveTab: " + nmActiveTab);
  actionsNmTempFormDB("put", { id: 1, ...nmGetItemValues('nm' + nmActiveTab + 'Submit') });
}
function nmResetForms(selectedItem) {
  switch (selectedItem) {
    case "nmOnline":
      console.log("***nmResetForms(nmOnline) selected");
      resetOnline();
      break;
    case "nmOffline":
      console.log("***nmResetForms(nmOffline) selected");
      resetOffline();
      break;
    case "nmOnload":
      console.log("***nmResetForms(onload) selected");
    resetOnline();
    resetOffline();
    document.getElementById("notemakerTab").querySelectorAll("button")[nmGetActiveTab()].click();
    nmDisplaySaveFormData(0);
  }
  function resetOffline() {
    nmOfflineContactName.disabled = true;
    document.getElementById("nmformswitchIssueReso").disabled = true;
    document.getElementById("nmformswitchDisp").disabled = true;
    document.getElementById("nmformswitchRG").disabled = true;
    document.getElementById("nmOfflineForm").reset();
  }
  function resetOnline() {
    document.getElementById("nmOnlineForm").reset();
  }
  function resetSaveFormData() {
    actionsNmTempFormDB("clear");
  }
}
function nmGetActiveTab() {
  let activeTab = document.getElementById("notemakerTab").querySelector("button.active");
  switch (sessionStorage.getItem("nmActiveTab")) {
    case "Online":
      sessionStorage.getItem("nmActiveTab", "Online");
      return 0;
    case "Offline":
      sessionStorage.setItem("nmActiveTab", "Offline");
      return 1;
    default:
      sessionStorage.setItem("nmActiveTab", "Online");
      return 0;
  }
}
function nmSaveActiveTab() {
  let activeTab = document.getElementById("notemakerTab").querySelector("button.active");
  switch (activeTab.innerHTML.trim()) {
    case "Online":
      sessionStorage.setItem("nmActiveTab", "Online");
      break;
    case "Offline":
      sessionStorage.setItem("nmActiveTab", "Offline");
      break;
    default:
      sessionStorage.setItem("nmActiveTab", "Online");
  }
}
function nmFormActions() {
  nmLoadInputs();
  nmLoadListeners();
  nmResetForms("nmOnload");
  nmLoadSelectSearch();
}
