const API_URL = "http://localhost:3000/auth"; // Backend API Base URL

/**
 * @desc Register a new user
 * @usage Called from register.html form submission
 */
async function registerUser(event) {
    event.preventDefault(); // Prevent page reload

    const username = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!username || !email || !password) {
        showError("All fields are required!");
        return;
    }

    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        hideError();
        alert("Registration successful! Redirecting to login...");
        window.location.href = "login.html";
    } else {
        showError(data.message || "Registration failed!");
    }
}

/**
 * @desc Login a user
 * @usage Called from login.html form submission
 */
async function loginUser(event) {
    event.preventDefault(); // Prevent page reload

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        showError("Both email and password are required!");
        return;
    }

    const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
        localStorage.setItem("token", data.token); // Store JWT token
        hideError();
        alert("Login successful! Redirecting to dashboard...");
        updateNavBar(); // Update the navigation bar
        window.location.href = "dashboard.html";
    } else {
        showError(data.message || "Login failed! Check your credentials.");
    }
}

/**
 * @desc Logout the user
 * @usage Called when clicking the logout button
 */
function logout() {
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    updateNavBar(); // Update the navigation bar
    window.location.href = "index.html"; // Redirect to home page
}

// Attach event listeners if the elements exist
document.getElementById("registerForm")?.addEventListener("submit", registerUser);
document.getElementById("loginForm")?.addEventListener("submit", loginUser);
