// script.js

const startCameraButton = document.getElementById("start-camera");
const cameraElement = document.getElementById("camera");
const getLocationButton = document.getElementById("get-location");
const locationInfo = document.getElementById("location-info");
const startAdventureButton = document.getElementById("start-adventure");
const gameStatus = document.getElementById("game-status");
const resultText = document.getElementById("result");
const treasureMessage = document.getElementById("treasure-message");
const foundCountEl = document.getElementById("found-count");
const totalCountEl = document.getElementById("total-count");
const clueBox = document.getElementById("clue-box");
const clueText = document.getElementById("clue-text");
const landingScreen = document.getElementById("landing-screen");
const enterGameBtn = document.getElementById("enter-game");

let map, userMarker;
let treasureFound = false;
let foundTreasures = [];
let treasureMarkers = [];

const treasureLocations = [
  { name: "Old Well", lat: 37.4219999, lng: -122.0840575 },
  { name: "Mysterious Tree", lat: 37.4225, lng: -122.086 },
  { name: "Lost Bench", lat: 37.423, lng: -122.082 }
];

totalCountEl.textContent = treasureLocations.length;

enterGameBtn.addEventListener("click", () => {
  landingScreen.style.display = "none";
  document.getElementById("game-container").style.display = "block";
});

startCameraButton.addEventListener("click", async () => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraElement.srcObject = stream;
      startCameraButton.style.display = "none";
    } catch (error) {
      alert("Could not access the camera.");
    }
  } else {
    alert("Camera not supported on this device.");
  }
});

getLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition, () => alert("Unable to retrieve location."));
  }
});

function showPosition(position) {
  const lat = position.coords.latitude;
  const lng = position.coords.longitude;
  locationInfo.textContent = `Latitude: ${lat}, Longitude: ${lng}`;

  if (!map) {
    map = L.map("map").setView([lat, lng], 16);
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);
  }

  if (userMarker) {
    userMarker.setLatLng([lat, lng]);
  } else {
    userMarker = L.marker([lat, lng]).addTo(map);
  }

  treasureLocations.forEach((t, index) => {
    const marker = L.marker([t.lat, t.lng]).addTo(map).bindPopup(t.name);
    treasureMarkers[index] = marker;
  });

  if (!treasureFound) {
    checkTreasureProximity(lat, lng);
  }
}

startAdventureButton.addEventListener("click", () => {
  gameStatus.textContent = "Adventure Started! Find the treasures!";
  startAdventureButton.disabled = true;

  if (navigator.geolocation) {
    navigator.geolocation.watchPosition(pos => {
      showPosition(pos);
    });
  }
});

function checkTreasureProximity(lat, lng) {
  treasureLocations.forEach((t, index) => {
    const dist = getDistance(lat, lng, t.lat, t.lng);
    if (dist < 10 && !foundTreasures.includes(index)) {
      treasureFound = true;
      foundTreasures.push(index);

      treasureMessage.textContent = `🎉 You found ${t.name}! 🎉`;
      treasureMessage.classList.remove("hidden");
      clueText.textContent = `Clue: The ${t.name} hides secrets no one knows.`;
      clueBox.classList.remove("hidden");

      foundCountEl.textContent = foundTreasures.length;
      treasureMarkers[index].remove();

      setTimeout(() => {
        treasureFound = false;
        treasureMessage.classList.add("hidden");
        clueBox.classList.add("hidden");
      }, 5000);
    }
  });
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c * 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}
