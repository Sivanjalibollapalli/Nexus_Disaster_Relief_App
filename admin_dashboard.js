document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
      e.preventDefault();
      const targetSectionId = this.getAttribute('href').substring(1);
      document.querySelectorAll('.content-section').forEach(section => {
          section.classList.remove('active');
          if (section.id === targetSectionId) {
              section.classList.add('active');
          }
      });
      document.querySelectorAll('.nav-link').forEach(nav => {
          nav.classList.remove('active');
      });
      link.classList.add('active');
  });
});

document.querySelectorAll('.add-supplies-btn').forEach(button => {
  button.addEventListener('click', function() {
      const resourceId = this.getAttribute('data-id');
      const quantityCell = this.closest('tr').querySelector('.quantity');
      const currentQuantity = parseInt(quantityCell.textContent);

      const amountToAdd = parseInt(prompt('Enter the amount of supplies to add:'));

      if (!isNaN(amountToAdd) && amountToAdd > 0) {
          const newQuantity = currentQuantity + amountToAdd;
          quantityCell.textContent = newQuantity;
          alert(`Successfully added ${amountToAdd} supplies to ${resourceId}. New total: ${newQuantity}`);
      } else {
          alert('Invalid input. Please enter a positive number.');
      }
  });
});

document.getElementById('dashboard').classList.add('active');

document.getElementById('logout').addEventListener('click', function () {
  document.getElementById('logoutModal').style.display = 'flex';
});

document.getElementById('confirmLogout').addEventListener('click', function () {
  window.location.href = 'login.html';
});

document.getElementById('cancelLogout').addEventListener('click', function () {
  document.getElementById('logoutModal').style.display = 'none';
});

// admin_dashboard.js

// admin_dashboard.js

let lastCounts = {
  requests: 0,
  sos: 0,
  donations: 0,
  volunteers: 0,
  resources: 0
};

function fetchDataAndUpdate() {
  fetch('fetch_data.php')
      .then(response => {
          if (!response.ok) {
              throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
      })
      .then(data => {
          console.log("Received data:", data);  // Log the received data
          
          if (!data || typeof data !== 'object') {
              throw new Error('Invalid data received from server');
          }

          if (data.error) {
              throw new Error(data.error);
          }

          populateTable('requestsTable', data.requests || []);
          populateTable('sosTable', data.sos || []);
          populateTable('donationsTable', data.donations || []);
          populateTable('volunteersTable', data.volunteers || []);
          populateTable('resourcesTable', data.resources || []);

          if (data.counts) {
              updateDashboardCounts(data.counts);
              checkForNewEntries(data.counts);
          } else {
              console.warn('Counts data is missing');
          }
      })
      .catch(error => {
          console.error('Error fetching data:', error);
          // Optionally, show an error message to the user
          showErrorNotification('Failed to fetch updated data. Please check your connection and try again.');
      });
}

function populateTable(tableId, data) {
  const tableBody = document.getElementById(tableId).querySelector('tbody');
  if (!tableBody) {
      console.error(`Table body not found for table: ${tableId}`);
      return;
  }
  tableBody.innerHTML = '';
  data.forEach(row => {
      const tr = document.createElement('tr');
      for (const key in row) {
          const td = document.createElement('td');
          td.textContent = row[key];
          tr.appendChild(td);
      }
      tableBody.appendChild(tr);
  });
}

function updateDashboardCounts(counts) {
  const countElements = {
      requests: document.getElementById('requestCount'),
      sos: document.getElementById('sosCount'),
      donations: document.getElementById('donationCount'),
      volunteers: document.getElementById('volunteerCount'),
      resources: document.getElementById('resourceCount')
  };

  for (const [key, element] of Object.entries(countElements)) {
      if (element && counts[key] !== undefined) {
          element.textContent = counts[key];
      } else if (!element) {
          console.warn(`Element not found for count: ${key}`);
      }
  }
}

function checkForNewEntries(counts) {
  for (const [key, count] of Object.entries(counts)) {
      if (count > lastCounts[key]) {
          showNotification(key);
          lastCounts[key] = count;
      }
  }
}

function showNotification(type) {
  const modal = document.getElementById('notificationModal');
  const messageElement = document.getElementById('notificationMessage');
  const goToSectionBtn = document.getElementById('goToSection');

  if (!modal || !messageElement || !goToSectionBtn) {
      console.error('Notification elements not found');
      return;
  }

  let message = '';
  let sectionId = '';

  switch(type) {
      case 'requests':
          message = "Attention Needed: A new request for assistance has been submitted. Please review the details and take action.";
          sectionId = 'requests';
          break;
      case 'sos':
          message = "Urgent Action Required: A new SOS request has been received. This may indicate a critical situation. Respond immediately.";
          sectionId = 'sos-requests';
          break;
      case 'donations':
          message = "Generous Support Received: A new donation has been made to the relief effort!";
          sectionId = 'donations';
          break;
      case 'volunteers':
          message = "Reinforcements Arrived: A new volunteer has joined the team. Utilize their skills to effectively manage resources.";
          sectionId = 'volunteers';
          break;
      default:
          console.warn(`Unknown notification type: ${type}`);
          return;
  }

  messageElement.textContent = message;
  modal.style.display = 'flex';

  goToSectionBtn.onclick = function() {
      modal.style.display = 'none';
      const sectionLink = document.querySelector(`a[href="#${sectionId}"]`);
      if (sectionLink) {
          sectionLink.click();
      } else {
          console.warn(`Section link not found for: ${sectionId}`);
      }
  };
}

function showErrorNotification(message) {
  const modal = document.getElementById('notificationModal');
  const messageElement = document.getElementById('notificationMessage');
  const goToSectionBtn = document.getElementById('goToSection');

  if (!modal || !messageElement) {
      console.error('Error notification elements not found');
      return;
  }

  messageElement.textContent = message;
  modal.style.display = 'flex';

  if (goToSectionBtn) {
      goToSectionBtn.style.display = 'none';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const dismissButton = document.getElementById('dismissNotification');
  if (dismissButton) {
      dismissButton.addEventListener('click', function() {
          const modal = document.getElementById('notificationModal');
          if (modal) {
              modal.style.display = 'none';
          }
      });
  } else {
      console.warn('Dismiss notification button not found');
  }

  // Initial data fetch
  fetchDataAndUpdate();

  // Set up auto-refresh every 5 seconds (increased from 2 to reduce server load)
  setInterval(fetchDataAndUpdate, 5000);
});

console.log("Script loaded and running");