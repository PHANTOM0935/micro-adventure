// DOM Elements
const logoScreen = document.getElementById("logo-screen");
const themeSelector = document.getElementById("theme-selector");
const gameContainer = document.getElementById("game-container");
const enterBtn = document.getElementById("enter-game");
const themeButtons = document.querySelectorAll("#theme-selector button");
const startCameraBtn = document.getElementById("start-camera");
const camera = document.getElementById("camera");
const getLocationBtn = document.getElementById("get-location");
const locationInfo = document.getElementById("location-info");
const startAdventureBtn = document.getElementById("start-adventure");
const gameStatus = document.getElementById("game-status");
const result = document.getElementById("result");
const avatar = document.getElementById("avatar");

let currentTheme = null;
let map = null;
let treasureSpots = [];

// Transitions
enterBtn.addEventListener("click", () => {
  logoScreen.classList.add("hidden");
  themeSelector.classList.remove("hidden");
});

// Theme selection
themeButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    currentTheme = btn.dataset.theme;
    applyTheme(currentTheme);
    themeSelector.classList.add("hidden");
    gameContainer.classList.remove("hidden");
  });
});

function applyTheme(theme) {
  document.body.className = theme;
  if (theme === "jungle") {
    avatar.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/1998/1998611.png')";
  } else if (theme === "pirate") {
    avatar.style.backgroundImage = "url('https://cdn-icons-png.flaticon.com/512/1046/1046750.png')";
  }
}

// Camera
startCameraBtn.addEventListener("click", async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    camera.srcObject = stream;
    startCameraBtn.style.display = "none";
  } catch (err) {
    alert("Camera access denied.");
  }
});

// Location
getLocationBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showLocation, () => {
      alert("Unable to fetch location.");
    });
  } else {
    alert("Geolocation not supported.");
  }
});

function showLocation(position) {
  const { latitude, longitude } = position.coords;
  locationInfo.textContent = Lat: ${latitude.toFixed(4)}, Lon: ${longitude.toFixed(4)};
  if (!map) initMap(latitude, longitude);
}

// Map & Treasures
function initMap(lat, lon) {
  map = L.map('map').setView([lat, lon], 16);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

  // Sample treasure locations nearby
  treasureSpots = [
    [lat + 0.0008, lon + 0.0004],
    [lat - 0.0006, lon - 0.0003],
    [lat + 0.0003, lon - 0.0007],
  ];

  treasureSpots.forEach(coords => {
    const marker = L.marker(coords).addTo(map);
    marker.bindPopup("Suspicious spot... 🤔").openPopup();
  });

  L.marker([lat, lon]).addTo(map).bindPopup("You are here").openPopup();
}

// Game Start
startAdventureBtn.addEventListener("click", () => {
  gameStatus.textContent = "Searching for clues...";
  setTimeout(() => {
    gameStatus.textContent = "Treasure found!";
    result.textContent = Congratulations! You've completed the ${currentTheme} adventure!;
  }, 3000);
});
