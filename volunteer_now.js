// Handle location detection
document.getElementById('detect-location-btn').addEventListener('click', function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            document.getElementById('location').value = `Lat: ${position.coords.latitude}, Lon: ${position.coords.longitude}`;
        }, function () {
            alert('Unable to detect location');
        });
    } else {
        alert('Geolocation not supported');
    }
});

// Toggle specific schedule visibility based on flexible schedule checkbox
document.getElementById('flexible-schedule').addEventListener('change', function () {
    const specificSchedule = document.getElementById('specific-schedule');
    if (this.checked) {
        specificSchedule.style.display = 'none';
    } else {
        specificSchedule.style.display = 'block';
    }
});

// Initially show the specific schedule
document.getElementById('specific-schedule').style.display = 'block';

// Handle volunteer sign up
document.getElementById('sign-up-btn').addEventListener('click', function () {
    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const location = document.getElementById('location').value;
    const flexibleSchedule = document.getElementById('flexible-schedule').checked;
    const availableDays = Array.from(document.querySelectorAll('.days-selection input:checked')).map(input => input.value);
    const availableTimes = document.getElementById('available-times').value;
    const skills = Array.from(document.querySelectorAll('.skills-selection input:checked')).map(input => input.value);
    const additionalSkills = document.getElementById('additional-skills').value;

    if (!name || !contact) {
        alert('Please fill in your name and contact number.');
        return;
    }

    if (skills.length === 0 && additionalSkills.trim() === '') {
        alert('Please select or enter at least one skill.');
        return;
    }

    const volunteerData = {
        name,
        contact,
        location,
        flexibleSchedule,
        availableDays,
        availableTimes,
        skills,
        additionalSkills
    };

    // Send the volunteer data to the server
    fetch('volunteer_now_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(volunteerData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        if (data.status === 'success') {
            // Show thank you popup
            const thankYouPopup = document.getElementById('thank-you-popup');
            thankYouPopup.querySelector('p').textContent = `Thank you, ${name}. We will contact you soon with more details.`;
            thankYouPopup.style.display = 'flex';
        } else {
            console.error('Server responded with error:', data.message);
            alert('There was an error processing your sign-up: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Fetch Error:', error);
        alert('There was an error processing your sign-up. Please check the console for more details.');
    });
});

// Close the popup and redirect to home page
document.getElementById('close-popup-btn').addEventListener('click', function () {
    document.getElementById('thank-you-popup').style.display = 'none';
    location.href = 'home.html';
});
