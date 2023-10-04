
document.addEventListener("DOMContentLoaded", function () {

  const formUrlInput = document.getElementById("form-url");
  const fillDetailsButton = document.querySelector(".fill-details-btn");

  // Function to enable or disable the button based on the input field value
  function toggleFillButton() {
    if (formUrlInput.value.trim() === "") {
      fillDetailsButton.disabled = true;
    } else {
      fillDetailsButton.disabled = false;
    }
  }
  formUrlInput.addEventListener("input", toggleFillButton);

  toggleFillButton();
});

function validateUrl(url) {
  return /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/.test(url);
}

let images = [];

function showSubmittedFields() {
  const div = document.getElementById("hello");

  images.forEach((url) => {
    const img = document.createElement("img");
    img.src = url;
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.appendChild(img);

    div.appendChild(anchor);
  });
}

const closeModalBtn = document.querySelector("#closeModalBtn");
// console.log(closeModalBtn);
const modal = document.getElementById("myModal");

//Open Modal when showModal function is called
function showModal(message) {
  document.getElementById("modal-title").innerText = "Error";
  document.getElementById("modal-content").innerText = message;
  modal.style.display = "block";
}

// Close the modal when the close button (×) is clicked
closeModalBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

// Close the modal when the user clicks outside of it
window.addEventListener("click", function (event) {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});

function fillForm() {
  var loadingOverlay = document.querySelector(".loading-overlay");

  loadingOverlay.style.display = "flex";
  var formUrl = document.getElementById("form-url").value;
  var errorMessage = document.getElementById("error-message");

  if (!validateUrl(formUrl)) {
    errorMessage.innerText = "Please enter a valid URL";
    return;
  }

  errorMessage.innerText = "";

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/api/fill-details", true);
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
  xhr.onload = function () {
    loadingOverlay.style.display = "none";

    if (xhr.status >= 200 && xhr.status < 400) {
      var response = JSON.parse(xhr.responseText);
      var data = response.data;
      let imageUrls = [];

      images = imageUrls;

      for (let i = 0; i < data.length; i++) {
        imageUrls.push(window.location.href + `${data[i]}`);
      }

      document.body.innerHTML = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Form Submission Success</title>
          <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f8f9fa;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            overflow-y: auto;
            
        }
        .container {
            max-width: 400px;
            background-color: #fff;
            border-radius: 10px;
            padding: 40px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        h1 {
            color: #343a40;
            margin-bottom: 20px;
        }
        p {
            font-size: 18px;
            color: #6c757d;
            margin-bottom: 30px;
        }
        .wrapper {
          display: flex;
          flex-direction: column;
          gap : 2vh;
          align-items: center;
        }
        .success-icon {
            font-size: 80px;
            color: #28a745;
            margin-bottom: 20px;
            display: block;
            margin-left: auto;
            margin-right: auto;
        }
        .btn {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        #hello {
          display: flex;
          gap: 14px;
          overflow-x: auto;
          -ms-overflow-style: none; /* Hide the scrollbar for MS Edge */
          scrollbar-width: none; /* Hide the scrollbar for Mozilla Firefox */
        
          margin: 0 auto 0 auto;
          width: 25vw;
          height: fit-content;
          background: linear-gradient(90deg, #333 50%, transparent 0) repeat-x, linear-gradient(90deg, #333 50%, transparent 0) repeat-x, linear-gradient(0deg, #333 50%, transparent 0) repeat-y, linear-gradient(0deg, #333 50%, transparent 0) repeat-y;
          background-size: 8px 1px, 8px 1px, 1px 8px, 1px 8px;
          background-position: 0 0, 0 100%, 0 0, 100% 0;
          cursor: pointer;
          // border: solid #FFFFFF  0.5px;
        }
        #hello {
          -webkit-animation: linearGradientMove 0.3s infinite linear;
                  animation: linearGradientMove 0.3s infinite linear;
        }
        @-webkit-keyframes linearGradientMove {
          100% {
            background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
          }
        }
        
        @keyframes linearGradientMove {
          100% {
            background-position: 4px 0, -4px 100%, 0 -4px, 100% 4px;
          }
        }
        
        #hello::-webkit-scrollbar {
          display: none; /* Hide the scrollbar on Webkit based browsers (Chrome, Safari, etc) */
          -webkit-overflow-scrolling: touch; /* On touch screens the content continues to scroll for a while after finishing the scroll gesture */
        }


        .btn:hover {
            background-color: #0056b3;
        }
          </style>
        </head>
        <body>
          <div class="wrapper">
     
          <div class="container">
            <div class="success-icon">&#10004;</div>
            <h1>Form Submitted Successfully!</h1>
            <p>Thank you for your submission.</p>
            <a href="#" class="btn" onclick="location.reload()">Back to Home</a>
            <a class="btn" onclick="showSubmittedFields()">Show Submitted Fields</a>
          </div>
          <div id="hello"></div>
          
          </div>
        </body>
        </html>`;
    } else {
      showModal(xhr.statusText)
    }
  };

  xhr.onerror = function () {
    loadingOverlay.style.display = "none";

    showModal("Unable to make the request.")
  };

  xhr.send(JSON.stringify({ link: formUrl }));
}
