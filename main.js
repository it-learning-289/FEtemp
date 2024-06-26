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
    showShoes("",authToken);

    //search id shoe
    search(authToken);

    //add product
    handleAddShoe(authToken);

    //handle filter shoe
    handleFilterShoe(authToken) ;


}

//show list shoes
const productList = document.getElementById("productList");
const pagination = document.getElementById("pagination");
const searchResults = document.getElementById("searchResults");
const filterResults = document.getElementById("filterResults");

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
                            <button class="edit-btn" editShoe-id="${data.id}">Edit</button>
                            <button class="delete-btn" delShoe-id="${data.id}">Delete</button>
                        </td>
                     `;
            searchResults.appendChild(row);

            //handle delete shoe
            handleDelShoe(authToken);
        
            //handle edit shoe
            handleEditShoe(authToken);

        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
}
//handle submit for filter shoe

function handleFilterShoe(authToken) {

    document.getElementById("filterPriceForm").addEventListener("submit", function(event) {
        var page=1;
        event.preventDefault(); // Prevent form submission
        var minPrice = document.getElementById("minPriceRange").value;
        var maxPrice = document.getElementById("maxPriceRange").value;
        // var page=1;
        // You can handle the form data here, for example, filter the products by price range
        console.log("Min Price: " + minPrice);
        console.log("Max Price: " + maxPrice);
        
        // Optionally, hide the filter panel after applying the filter
        document.getElementById("filterPricePanel").style.display = "none";
        showShoes(`&min_number=${minPrice}&max_number=${maxPrice}`,authToken);
          
    })
}
function showShoes(key,authToken) {
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
        
        //  // Gửi yêu cầu tới API
        //  fetch(`http://10.110.69.13:8081/api/shoes?page=${page}&min_number=${minPrice}&max_number=${maxPrice}`, Options)
        //  .then(response => {
        //      if (response.status !== 401) {
        //          return response.json();
        //      }
        //      alert("Unauthen!!!");
        //      logout();

        //  })
        //  .then(data => {
        //      displayProducts(data.users); // Display products
        //      displayPagination(page, data.total_pages); // Display pagination controls
        //  })
        //  .catch(error => {
        //      console.error('Error fetching products:', error);
        //  })
            

        //API-pagination list
        fetch(`http://10.110.69.13:8081/api/shoes?page=${page}${key}`, Options)
        // fetch(, Options)
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

    // Function to display list products
    function displayProducts(data) {
        // console.log(data);
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
                            <button class="edit-btn" editShoe-id="${product.id}">Edit</button>
                            <button class="delete-btn" delShoe-id="${product.id}">Delete</button>
                        </td>
                     `;
            productList.appendChild(row);
        });

        //handle delete shoe
        handleDelShoe(authToken);

        //handle edit shoe
        handleEditShoe(authToken);

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
                // fetchProducts(page);
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

//handle deleteShoe
function handleDelShoe(authToken) {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    // console.log(deleteButtons);
    deleteButtons.forEach(button => {
        button.addEventListener('click', function () {
            const productId = this.getAttribute('delShoe-id');
            console.log(productId);
            deleteShoe(authToken, productId);

        });
    });
}



//handle edit shoe
function handleEditShoe(authToken) {

    //  handle submition edit
    const editButtons = document.querySelectorAll('.edit-btn');
    editButtons.forEach(button => {
        button.addEventListener('click', function () {
            const grandparentButton = button.parentElement.parentElement;
            console.log(grandparentButton);
            const productId = this.getAttribute('editShoe-id');
            console.log(productId);
            openEditProductModal();

            const tds = grandparentButton.querySelectorAll('td');

            // Loop through all <td> elements and get their values
            const values = [];
            tds.forEach(td => {
                values.push(td.textContent.trim());
            });
            
            let form  = document.querySelector("#editProductForm");
            // console.log(form.querySelector("#productCategory"));
            form.querySelector("#productName").value= values[1];
            form.querySelector("#productPrice").value= values[2];
            form.querySelector("#productCategory").value= values[3];

            //listen submit form edit 
            form.addEventListener("submit", function (event) {
                event.preventDefault(); // Prevent form submission
                var name = form.querySelector("#productName").value;
                var price = form.querySelector("#productPrice").value;
                var category = form.querySelector("#productCategory").value;

                let product = {
                    "name": name,
                    "price": price,
                    "category": category
                };
        
                console.log(product);
                editShoe(authToken,productId,product);
            });

        });
    });
}

// Handle form submission for add product
function handleAddShoe(authToken) {
    let addButton = document.getElementById("addProductForm");
    addButton.addEventListener("submit", function (event) {
        event.preventDefault(); // Prevent form submission
        var name = document.getElementById("productName");
        var price = document.getElementById("productPrice");
        var category = document.getElementById("productCategory").value;
        console.log(isNaN(price.value));
        // const errorMessage = document.getElementById('error-message');
        // const errorMessage = document.getElementsByClassName('error-message');
        // console.log(errorMessage);
        if (isNaN(price.value)) {
            addButton.classList.add('was-validated');
            showToast("invalid");
        } 
        else {
            // price.classList.remove('error');
            // errorMessage.style.display = 'none';
            let product = {
                "name": name.value,
                "price": price.value,
                "category": category
            };
    
            // console.log(product);
            addShoe(authToken, product);
    
            // Close the modal after form submission (optional)
            showToast("adding success.");
            setTimeout(function () {
                modal.style.display = "none";
                location.reload();
            }, 1500); // Close modal after 2 seconds (2000 milliseconds        
    
        }

        
    });
}



//function add shoe
function addShoe(authToken, product) {
    Options = {
        method: "POST",
        headers: {
            "TUNGTV_AUTHEN_TOKEN": authToken
        },
        body: JSON.stringify({ name: product.name, price: product.price, category: product.category })
    }
    // Gửi yêu cầu tới API
    fetch('http://10.110.69.13:8081/api/shoes/', Options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        })
}


//function delete shoe
function deleteShoe(authToken, id) {
    Options = {
        method: "DELETE",
        headers: {
            "TUNGTV_AUTHEN_TOKEN": authToken
        }
    }
    // Gửi yêu cầu tới API
    fetch('http://10.110.69.13:8081/api/shoes/' + id, Options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showToast("delete success");
            setTimeout(() => {
                location.reload();
            }, 1000)
        })
}

//function edit shoe
function editShoe(authToken, id, product) {
    Options = {
        method: "PATCH",
        headers: {
            "TUNGTV_AUTHEN_TOKEN": authToken
        },
        body: JSON.stringify({ name: product.name, price: product.price, category: product.category })
    }
    // Gửi yêu cầu tới API
    fetch('http://10.110.69.13:8081/api/shoes/' + id, Options)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            showToast("edit success");
            setTimeout(() => {
                location.reload();
            }, 1000)
        })
}

// Function to open Edit Product modal
function openEditProductModal(productId) {
    var editModal = document.getElementById("editProductModal");
    editModal.style.display = "block";

    // Populate the form fields with product data for editing
    // You may need to fetch product data based on productId and populate the form fields accordingly
}

// Function to close Edit Product modal
function closeEditProductModal() {
    var editModal = document.getElementById("editProductModal");
    editModal.style.display = "none";
}

//function log out
function logout() {
    localStorage.removeItem("tungtv_authen_token");
    location.reload();
}

//show toast - message
function showToast(message) {
    var toast = document.getElementById("toast");
    toast.innerHTML = message;
    toast.className = "toast show";
    setTimeout(function () {
        toast.className = toast.className.replace("show", "");
    }, 3000);
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

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("addProductBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function () {
    modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
    modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// Event listener for closing Edit Product modal (click on close button)
document.querySelector("#editProductModal .close").addEventListener("click", function () {
    closeEditProductModal();
});

// Event listener for closing Edit Product modal (click outside the modal)
window.addEventListener("click", function (event) {
    var editModal = document.getElementById("editProductModal");
    if (event.target == editModal) {
        closeEditProductModal();
    }
});

// Event listener for form submission
document.getElementById("editProductForm").addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission
    // Get form data and handle it accordingly
    closeEditProductModal();
});



// Toggle the display of the filter panel
document.getElementById("filterPriceBtn").addEventListener("click", function() {
    var filterPanel = document.getElementById("filterPricePanel");
    if (filterPanel.style.display === "none" || filterPanel.style.display === "") {
        filterPanel.style.display = "block";
    } else {
        filterPanel.style.display = "none";
    }
});

// Update the displayed price range values and ensure ranges do not overlap
function updatePriceRange() {
    var minPriceRange = document.getElementById("minPriceRange");
    var maxPriceRange = document.getElementById("maxPriceRange");
    
    var minPrice = parseInt(minPriceRange.value);
    var maxPrice = parseInt(maxPriceRange.value);
    
    // Ensure the min value is always less than the max value
    if (minPrice > maxPrice) {
        minPriceRange.value = maxPrice;
        minPrice = maxPrice;
    }
    
    document.getElementById("minPriceLabel").textContent = minPrice;
    document.getElementById("maxPriceLabel").textContent = maxPrice;
}





//Log out
document.getElementById("logoutButton").addEventListener("click", logout);



document.getElementById("dropdownButton").addEventListener("click", function(event) {
    event.stopPropagation(); // Prevent the event from bubbling up to the window click handler
    document.querySelector(".dropdown-container").classList.toggle("show");
});

window.onclick = function(event) {
    if (!event.target.matches('.dropdown-btn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        for (var i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.parentNode.classList.contains('show')) {
                openDropdown.parentNode.classList.remove('show');
            }
        }
    }
};