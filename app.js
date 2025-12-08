// Inisialisasi Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBh2T-GLXopRlv1uTcWXQvLt_iDJlnMsqo",
  authDomain: "webiotdashboard.firebaseapp.com",
  databaseURL: "https://webiotdashboard-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webiotdashboard",
  storageBucket: "webiotdashboard.firebasestorage.app",
  messagingSenderId: "38054663986",
  appId: "1:38054663986:web:d53a0ec9898609f013692b",
  measurementId: "G-STF6WDKYFB"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Referensi ke node database
const sensorRef = db.ref('sensor');
const acRef = db.ref('ac');

// Generate pilihan suhu (step 0.5)
function generateTempOptions() {
  const select = document.getElementById('temp-index-select');
  for (let i = 0; i <= 24; i++) { // n index -> 14.0 + n*0.5 = x
    const temp = 14.0 + i * 0.5;
    const option = document.createElement('option');
    option.value = i;
    option.textContent = `${temp}°C`;
    select.appendChild(option);
  }
}

generateTempOptions();

// Update tampilan saat ada perubahan sensor
sensorRef.on('value', (snapshot) => {
  const data = snapshot.val();
  if (data) {
    document.getElementById('temp-display').textContent = data.temperature + '°C';
    document.getElementById('press-display').textContent = data.pressure + ' hPa';
  }
});

// Fungsi update AC
function updateAC(field, value) {
  acRef.update({ [field]: value });
}

// Event listener untuk tombol dan dropdown
document.getElementById('power-on').addEventListener('click', () => updateAC('power', true));
document.getElementById('power-off').addEventListener('click', () => updateAC('power', false));

document.getElementById('mode-select').addEventListener('change', (e) => updateAC('mode', e.target.value));
document.getElementById('direction-select').addEventListener('change', (e) => updateAC('direction', e.target.value));
document.getElementById('speed-select').addEventListener('change', (e) => updateAC('speed', e.target.value));
document.getElementById('temp-index-select').addEventListener('change', (e) => updateAC('temperature_index', parseInt(e.target.value)));

// Initial load: baca state AC terakhir
acRef.once('value').then((snapshot) => {
  const acData = snapshot.val();
  if (acData) {
    document.getElementById('mode-select').value = acData.mode || 'cool';
    document.getElementById('direction-select').value = acData.direction || 'auto';
    document.getElementById('speed-select').value = acData.speed || 'auto';
    document.getElementById('temp-index-select').value = acData.temperature_index || 10;
  }
});