document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.amount-btn').forEach(button => {
        button.addEventListener('click', function() {
            document.getElementById('custom-amount').value = this.getAttribute('data-amount');
        });
    });

    document.getElementById('donate-btn').addEventListener('click', submitDonation);
});

function submitDonation() {
    const amount = document.getElementById('custom-amount').value;
    const designation = document.getElementById('designation').value;
    const frequency = document.querySelector('input[name="frequency"]:checked').value;
    const name = document.getElementById('donor-name').value;
    const contact = document.getElementById('donor-contact').value;
    const email = document.getElementById('donor-email').value;
    const organization = document.querySelector('input[name="organization"]:checked').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid donation amount.');
        return;
    }

    if (!name || !contact || !email) {
        alert('Please fill in all the required donor information.');
        return;
    }

    const donationData = {
        amount,
        designation,
        frequency,
        name,
        contact,
        email,
        organization
    };

    fetch('donate_now_handler.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(donationData)
    })
    .then(response => response.text())
    .then(text => {
        try {
            return JSON.parse(text);
        } catch (e) {
            console.error('Server response was not valid JSON:', text);
            throw new Error('Invalid JSON response from server');
        }
    })
    .then(data => {
        if (data.status === 'success') {
            const thankYouPopup = document.getElementById('thank-you-popup');
            thankYouPopup.querySelector('p').textContent = `You've successfully donated $${amount}. Your generous contribution helps us provide crucial resources to those in need. You will receive the receipt via email within 48 hours.`;
            thankYouPopup.style.display = 'flex';
        } else {
            console.error('Server responded with error:', data.message);
            alert('There was an error processing your donation: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('There was an error processing your donation. Please check the console for more details.');
    });
}

document.getElementById('close-popup-btn').addEventListener('click', function() {
    document.getElementById('thank-you-popup').style.display = 'none';
    location.href = 'home.html';
});