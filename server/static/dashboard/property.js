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
} else {
  // Property not found
  document.getElementById("property-address").textContent =
    "Property Not Found";
  document.getElementById("property-status-badge").classList.add("bg-danger");
  document.getElementById("property-status-badge").textContent = "Error";
}
