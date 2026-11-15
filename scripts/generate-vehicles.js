
const fs = require("fs");
const path = require("path");

const statuses = [
  "En Route",
  "Available",
  "Loading",
  "Maintenance",
  "Delayed",
];

const locations = [
  "Rawalpindi, Pakistan",
  "Islamabad, Pakistan",
  "Lahore, Pakistan",
  "Karachi, Pakistan",
  "Peshawar, Pakistan",
  "Faisalabad, Pakistan",
  "Multan, Pakistan",
  "Quetta, Pakistan",
  "Sialkot, Pakistan",
  "Gujranwala, Pakistan",
  "Hyderabad, Pakistan",
  "Abbottabad, Pakistan",
];

const vehicleTypes = [
  "Delivery Van",
  "Cargo Truck",
  "Refrigerated Truck",
  "Flatbed Truck",
  "Heavy-Duty Truck",
];

function generateVehicles(count) {
  const vehicles = [];

  for (let i = 1; i <= count; i++) {
    const vehicle = {
      id: `VH-${String(i).padStart(3, "0")}`,
      type: vehicleTypes[Math.floor(Math.random() * vehicleTypes.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      location: locations[Math.floor(Math.random() * locations.length)],
    };

    vehicles.push(vehicle);
  }

  return vehicles;
}

const vehicles = generateVehicles(400);

const outputPath = path.join(__dirname, "../data/vehicles.json");

fs.writeFileSync(
  outputPath,
  JSON.stringify(vehicles, null, 2),
  "utf8"
);

console.log("Vehicle data generated successfully!");
console.log(`Total vehicle records: ${vehicles.length}`);
console.log(`Output file: ${outputPath}`);
