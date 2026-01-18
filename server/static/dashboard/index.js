import { Grid } from "https://cdn.jsdelivr.net/npm/gridjs/dist/gridjs.module.js";

const propertyGrid = document.getElementById("property-grid");

// Property data with IDs
const properties = [
  {
    id: 1,
    address: "123 Main Street",
    value: "$450,000",
    roi: "8.2%",
    status: "Occupied",
  },
  {
    id: 2,
    address: "456 Oak Avenue",
    value: "$320,000",
    roi: "6.8%",
    status: "Vacant",
  },
  {
    id: 3,
    address: "789 Park Lane",
    value: "$580,000",
    roi: "9.1%",
    status: "Occupied",
  },
  {
    id: 4,
    address: "321 Elm Drive",
    value: "$275,000",
    roi: "5.5%",
    status: "Occupied",
  },
  {
    id: 5,
    address: "654 Maple Court",
    value: "$410,000",
    roi: "7.3%",
    status: "Under Renovation",
  },
  {
    id: 6,
    address: "100 Pine Street",
    value: "$390,000",
    roi: "7.8%",
    status: "Occupied",
  },
  {
    id: 7,
    address: "222 Cedar Lane",
    value: "$510,000",
    roi: "8.5%",
    status: "Vacant",
  },
  {
    id: 8,
    address: "333 Birch Road",
    value: "$295,000",
    roi: "6.2%",
    status: "Occupied",
  },
  {
    id: 9,
    address: "444 Willow Way",
    value: "$620,000",
    roi: "9.4%",
    status: "Occupied",
  },
  {
    id: 10,
    address: "555 Spruce Ave",
    value: "$340,000",
    roi: "5.9%",
    status: "Under Renovation",
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

grid.on("rowClick", (_, row) => {
  const address = row.cells[0].data;
  const property = properties.find((p) => p.address === address);
  if (property) {
    window.location.href = `/dashboard/property.html?id=${property.id}`;
  }
});

window.addEventListener("load", () => {
  const gridHead = propertyGrid.querySelector(".gridjs-head");
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

grid.render(propertyGrid);
