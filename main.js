document.getElementById("loginForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Ngăn form submit mặc định

  // Lấy giá trị của email và password
  var username = document.getElementById("loginEmail").value;
  var password = document.getElementById("loginPassword").value;

  // In ra console để kiểm tra
  console.log("username: " + username);
  console.log("Password: " + password);
  // Set up query parameters
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    "username": username,
    "password": password
  });

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow"
  };

  fetch("http://10.110.69.13:8081/api/get_token_auth", requestOptions)
    .then((response) => response.text())
    .then((result) => console.log(result))
    .catch((error) => console.error(error));
});