(function () {
  const saved = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const theme = saved || (prefersDark ? "dark" : "light");
  document.documentElement.setAttribute("data-theme", theme);

  function updateIcons(t) {
    const sun = document.getElementById("theme-icon-sun");
    const moon = document.getElementById("theme-icon-moon");
    if (sun && moon) {
      sun.style.display = t === "dark" ? "inline" : "none";
      moon.style.display = t === "dark" ? "none" : "inline";
    }
  }

  updateIcons(theme);

  document.addEventListener("DOMContentLoaded", function () {
    updateIcons(document.documentElement.getAttribute("data-theme"));

    var btn = document.getElementById("theme-toggle");
    if (btn) {
      btn.addEventListener("click", function () {
        var current = document.documentElement.getAttribute("data-theme");
        var next = current === "dark" ? "light" : "dark";
        document.documentElement.setAttribute("data-theme", next);
        localStorage.setItem("theme", next);
        updateIcons(next);
      });
    }
  });
})();
