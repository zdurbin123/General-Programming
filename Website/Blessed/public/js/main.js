// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

let loginForm = document.getElementById('login-form');
let registrationForm = document.getElementById('registration-form');
let donateButon = document.getElementById('donate-button');
let ageForm = document.getElementById('age-search-form');
let locationForm = document.getElementById('location-search-form');
let donateForm = document.getElementById('donate-form');
let giftForm = document.getElementById('gift-form');

if (loginForm) {
  loginForm.addEventListener("submit", (event) => {
    console.log("Login Form submission fired");
    event.preventDefault();
    let emailAddress = document.getElementById("emailAddressInput");
    let password = document.getElementById("passwordInput");
    let errorDiv = document.getElementById("loginErrors");

    if (emailAddress.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a value for username";
      return false;
    }

    if (password.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a value for password";
      return false;
    }

    axios({
      method: 'POST',
      url: 'http://localhost:3000/login',
      contentType: 'application/json',
      data: {
          emailAddressInput: emailAddress.value.trim(),
          passwordInput: password.value.trim()
      }
    }).then(function (responseMessage) {
      if (responseMessage.data.success) {
        let pTag = document.getElementById('loginResponse');
        pTag.innerText = `Welcome ${responseMessage.data.user}, you have successfully logged in. Your role in the system is ${responseMessage.data.role}`;
        pTag.hidden = false;
      }
      else {
        let pTag = document.getElementById('loginResponse');
        pTag.innerText = `Unsuccessful login. ${responseMessage.data.error}. Please try again.`;
        pTag.hidden = false;
      }
      
      });
  });
}

if (registrationForm) {
  registrationForm.addEventListener("submit", (event) => {
    console.log("Registration Form submission fired");
    event.preventDefault();
    let errorDiv = document.getElementById("registerErrors");
    let emailAddress = document.getElementById("emailAddressInput");
    let firstName = document.getElementById("firstNameInput");
    let lastName = document.getElementById("lastNameInput");
    let userName = document.getElementById("userNameInput");
    let password = document.getElementById("passwordInput");
    let comfirmPassword = document.getElementById("confirmPasswordInput");
    let role = document.getElementById("roleInput");

    if (emailAddress.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a value for emailAddress";
      return false;
    }

    if (firstName.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must enter a value for firstName";
      return false;
    }

    if (lastName.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must enter a value for lastName";
      return false;
    }

    if (userName.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "You must enter a value for username";
      return false;
    }

    if (password.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must enter a value for password";
      return false;
    }

    if (comfirmPassword.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must enter a value for comfirmPassword";
      return false;
    }

    if (role.value.trim() === "") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must enter a value for role";
      return false;
    }

    if (role.value.trim() !== "admin" && role.value.trim() !== "user") {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: You must select a valid role";
      return false;
    }

    if (password.value.trim() !== comfirmPassword.value.trim()) {
      errorDiv.hidden = false;
      errorDiv.innerHTML = "Error: password and confirm password MUST match!";
      return false;
    }

    event.target.submit();
  });
}

if (donateButon) {
  donateButon.addEventListener("submit", (event) => {
    console.log("donate-button fired");
    event.preventDefault();
    let charityName = document.getElementById("charityName").innerHTML;
    donateButon.action = "/donate/charityName/" + charityName;
    event.target.submit();
  });
}

if (ageForm) {
  ageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let errorDiv = document.getElementById("ageErrors");
    let age = document.getElementById("ageInput");

    if (age.value <= 0) {
      errorDiv.innerHTML = "invalid age provided";
      errorDiv.hidden = false;
      return false;
    }

    if (typeof parseInt(age.value) !== "number") {
      errorDiv.innerHTML = "must provide an age";
      errorDiv.hidden = false;
      return false;
    }

    event.target.submit();
  });
}

if (locationForm) {
  locationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    let errorDiv = document.getElementById("locationErrors");
    let location = document.getElementById("locationInput");

    if (!location.value) {
      errorDiv.innerHTML = "must provide a location";
      errorDiv.hidden = false;
      return false;
    }

    if (typeof location.value !== "string") {
      errorDiv.innerHTML = "Error: location must be a string!";
      errorDiv.hidden = false;
      return false;
    }

    location = location.value.trim();
    if (location.length === 0) {
      errorDiv.innerHTML =
        "Error: location cannot be an empty string or string with just spaces";
      errorDiv.hidden = false;
      return false;
    }
    if (!isNaN(location.value)) {
      errorDiv.innerHTML = `Error: ${location} is not a valid value for location as it only contains digits`;
      errorDiv.hidden = false;
      return false;
    }

    event.target.submit();
  });
}

if (donateForm) {
  donateForm.addEventListener('submit', (event) => {
    event.preventDefault();

    let errorDiv = document.getElementById('donateErrors');
    let charityName = document.getElementById('charityName');
    let userName = document.getElementById('userName');
  
    if (!charityName.value) {
      errorDiv.innerHTML = 'must provide a charity name';
      errorDiv.hidden = false;
      return false;
    }

    charityName = charityName.value.trim();
    if (charityName.length === 0) {
      errorDiv.innerHTML = 'Error: charity name cannot be an empty string or string with just spaces';
      errorDiv.hidden = false;
      return false;
    }
    if (!isNaN(charityName.value)) {
      errorDiv.innerHTML = `Error: ${chariyName.value} is not a valid value for charity name as it only contains digits`;
      errorDiv.hidden = false;
      return false;
    }

    if (!userName.value) {
      errorDiv.innerHTML = 'must provide a user name';
      errorDiv.hidden = false;
      return false;
    }

    userName = userName.value.trim();
    if (userName.length === 0) {
      errorDiv.innerHTML = 'Error: user name cannot be an empty string or string with just spaces';
      errorDiv.hidden = false;
      return false;
    }
    if (!isNaN(userName.value)) {
      errorDiv.innerHTML = `Error: ${userName.value} is not a valid value for user name as it only contains digits`;
      errorDiv.hidden = false;
      return false;
  }

    event.target.submit();
  });
}

function showDonateButton(select, giftId) {
  if (select.value === "-1") {
    document.getElementById(`btnGiftDonate${giftId}`).style.display = "none";
  } else {
    document.getElementById(`btnGiftDonate${giftId}`).style.display = "";
  }
}

