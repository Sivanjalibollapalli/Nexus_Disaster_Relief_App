document.addEventListener('DOMContentLoaded', function () {
    // Fill the date automatically
    const dateElement = document.getElementById('agreement-date');
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    dateElement.textContent = formattedDate;

    // Close button functionality
    document.getElementById('close-agreement').addEventListener('click', function () {
        history.back();
    });
});
	