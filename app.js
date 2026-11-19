async function loadVehicles() {
  const list = document.querySelector("#vehicle-list");
  const count = document.querySelector("#vehicle-count");

  if (!list || !count) return;

  const BUFFER_ROWS = 8;
  const ESTIMATED_ROW_HEIGHT = 76;

  try {
    const response = await fetch("./data/vehicles.json");
    if (!response.ok) throw new Error("Unable to load vehicle data.");

    const vehicles = await response.json();
    count.textContent = `${vehicles.length} vehicles`;

    // Store measured heights and cumulative offsets. Prefix offsets make
    // index/scroll-position lookups efficient even when row heights vary.
    const rowHeights = new Array(vehicles.length).fill(ESTIMATED_ROW_HEIGHT);
    const offsets = new Array(vehicles.length + 1).fill(0);

    function rebuildOffsets() {
      offsets[0] = 0;
      for (let i = 0; i < vehicles.length; i += 1) {
        offsets[i + 1] = offsets[i] + rowHeights[i];
      }
    }

    function getIndexAtOffset(scrollOffset) {
      let low = 0;
      let high = vehicles.length;
      const target = Math.max(0, scrollOffset);

      while (low < high) {
        const middle = Math.floor((low + high) / 2);
        if (offsets[middle + 1] <= target) {
          low = middle + 1;
        } else {
          high = middle;
        }
      }

      return Math.min(low, Math.max(0, vehicles.length - 1));
    }

    function createVehicleRow(vehicle, index) {
      const item = document.createElement("li");
      item.className = "vehicle-card";
      item.dataset.index = String(index);
      item.tabIndex = index === 0 ? 0 : -1;
      item.setAttribute(
        "aria-label",
        `${vehicle.id}, ${vehicle.type}, ${vehicle.status}, ${vehicle.location}`
      );

      const info = document.createElement("div");
      info.className = "vehicle-info";

      const id = document.createElement("strong");
      id.textContent = vehicle.id;

      const type = document.createElement("span");
      type.textContent = vehicle.type;
      info.append(id, type);

      const status = document.createElement("span");
      status.className = `vehicle-status status-${vehicle.status
        .toLowerCase()
        .replaceAll(" ", "-")}`;
      status.textContent = vehicle.status;

      const location = document.createElement("span");
      location.className = "vehicle-location";
      location.textContent = vehicle.location;

      item.append(info, status, location);
      return item;
    }

    const topSpacer = document.createElement("li");
    topSpacer.className = "virtual-spacer";
    topSpacer.setAttribute("aria-hidden", "true");

    const bottomSpacer = document.createElement("li");
    bottomSpacer.className = "virtual-spacer";
    bottomSpacer.setAttribute("aria-hidden", "true");

    list.replaceChildren(topSpacer, bottomSpacer);

    let renderedStart = -1;
    let renderedEnd = -1;
    let animationFrame = 0;

    function renderWindow(preserveAnchor = false) {
      if (vehicles.length === 0) {
        list.replaceChildren();
        return;
      }

      // Keep the same first visible vehicle and its within-row offset on resize.
      const oldScrollTop = list.scrollTop;
      const anchorIndex = getIndexAtOffset(oldScrollTop);
      const anchorOffset = oldScrollTop - offsets[anchorIndex];

      const firstVisible = getIndexAtOffset(list.scrollTop);
      const visibleEnd = getIndexAtOffset(
        list.scrollTop + Math.max(list.clientHeight, ESTIMATED_ROW_HEIGHT)
      ) + 1;
      const start = Math.max(0, firstVisible - BUFFER_ROWS);
      const end = Math.min(vehicles.length, visibleEnd + BUFFER_ROWS);

      if (start === renderedStart && end === renderedEnd && !preserveAnchor) {
        return;
      }

      const fragment = document.createDocumentFragment();
      fragment.appendChild(topSpacer);

      for (let index = start; index < end; index += 1) {
        fragment.appendChild(createVehicleRow(vehicles[index], index));
      }

      fragment.appendChild(bottomSpacer);
      list.replaceChildren(fragment);

      // Measure rendered rows so wrapping or responsive layout changes are handled.
      let heightsChanged = false;
      list.querySelectorAll(".vehicle-card").forEach((row) => {
        const index = Number(row.dataset.index);
        const measuredHeight = row.getBoundingClientRect().height;
        if (measuredHeight > 0 && Math.abs(rowHeights[index] - measuredHeight) > 0.5) {
          rowHeights[index] = measuredHeight;
          heightsChanged = true;
        }
      });

      if (heightsChanged) rebuildOffsets();

      topSpacer.style.height = `${offsets[start]}px`;
      bottomSpacer.style.height = `${Math.max(0, offsets[vehicles.length] - offsets[end])}px`;

      renderedStart = start;
      renderedEnd = end;

      if (preserveAnchor) {
        list.scrollTop = offsets[anchorIndex] + anchorOffset;
      }
    }

    function scheduleRender(preserveAnchor = false) {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => renderWindow(preserveAnchor));
    }

    list.addEventListener("scroll", () => scheduleRender(), { passive: true });

    list.addEventListener("keydown", (event) => {
      const currentRow = document.activeElement.closest(".vehicle-card");
      if (!currentRow || !list.contains(currentRow)) return;

      const currentIndex = Number(currentRow.dataset.index);
      let nextIndex = currentIndex;

      if (event.key === "ArrowDown") {
        nextIndex = Math.min(currentIndex + 1, vehicles.length - 1);
      } else if (event.key === "ArrowUp") {
        nextIndex = Math.max(currentIndex - 1, 0);
      } else if (event.key === "Home") {
        nextIndex = 0;
      } else if (event.key === "End") {
        nextIndex = vehicles.length - 1;
      } else {
        return;
      }

      event.preventDefault();
      const nextRow = list.querySelector(`.vehicle-card[data-index="${nextIndex}"]`);

      if (nextRow) {
        currentRow.tabIndex = -1;
        nextRow.tabIndex = 0;
        nextRow.focus();
      } else {
        list.scrollTop = offsets[nextIndex];
        renderedStart = -1;
        renderWindow();
        const renderedTarget = list.querySelector(
          `.vehicle-card[data-index="${nextIndex}"]`
        );
        if (renderedTarget) {
          currentRow.tabIndex = -1;
          renderedTarget.tabIndex = 0;
          renderedTarget.focus();
        }
      }
    });

    // Recalculate the window while retaining the user's scroll anchor.
    window.addEventListener("resize", () => scheduleRender(true));

    rebuildOffsets();
    renderWindow();
    console.log(
      `Virtualised ${vehicles.length} vehicles. Rendered rows: ${list.querySelectorAll(".vehicle-card").length}.`
    );
  } catch (error) {
    list.innerHTML =
      '<li class="error-message">Unable to load vehicle records. Please try again.</li>';
    console.error(error);
  }
}

loadVehicles();
