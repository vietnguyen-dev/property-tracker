import { Grid } from "https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.module.js";

const propertyGrid = document.getElementById("property-grid");
let properties = [];

const grid = new Grid({
  columns: [
    "Address",
    "City",
    "State",
    "Zip Code",
    "Bought Price",
    "Listed Price",
    "Potential Sale Price",
    "Potential Profit",
    "Base Rental Value",
  ],
  data: [],
  search: true,
  fixedHeader: true,
  sort: true,
  resizeable: true,
  pagination: {
    limit: 10,
  },
});

grid.on("rowClick", (_, row) => {
  const address = row.cells[0].data;
  const property = properties.find((p) => p.address === address);
  if (property) {
    window.location.href = `/dashboard/property.html?id=${property.id}`;
  }
});

grid.render(propertyGrid);

window.addEventListener("load", async () => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) return;

  const res = await fetch(`/api/properties?user_id=${user.id}`);
  properties = (await res.json()) || [];

  localStorage.setItem("properties", JSON.stringify(properties));

  const formatPrice = (val) =>
    val != null ? `$${Number(val).toLocaleString("en-US", { minimumFractionDigits: 2 })}` : "-";

  grid
    .updateConfig({
      data: properties.map((p) => [
        p.address,
        p.city,
        p.state,
        p.zip_code,
        formatPrice(p.bought_price),
        formatPrice(p.listed_price),
        formatPrice(p.potential_sale_price),
        formatPrice(p.potential_profit),
        formatPrice(p.base_rental_value),
      ]),
    })
    .forceRender();
});

function showError(message) {
  document.getElementById("errorModalMessage").textContent = message;
  const errorModal = new bootstrap.Modal(document.getElementById("errorModal"));
  errorModal.show();
}

document.getElementById("addPropertyForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const user = JSON.parse(localStorage.getItem("user"));
  if (!user || !user.id) {
    showError("You must be logged in to add a property.");
    return;
  }

  const body = {
    user_id: user.id,
    address: document.getElementById("propertyAddress").value,
    address_two: document.getElementById("propertyAddressTwo").value || null,
    city: document.getElementById("propertyCity").value,
    state: document.getElementById("propertyState").value,
    zip_code: document.getElementById("propertyZipCode").value,
  };

  try {
    const res = await fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text();
      showError(text || "Failed to create property.");
      return;
    }

    const data = await res.json();
    window.location.href = `/dashboard/property.html?id=${data.id}`;
  } catch (err) {
    showError("Network error. Please try again.");
  }
});
