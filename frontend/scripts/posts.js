const API_URL = "http://localhost:3000/posts"; // Backend API Base URL
let editingPostId = null; // Stores the post ID currently being edited

/**
 * @desc Fetch all public posts and display them
 * @usage Called on the homepage (index.html)
 */
async function fetchPosts() {
    try {
        const response = await fetch(API_URL);
        const posts = await response.json();

        renderPosts(posts); // Render the fetched posts
    } catch (error) {
        console.error("Error fetching posts:", error);
        showError("Failed to fetch posts. Please try again later.");
    }
}

/**
 * @desc Fetch only the logged-in user's posts and display them in the "Your Posts" section (Dashboard)
 */
async function fetchUserPosts() {
    const token = localStorage.getItem("token");
    if (!token) {
        showError("You need to log in first!");
        window.location.href = "login.html";
        return;
    }

    try {
        const response = await fetch(`${API_URL}/mine`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const posts = await response.json();
        console.log("Fetched posts:", posts); // Debugging
        renderPosts(posts); // Render the fetched posts
    } catch (error) {
        console.error("Error fetching user posts:", error);
        showError("Failed to fetch your posts. Please try again later.");
    }
}

/**
 * @desc Handles form submission (creates or updates post)
 * @param {Event} event - Form submit event
 */
async function handlePostForm(event) {
    event.preventDefault();
    const token = localStorage.getItem("token");

    const title = document.getElementById("title").value.trim();
    const content = document.getElementById("content").value.trim();

    if (!title || !content) {
        showError("Title and content cannot be empty.");
        return;
    }

    try {
        if (editingPostId) {
            // Update existing post
            const response = await fetch(`${API_URL}/${editingPostId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                hideError();
                alert("Post updated successfully!");
                resetPostForm();
                await fetchUserPosts(); // Refresh posts
            } else {
                showError("Failed to update post.");
            }

        } else {
            // Create a new post
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ title, content })
            });

            if (response.ok) {
                hideError();
                alert("Post created successfully!");
                resetPostForm();
                await fetchUserPosts(); // Refresh posts
            } else {
                showError("Failed to create post.");
            }
        }
    } catch (error) {
        console.error("Error saving post:", error);
        showError("Failed to save post. Please try again later.");
    }
}

/**
 * @desc Edit a post (Prefill form with post data)
 * @param {string} postId - The ID of the post to edit
 */
async function editPost(postId) {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(`${API_URL}/${postId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const post = await response.json();

        // Prefill form fields
        document.getElementById("title").value = post.title;
        document.getElementById("content").value = post.content;

        // Change button text and behavior
        document.getElementById("submitPost").innerText = "Update Post";
        editingPostId = postId; // Store post ID being edited

    } catch (error) {
        console.error("Error fetching post:", error);
        showError("Failed to fetch post for editing. Please try again later.");
    }
}

/**
 * @desc Delete a post
 * @param {string} postId - The ID of the post to delete
 */
async function deletePost(postId) {
    const token = localStorage.getItem("token");

    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
        const response = await fetch(`${API_URL}/${postId}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.ok) {
            hideError();
            alert("Post deleted successfully!");
            fetchUserPosts();
        } else {
            showError("Failed to delete post.");
        }
    } catch (error) {
        console.error("Error deleting post:", error);
        showError("Failed to delete post. Please try again later.");
    }
}

/**
 * @desc Reset the post form after creation or update
 */
function resetPostForm() {
    document.getElementById("postForm").reset();
    document.getElementById("submitPost").innerText = "Create Post";
    editingPostId = null; // Clear edit mode
}

// Load posts on page load if the posts container exists
if (document.getElementById("posts")) {
    if (window.location.pathname.includes("dashboard.html")) {
        fetchUserPosts(); // Fetch only user posts in dashboard
    } else {
        fetchPosts(); // Fetch all posts in homepage
    }
}

// Attach event listener for post creation if form exists
document.getElementById("postForm")?.addEventListener("submit", handlePostForm);

/**
 * @desc Show error message
 * @param {string} message - Error message to display
 */
function showError(message) {
    const errorElement = document.getElementById("error-message");
    errorElement.textContent = message;
    errorElement.style.display = "block";
}

/**
 * @desc Hide error message
 */
function hideError() {
    const errorElement = document.getElementById("error-message");
    errorElement.style.display = "none";
}
