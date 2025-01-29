document.getElementById('login-button').addEventListener('click', function() {
    const password = document.getElementById('password-input').value;
    const errorMessage = document.getElementById('error-message');

    // Simple password (replace 'adminpassword' with your actual password)
    if (password === 'admin') {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-section').style.display = 'block';
    } else {
        errorMessage.textContent = 'Incorrect password. Please try again.';
    }
});

document.getElementById('open-admin-ui').addEventListener('click', function() {
    // Open the admin page in a new tab
    chrome.tabs.create({ url: 'admin.html' });
});
