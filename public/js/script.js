function openToast(title, message) {
  var toast = document.querySelector(".toast1");
  console.log(toast);
  var toastTitle = document.querySelector(".toast__title");
  var toastP = document.querySelector(".toast__p");
  toastTitle.textContent = title;
  message = message.replace(/\+/g, " ");
  toastP.textContent = message;
  var openToastEvent = new CustomEvent("openToast");
  toast.dispatchEvent(openToastEvent);
}

// Extract toast parameters from the URL path
const urlPath = window.location.pathname;
console.log("URL Path:", urlPath);

// Updated code to directly extract parameters from the URL path
const paramsMatch = urlPath.match(/\/%7Btoast:(true|false);toasttitle:([^;]+);toastmessage:([^%7D]+)%7D$/);

if (paramsMatch) {
  const toastValue = paramsMatch[1];
  const toasttitleValue = paramsMatch[2];
  const toastmessageValue = decodeURIComponent(paramsMatch[3].replace(/\+/g, " "));

  console.log("Decoded Parameters:", toastValue, toasttitleValue, toastmessageValue);

  if (toastValue === "true" && toasttitleValue && toastmessageValue) {
    console.log("Triggering openToast function");
    openToast(toasttitleValue, toastmessageValue);
  } else {
    console.log("Invalid or missing parameters for toast.");
  }
} else {
  console.log("Toast parameter is not present in the URL.");
}

function displayImage() {
  var input = document.getElementById('fileInput');
  var img = document.getElementById('uploadedImage');
  
  if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
          img.src = e.target.result;
      };

      reader.readAsDataURL(input.files[0]);
  }
}