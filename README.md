# Fleet Ops Console – Meridian Logistics

A responsive fleet operations dashboard built with HTML, CSS, and vanilla JavaScript. This project generates and displays 400 sample vehicle records for Meridian Logistics.

## Project Overview

The objective is to create the foundation for a fleet management interface that displays vehicle IDs, types, current statuses, and locations.

## Features

- Generates 400 unique vehicle records.
- Displays vehicle IDs, types, statuses, and locations.
- Scrollable vehicle list.
- Keyboard navigation using Up Arrow, Down Arrow, Home, and End.
- Visible keyboard focus indicators.
- Accessible HTML list structure and ARIA descriptions.
- Responsive layout for desktop and mobile screens.
- Status indicators with distinct colours.
- No external UI libraries or frameworks.

## Technology Stack

- HTML5
- CSS3
- JavaScript
- Node.js
- JSON
- Visual Studio Code
- Google Chrome DevTools
- Git and GitHub

## Project Structure

```text
fleet-ops-console/
│
├── index.html
├── style.css
├── app.js
├── data/
│   └── vehicles.json
├── scripts/
│   └── generate-vehicles.js
└── README.md
```

## Getting Started

### Prerequisites

Install Node.js and npm.

### 1. Generate Vehicle Data

Open a terminal in the project directory and run:

```bash
node scripts/generate-vehicles.js
```

The script generates 400 vehicle records and saves them in:

```text
data/vehicles.json
```

Each record contains:

- Unique vehicle ID
- Vehicle type
- Current status
- Location

### 2. Run the Website

Open the project folder in Visual Studio Code.

Start a local static web server. For example, if you have the VS Code Live Server extension installed, right-click `index.html` and select **Open with Live Server**.

Alternatively, use a local HTTP server and open its localhost address in your browser.

### 3. View the Vehicle Dashboard

The dashboard displays all 400 vehicle records in a vertically scrollable list.

## Keyboard Navigation

The vehicle list supports the following keyboard controls:

| Key | Action |
|---|---|
| Down Arrow | Move to the next vehicle |
| Up Arrow | Move to the previous vehicle |
| Home | Move to the first vehicle |
| End | Move to the last vehicle |

The focused vehicle is highlighted with a visible outline.

## Data Validation

The generated dataset was verified using Node.js.

| Validation | Result |
|---|---:|
| Total records | 400 |
| Unique vehicle IDs | 400 |
| First vehicle ID | VH-001 |
| Last vehicle ID | VH-400 |
| Missing required fields | 0 |

## Accessibility

Accessibility features include:

- Semantic HTML list elements.
- Accessible labels and descriptions.
- Keyboard navigation.
- Visible focus indicators.
- High-contrast text and status labels.
- Responsive layout.

Further manual accessibility testing is recommended.

## Project Scope

This implementation provides a static vehicle list using generated sample data. Live updates, persistent filters, virtualization, and vehicle detail panels are intended for subsequent project tasks.

## Author

Frontend Development Internship Project

**Client:** Meridian Logistics

**Project:** Fleet Ops Console