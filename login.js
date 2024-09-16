document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Implement your login logic here. This is just a placeholder.
    if (username === 'admin' && password === 'admin') {
        window.location.href = 'admin_dashboard.html'; 
    } else {
        alert('Invalid username or password');
    }
});
