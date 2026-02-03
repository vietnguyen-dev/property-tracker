const urlParams = new URLSearchParams(window.location.search);
const propertyId = urlParams.get("id");

const formatPrice = (val) =>
  val != null
    ? `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
    : "-";

function populateProperty(p) {
  document.title = `PropertyTrack - ${p.address}`;
  document.getElementById("breadcrumb-address").textContent = p.address;
  document.getElementById("property-address").textContent = p.address;

  // Summary cards
  document.getElementById("property-bought-price").textContent = formatPrice(p.bought_price);
  document.getElementById("property-potential-profit").textContent = formatPrice(p.potential_profit);
  document.getElementById("property-base-rental").textContent = formatPrice(p.base_rental_value);

  // Detail section
  document.getElementById("detail-address").textContent = p.address || "-";
  document.getElementById("detail-address-two").textContent = p.address_two || "-";
  document.getElementById("detail-city").textContent = p.city || "-";
  document.getElementById("detail-state").textContent = p.state || "-";
  document.getElementById("detail-zip-code").textContent = p.zip_code || "-";
  document.getElementById("detail-bought-price").textContent = formatPrice(p.bought_price);
  document.getElementById("detail-listed-price").textContent = formatPrice(p.listed_price);
  document.getElementById("detail-potential-sale-price").textContent = formatPrice(p.potential_sale_price);
  document.getElementById("detail-loan-type").textContent = p.loan_type || "-";
  document.getElementById("detail-loan-percentage").textContent = p.loan_percentage != null ? `${p.loan_percentage}%` : "-";
  document.getElementById("detail-potential-profit").textContent = formatPrice(p.potential_profit);
  document.getElementById("detail-base-rental").textContent = formatPrice(p.base_rental_value);
}

window.addEventListener("load", async () => {
  if (!propertyId) {
    document.getElementById("property-address").textContent = "Property Not Found";
    return;
  }

  try {
    const res = await fetch(`/api/properties?id=${propertyId}`);
    if (!res.ok) {
      document.getElementById("property-address").textContent = "Property Not Found";
      return;
    }

    const property = await res.json();
    populateProperty(property);

    // Edit mode toggle
    const editBtn = document.getElementById("edit-toggle-btn");
    const cancelBtn = document.getElementById("edit-cancel-btn");
    let editing = false;
    let originalValues = {};

    const editableFields = [
      "property-address",
      "property-bought-price",
      "property-potential-profit",
      "property-base-rental",
      "detail-address",
      "detail-address-two",
      "detail-city",
      "detail-state",
      "detail-zip-code",
      "detail-bought-price",
      "detail-listed-price",
      "detail-potential-sale-price",
      "detail-loan-type",
      "detail-loan-percentage",
      "detail-potential-profit",
      "detail-base-rental",
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
        el.textContent = restore
          ? originalValues[id]
          : input
            ? input.value
            : originalValues[id];
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
  } catch (err) {
    document.getElementById("property-address").textContent = "Error loading property";
    console.error(err);
  }
});
