const apiUrl = "http://10.110.69.13:8081/api";

// Function to check if user is logged in 
function isLoggedIn() {
    const authToken = localStorage.getItem("");
    return authToken !== null;
}

// Function to display data
function displayData() {
    const authToken = localStorage.getItem("tungtv_authen_token");
    if (!authToken) {
        console.error("No Auth Token found.");
        return;
    }

    fetch(apiUrl + "/shoes/1125", {
        method: "GET",
        headers: {
            "TUNGTV_AUTHEN_TOKEN": authToken
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            const dataList = document.getElementById("dataList");
            dataList.innerHTML = "";
            data.forEach(item => {
                const li = document.createElement("li");
                li.textContent = item;
                dataList.appendChild(li);
            });
        })
        .catch(error => console.error("Error fetching data:", error));
}

// Check if user is logged in on page load
window.onload = function () {
    if (isLoggedIn()) {
        // If logged in, hide login/register forms and show data container
        document.getElementById("container").style.display = "none";
        document.getElementById("dataContainer").style.display = "block";
        displayData();
    }
}

document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    fetch(apiUrl + "/get_token_auth", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: email, password: password })
    })
        .then(response => response.json())
        .then(data => {
            const authToken = data["tungtv_authen_token"];
            localStorage.setItem("tungtv_authen_token", authToken);

            // Hide login/register forms and show data container
            document.getElementById("container").style.display = "none";
            document.getElementById("dataContainer").style.display = "block";

            // Display data after login
            displayData();
        })
        .catch(error => console.error("Error logging in:", error));
});

document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("registerName").value;
    const email = document.getElementById("registerEmail").value;
    const password = document.getElementById("registerPassword").value;

    fetch(apiUrl + "/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username: email, password: password })
    })
        .then(response => response.json())
        .then(data => {
            console.log("Registration successful:", data);
        })
        .catch(error => console.error("Error registering:", error));
});
