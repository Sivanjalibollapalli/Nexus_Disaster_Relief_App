document.addEventListener('DOMContentLoaded', () => {
  const sosBtn = document.querySelector('.sos-btn');
  sosBtn.addEventListener('click', () => {
    startSOSRecording();
  });
  updateResourceTiles();
  // Other event listeners...

  window.addEventListener('load', () => {
    const resources = ['Food', 'Water', 'Shelter', 'Medical'];

    resources.forEach(resource => {
      const currentSupplies = JSON.parse(localStorage.getItem(resource)) || 100;
      updateResourceTile(resource, currentSupplies);
    });
  });
});
document.addEventListener('updateResource', (event) => {
  const { name, quantity } = event.detail;
  updateResourceTile(name, quantity);
});


function updateResourceTiles() {
fetch('get_resources.php')
  .then(response => response.json())
  .then(data => {
    data.forEach(resource => {
      updateResourceTile(resource.resource_name, resource.quantity);
    });
  })
  .catch(error => console.error('Error:', error));
}

function updateResourceTile(resource, newSupplies) {
const resourceTile = document.querySelector(`.resource-tile[data-resource="${resource.toLowerCase()}"]`);
if (!resourceTile) return;

const progressBar = resourceTile.querySelector('.progress');
const progressText = resourceTile.querySelector('.resource-info p');

let progressColor;
let progressWidth = (newSupplies / 100) * 100;

if (newSupplies >= 501) {
  progressColor = 'green';
} else if (newSupplies >= 201) {
  progressColor = 'orange';
} else {
  progressColor = 'red';
}

progressBar.style.width = `${progressWidth}%`;
progressBar.style.backgroundColor = progressColor;

let resourceUnit = getResourceUnit(resource);
progressText.textContent = `${newSupplies} ${resourceUnit} Available`;
}

function getResourceUnit(resource) {
switch(resource.toLowerCase()) {
  case 'food': return 'Meals';
  case 'water': return 'Liters';
  case 'shelter': return 'Beds';
  case 'medical': return 'Medicines';
  default: return 'Units';
}
}
function startSOSRecording() {
  navigator.geolocation.getCurrentPosition(position => {
    const { latitude, longitude } = position.coords;
    console.log('Latitude:', latitude, 'Longitude:', longitude);

    if (latitude && longitude) {
      startMediaRecording(latitude, longitude);
    } else {
      console.error('Failed to get location.');
      alert('Failed to get location.');
    }
  }, error => {
    console.error('Error getting location:', error);
    alert('Failed to get location: ' + error.message);
  });
}

function startMediaRecording(latitude, longitude) {
  navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    .then(stream => {
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp8,opus' });
      const chunks = [];

      mediaRecorder.ondataavailable = e => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: 'video/webm' });
        const formData = new FormData();
        formData.append('video', blob, 'sos_recording.webm');
        formData.append('location', `${latitude},${longitude}`);

        fetch('sos_handler.php', {
          method: 'POST',
          body: formData
        })
        .then(response => {
          console.log('Response status:', response.status);
          console.log('Response headers:', response.headers);
          return response.text();  
        })
        .then(text => {
          console.log('Response text:', text);
          let data;
          try {
            data = JSON.parse(text);
          } catch (e) {
            console.error('Error parsing JSON:', e);
            throw new Error('Invalid JSON response from server');
          }
          if (data.status === 'success') {
            alert('SOS sent successfully!');

          } else {
            throw new Error(data.message || 'Unknown error occurred');
          }
        })
        .catch(error => {
          console.error('Error sending SOS Recording:', error);
          alert('Failed to send SOS. Error: ' + error.message);
        });
      };

      mediaRecorder.start();
      console.log('SOS Recording started');

     
      setTimeout(() => {
        mediaRecorder.stop();
        stream.getTracks().forEach(track => track.stop());
        console.log('SOS Recording stopped after 2 minutes');
      }, 120000);
    })
    .catch(error => console.error('Error accessing media devices:', error));
}



function getResourceUnit(resource) {
  switch(resource.toLowerCase()) {
      case 'food': return 'Meals';
      case 'water': return 'Liters';
      case 'shelter': return 'Beds';
      case 'medical': return 'Medicines';
      default: return 'Units';
  }
}

function requestResource(resource) {
  window.location.href = `request_resources.html?resource=${resource}`;
}

document.getElementById('requestResources').addEventListener('click', () => {
  window.location.href = 'request_resources.html';
});

document.getElementById('realTimeMap').addEventListener('click', () => {
  window.location.href = 'real_time_map.html';
});

document.getElementById('home').addEventListener('click', () => {
  window.location.href = 'home.html';
});

document.getElementById('chat').addEventListener('click', () => {
  window.location.href = 'group_chat.html';
});

