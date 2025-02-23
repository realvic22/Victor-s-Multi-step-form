document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("multi-step-form");
  const steps = Array.from(form.getElementsByClassName("step"));
  const nextBtn = document.getElementById("next-step");
  const prevBtn = document.getElementById("prev-step");
  const submitBtn = document.getElementById("submit-form");
  const stepIndicators = document.querySelectorAll(".step-indicator");
  let currentStep = 0;

  function showStep(stepIndex) {
    steps.forEach((step, index) => {
      step.classList.toggle("active", index === stepIndex);
      stepIndicators[index].classList.toggle("active", index === stepIndex);
    });

    prevBtn.style.display = stepIndex === 0 ? "none" : "block";

    if (stepIndex === steps.length - 2) {
      // On the summary page (step 4)
      nextBtn.style.display = "none";
      submitBtn.style.display = "block";
    } else if (stepIndex === steps.length - 1) {
      // On the thank you page
      document.querySelector(".form-buttons").style.display = "none";
    } else {
      nextBtn.style.display = "block";
      submitBtn.style.display = "none";
    }
  }

  function validateStep(stepIndex) {
    if (stepIndex === 0) {
      const name = document.getElementById("name");
      const email = document.getElementById("email");
      const phone = document.getElementById("phone");
      const nameError = document.getElementById("name-error");
      const emailError = document.getElementById("email-error");
      const phoneError = document.getElementById("phone-error");

      let isValid = true;

      if (!name.value.trim()) {
        nameError.textContent = "This field is required";
        isValid = false;
      } else {
        nameError.textContent = "";
      }

      if (!email.value.trim()) {
        emailError.textContent = "This field is required";
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        emailError.textContent = "Please enter a valid email address";
        isValid = false;
      } else {
        emailError.textContent = "";
      }

      if (!phone.value.trim()) {
        phoneError.textContent = "This field is required";
        isValid = false;
      } else {
        phoneError.textContent = "";
      }

      return isValid;
    }

    if (stepIndex === 1) {
      const planInputs = document.querySelectorAll('input[name="plan"]');
      return Array.from(planInputs).some((input) => input.checked);
    }

    return true;
  }

  