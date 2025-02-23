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

  nextBtn.addEventListener("click", function () {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        currentStep++;
        showStep(currentStep);
      }
    }
  });

  prevBtn.addEventListener("click", function () {
    if (currentStep > 0) {
      currentStep--;
      showStep(currentStep);
    }
  });

  const billingToggle = document.getElementById("billing-toggle");
  const planPrices = document.querySelectorAll(".plan .price");
  const yearlyOffers = document.querySelectorAll(".yearly-offer");
  const addonPrices = document.querySelectorAll(".addon-price");

  billingToggle.addEventListener("change", function () {
    const isYearly = this.checked;
    planPrices.forEach((price) => {
      const monthlyPrice = parseInt(price.textContent.slice(1));
      price.textContent = isYearly
        ? `$${monthlyPrice * 10}/yr`
        : `$${monthlyPrice}/mo`;
    });
    yearlyOffers.forEach((offer) => {
      offer.style.display = isYearly ? "block" : "none";
    });
    addonPrices.forEach((price) => {
      const monthlyPrice = parseInt(price.textContent.slice(2));
      price.textContent = isYearly
        ? `+$${monthlyPrice * 10}/yr`
        : `+$${monthlyPrice}/mo`;
    });
    updateSummary();
  });

  const planInputs = document.querySelectorAll('input[name="plan"]');
  const addonInputs = document.querySelectorAll('input[name="addons"]');

  planInputs.forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

  addonInputs.forEach((input) => {
    input.addEventListener("change", updateSummary);
  });

  function updateSummary() {
    const selectedPlan = document.querySelector('input[name="plan"]:checked');
    const selectedAddons = document.querySelectorAll(
      'input[name="addons"]:checked'
    );
    const isYearly = billingToggle.checked;

    const summaryPlan = document.getElementById("selected-plan");
    const summaryPlanPrice = document.querySelector(".summary-plan-price");
    const summaryAddons = document.querySelector(".summary-addons");
    const totalPrice = document.querySelector(".total-price");

    if (selectedPlan) {
      const planName =
        selectedPlan.value.charAt(0).toUpperCase() +
        selectedPlan.value.slice(1);
      const planPrice = parseInt(
        selectedPlan
          .closest(".plan")
          .querySelector(".price")
          .textContent.slice(1)
      );
      summaryPlan.textContent = `${planName} (${
        isYearly ? "Yearly" : "Monthly"
      })`;
      summaryPlanPrice.textContent = isYearly
        ? `$${planPrice * 10}/yr`
        : `$${planPrice}/mo`;
    }

    summaryAddons.innerHTML = "";
    let total = parseInt(summaryPlanPrice.textContent.slice(1));

    selectedAddons.forEach((addon) => {
      const addonName = addon.closest(".addon").querySelector("h3").textContent;
      const addonPrice = parseInt(
        addon
          .closest(".addon")
          .querySelector(".addon-price")
          .textContent.slice(2)
      );
      const yearlyAddonPrice = isYearly ? addonPrice * 10 : addonPrice;

      summaryAddons.innerHTML += `
                <div class="summary-addon">
                    <p>${addonName}</p>
                    <p class="addon-price">+$${yearlyAddonPrice}/${
        isYearly ? "yr" : "mo"
      }</p>
                </div>
            `;

      total += yearlyAddonPrice;
    });

    totalPrice.textContent = `$${total}/${isYearly ? "yr" : "mo"}`;
  }

  const changePlanLink = document.getElementById("change-plan");
  changePlanLink.addEventListener("click", function (e) {
    e.preventDefault();
    currentStep = 1;
    showStep(currentStep);
  });

  submitBtn.addEventListener("click", function (e) {
    e.preventDefault();
    if (validateStep(currentStep)) {
      currentStep++;
      showStep(currentStep);
    }
  });

  showStep(currentStep);
});
