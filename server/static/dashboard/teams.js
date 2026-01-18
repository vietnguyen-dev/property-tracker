import { Grid } from "https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.module.js";

const usersGrid = document.getElementById("users-grid");

// Property data with IDs
const properties = [
  {
    id: 1,
    address: "123 Main Street",
    value: "$450,000",
    roi: "8.2%",
    status: "Occupied",
  },
];

// Store in localStorage for property.js to access
localStorage.setItem("properties", JSON.stringify(properties));

const grid = new Grid({
  columns: ["Address", "Value", "ROI", "Status"],
  data: properties.map((p) => [p.address, p.value, p.roi, p.status]),
  search: true,
  fixedHeader: true,
  sort: true,
  resizeable: true,
  pagination: {
    limit: 10,
  },
});

window.addEventListener("load", () => {
  const gridHead = usersGrid.querySelector(".gridjs-head");
  if (gridHead) {
    const buttonsDiv = document.createElement("div");
    buttonsDiv.className = "d-flex gap-2 ms-auto";
    buttonsDiv.innerHTML = `
      <button type="button" class="btn btn-primary" id="btn-add-property" data-bs-toggle="modal" data-bs-target="#addPropertyModal">Add Property</button>
    `;

    const searchWrapper = gridHead.querySelector(".gridjs-search");
    if (searchWrapper) {
      searchWrapper.style.display = "flex";
      searchWrapper.style.alignItems = "center";
      searchWrapper.style.gap = "1rem";
      searchWrapper.style.width = "100%";
      searchWrapper.appendChild(buttonsDiv);
    }
  }
});

grid.render(usersGrid);
