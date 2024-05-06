const apiUrl = "http://10.110.69.13:8081/api";

// Function to check if user is logged in 
function isLoggedIn() {
    const authToken = localStorage.getItem("tungtv_authen_token");
    return authToken !== null;
}

// Function to display data
function displayData() {
    const authToken = localStorage.getItem("tungtv_authen_token");
    if (!authToken) {
        console.error("No Auth Token found.");
        return;
    }
    //show list shoe
    showShoes(authToken);

    //search id shoe
    search(authToken);
   

}


//show list shoes
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchResults = document.getElementById("searchResults");

function searchWithAuth(authToken) {
    searchID(authToken);
}

function search(authToken) {
    document.getElementById("searchButton").addEventListener("click", function () {
        searchWithAuth(authToken);

    });
}

function searchID(authToken) {
    var input, searchID
    input = document.getElementById('searchInput');
    searchID = input.value;
    console.log(searchID);


    // Xóa các kết quả tìm kiếm trước đó
    searchResults.innerHTML = '';
    Options = {
        method: "GET",
        headers: {
            "TUNGTV_AUTHEN_TOKEN": authToken
        }
    }
    // Gửi yêu cầu tới API
    fetch('http://10.110.69.13:8081/api/shoes/' + searchID, Options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(`data - search id ${data}`);
            productList.style.display = "none";
            pagination.style.display = "none";

            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${data.id}</td>
                        <td>${data.name}</td>
                        <td>${data.price}</td>
                        <td>${data.category}</td>
                        <td>
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                     `;
            searchResults.appendChild(row);
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}

function showShoes(authToken) {
    let currentPage = 1; // Current page
    const maxPagesToShow = 10; // Maximum number of pages to show

    // Function to fetch products for a specific page
    function fetchProducts(page) {
        Options = {
            method: "GET",
            headers: {
                "TUNGTV_AUTHEN_TOKEN": authToken
            }
        }

        //API-pagination list
        fetch(`http://10.110.69.13:8081/api/shoes?page=${page}`, Options)
            .then(response => {
                if (response.status !== 401) {
                    return response.json();
                }
                alert("Unauthen!!!");
                logout();

            })
            .then(data => {
                displayProducts(data.users); // Display products
                displayPagination(page, data.total_pages); // Display pagination controls
            })
            .catch(error => {
                console.error('Error fetching products:', error);
            })
    }

    // Function to display products
    function displayProducts(data) {
        console.log(data);
        productList.innerHTML = ""; // Clear previous content

        // Populate productList with product data from the API
        data.forEach(product => {
            const row = document.createElement("tr");
            row.innerHTML = `
                        <td>${product.id}</td>
                        <td>${product.name}</td>
                        <td>${product.price}</td>
                        <td>${product.categories}</td>
                        <td>
                            <button class="edit-btn">Edit</button>
                            <button class="delete-btn">Delete</button>
                        </td>
                     `;
            productList.appendChild(row);
        });
    }

    // Function to display pagination controls
    function displayPagination(currentPage, totalPages) {
        pagination.innerHTML = ""; // Clear previous pagination controls

        // Calculate start and end page numbers based on current page and maxPagesToShow
        let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
        let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

        // If endPage is less than maxPagesToShow, adjust startPage accordingly
        if (endPage - startPage + 1 < maxPagesToShow) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1);
        }

        // Add previous page button
        addButton("Prev", currentPage - 1);

        // Add page buttons with ellipsis if necessary
        if (startPage > 1) {
            addButton(1, 1);
            if (startPage > 2) {
                pagination.appendChild(createEllipsis());
            }
        }
        for (let i = startPage; i <= endPage; i++) {
            addButton(i, i);
        }
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                pagination.appendChild(createEllipsis());
            }
            addButton(totalPages, totalPages);
        }

        // Add next page button
        addButton("Next", currentPage + 1);
    }

    // Function to create a button with page number or ellipsis
    function addButton(text, page) {
        const button = document.createElement("button");
        button.textContent = text;
        if (text === currentPage) {
            button.classList.add("active");
        }
        button.addEventListener("click", () => {
            if (page !== currentPage) {
                currentPage = page;
                fetchProducts(page);
            }
        });
        pagination.appendChild(button);
    }

    // Function to create an ellipsis button
    function createEllipsis() {
        const ellipsis = document.createElement("button");
        ellipsis.textContent = "...";
        ellipsis.disabled = true;
        return ellipsis;
    }

    // Initial page load
    fetchProducts(currentPage);
}

//function log out
function logout() {
    localStorage.removeItem("tungtv_authen_token");
    location.reload();
}



// Check if user is logged in on page load
window.onload = function () {
    if (isLoggedIn()) {
        // If logged in, hide login/register forms and show data container
        document.getElementById("container").style.display = "none";
        document.getElementById("dataContainer").style.display = "block";
        displayData();
    }
    else {
        document.getElementById("container").style.display = "block";
        document.getElementById("dataContainer").style.display = "none";
    }
}

//Log in
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

//Register
document.getElementById("registerForm").addEventListener("submit", function (event) {
    event.preventDefault();

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
            alert("Registration successful:", data);
        })
        .catch(error => console.error("Error registering:", error));
});

//Log out
document.getElementById("logoutButton").addEventListener("click", logout);



