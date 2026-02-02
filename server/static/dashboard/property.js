// Get property ID from URL query parameters
const urlParams = new URLSearchParams(window.location.search);
const propertyId = parseInt(urlParams.get("id"));

// Get properties from localStorage
const properties = JSON.parse(localStorage.getItem("properties") || "[]");
const property = properties.find((p) => p.id === propertyId);

if (property) {
  // Update page title
  document.title = `PropertyTrack - ${property.address}`;

  // Update breadcrumb
  document.getElementById("breadcrumb-address").textContent = property.address;

  // Update header
  document.getElementById("property-address").textContent = property.address;

  // Update status badge
  const statusBadge = document.getElementById("property-status-badge");
  statusBadge.textContent = property.status;
  if (property.status === "Occupied") {
    statusBadge.classList.add("bg-success");
  } else if (property.status === "Vacant") {
    statusBadge.classList.add("bg-warning", "text-dark");
  } else {
    statusBadge.classList.add("bg-info");
  }

  // Update summary cards
  document.getElementById("property-value").textContent = property.value;
  document.getElementById("property-roi").textContent = property.roi;
  document.getElementById("property-status").textContent = property.status;

  // Update detail section
  document.getElementById("detail-address").textContent = property.address;
  document.getElementById("detail-id").textContent = property.id;
  document.getElementById("detail-value").textContent = property.value;
  document.getElementById("detail-roi").textContent = property.roi;
  document.getElementById("detail-status").textContent = property.status;
  // Edit mode toggle
  const editBtn = document.getElementById("edit-toggle-btn");
  const cancelBtn = document.getElementById("edit-cancel-btn");
  let editing = false;
  let originalValues = {};

  const editableFields = [
    "property-address",
    "property-value",
    "property-roi",
    "property-status",
    "detail-address",
    "detail-id",
    "detail-value",
    "detail-roi",
    "detail-status",
  ];

  const editHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/></svg> Edit`;

  const saveHtml = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16"><path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/></svg> Save`;

  function enterEditMode() {
    editing = true;
    editBtn.innerHTML = saveHtml;
    editBtn.title = "Save Property";
    editBtn.className = "btn btn-success btn-sm";
    cancelBtn.classList.remove("d-none");

    editableFields.forEach((id) => {
      const el = document.getElementById(id);
      const value = el.textContent;
      originalValues[id] = value;
      const input = document.createElement("input");
      input.type = "text";
      input.className = "form-control";
      input.value = value;
      el.textContent = "";
      el.appendChild(input);
    });
  }

  function exitEditMode(restore) {
    editing = false;
    editBtn.innerHTML = editHtml;
    editBtn.title = "Edit Property";
    editBtn.className = "btn btn-outline-primary btn-sm";
    cancelBtn.classList.add("d-none");

    editableFields.forEach((id) => {
      const el = document.getElementById(id);
      const input = el.querySelector("input");
      el.textContent = restore ? originalValues[id] : (input ? input.value : originalValues[id]);
    });
    originalValues = {};
  }

  editBtn.addEventListener("click", () => {
    if (editing) {
      exitEditMode(false);
    } else {
      enterEditMode();
    }
  });

  cancelBtn.addEventListener("click", () => {
    exitEditMode(true);
  });
} else {
  // Property not found
  document.getElementById("property-address").textContent =
    "Property Not Found";
  document.getElementById("property-status-badge").classList.add("bg-danger");
  document.getElementById("property-status-badge").textContent = "Error";
}
