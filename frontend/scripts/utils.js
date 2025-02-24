/**
 * @desc Get stored JWT token from localStorage
 * @returns {string|null} JWT token or null if not found
 */
function getToken() {
    return localStorage.getItem("token");
}

/**
 * @desc Save user token to localStorage
 * @param {string} token - JWT token to be stored
 */
function saveToken(token) {
    localStorage.setItem("token", token);
}

/**
 * @desc Remove user token from localStorage (Logout)
 */
function removeToken() {
    localStorage.removeItem("token");
}

/**
 * @desc Check if the user is logged in
 * @returns {boolean} - Returns true if logged in, otherwise false
 */
function isLoggedIn() {
    return !!getToken();
}

/**
 * @desc Redirect to login page if user is not authenticated
 */
function protectPage() {
    if (!isLoggedIn()) {
        showError("You must be logged in to access this page.");
        window.location.href = "login.html";
    }
}

/**
 * @desc Fetch logged-in user details
 * @returns {Promise<Object|null>} - Returns user object if valid token exists, otherwise null
 */
async function getUser() {
    const token = getToken();
    if (!token) return null;

    try {
        const response = await fetch("http://localhost:3000/auth/profile", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            const user = await response.json();
            localStorage.setItem("user", JSON.stringify(user)); // Store user details
            return user;
        } else {
            removeToken(); // Invalid token, remove it
            return null;
        }
    } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
    }
}

/**
 * @desc Get stored user details from localStorage
 * @returns {Object|null} - Returns user object if found, otherwise null
 */
function getStoredUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

/**
 * @desc Logout the user
 */
function logout() {
    removeToken();
    localStorage.removeItem("user");
    alert("Logged out successfully!");
    updateNavBar(); // Обновите навигационную панель
    window.location.href = "index.html"; // Перенаправьте на главную страницу
}

/**
 * @desc Display user info on dashboard
 * @usage Called on dashboard page load
 */
async function displayUserInfo() {
    const user = await getUser();
    if (user) {
        document.getElementById("user-info").innerHTML = `
            <h2>Welcome, ${user.username}!</h2>
            <p>Email: ${user.email}</p>
            <button onclick="logout()">Logout</button>
        `;
    } else {
        protectPage();
    }
}

/**
 * @desc Update the navigation bar based on login status
 */
function updateNavBar() {
    const loginLink = document.getElementById("loginLink");
    const registerLink = document.getElementById("registerLink");
    const logoutButton = document.getElementById("logoutButton");

    if (isLoggedIn()) {
        loginLink.style.display = "none";
        registerLink.style.display = "none";
        logoutButton.style.display = "inline-block";
    } else {
        loginLink.style.display = "inline-block";
        registerLink.style.display = "inline-block";
        logoutButton.style.display = "none";
    }
}

/**
 * @desc Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = message;
    errorMessage.style.display = "block";
}

/**
 * @desc Hide error message
 */
function hideError() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "none";
}

// Redirect user to dashboard if already logged in (Prevents accessing login/register when logged in)
if (isLoggedIn() && (window.location.pathname.includes("login") || window.location.pathname.includes("register"))) {
    window.location.href = "dashboard.html";
}

// Вызовите эту функцию при загрузке страницы
window.addEventListener("load", updateNavBar);
