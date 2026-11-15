
async function loadVehicles() {
  const list = document.querySelector("#vehicle-list");
  const count = document.querySelector("#vehicle-count");

  try {
    const response = await fetch("./data/vehicles.json");

    if (!response.ok) {
      throw new Error("Unable to load vehicle data.");
    }

    const vehicles = await response.json();

    count.textContent = `${vehicles.length} vehicles`;

    vehicles.forEach((vehicle, index) => {
      const item = document.createElement("li");

      item.className = "vehicle-card";
      item.tabIndex = index === 0 ? 0 : -1;
      item.setAttribute("aria-label",
        `${vehicle.id}, ${vehicle.type}, ${vehicle.status}, ${vehicle.location}`
      );

      item.innerHTML = `
        <div class="vehicle-info">
          <strong>${vehicle.id}</strong>
          <span>${vehicle.type}</span>
        </div>

        <span class="vehicle-status status-${vehicle.status.toLowerCase().replaceAll(" ", "-")}">
          ${vehicle.status}
        </span>

        <span class="vehicle-location">${vehicle.location}</span>
      `;

      list.appendChild(item);
    });

    list.addEventListener("keydown", (event) => {
      const items = [...list.querySelectorAll(".vehicle-card")];
      const currentIndex = items.indexOf(document.activeElement);

      let nextIndex = currentIndex;

      if (event.key === "ArrowDown") {
        nextIndex = Math.min(currentIndex + 1, items.length - 1);
      } else if (event.key === "ArrowUp") {
        nextIndex = Math.max(currentIndex - 1, 0);
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = items.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      items[currentIndex]?.setAttribute("tabindex", "-1");
      items[nextIndex].setAttribute("tabindex", "0");
      items[nextIndex].focus();
    });

    console.log(`Successfully rendered ${vehicles.length} vehicles.`);
  } catch (error) {
    list.innerHTML = `<li class="error-message">Unable to load vehicle records. Please try again.</li>`;
    console.error(error);
  }
}

loadVehicles();
