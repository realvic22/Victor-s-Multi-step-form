document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("multi-step-form");
    const steps = Array.from(form.getElementsByClassName("step"));
    const nextBtn = document.getElementById("next-step");
    const prevBtn = document.getElementById("prev-step");
    const stepIndicators = document.querySelectorAll(".step-indicator");
    let currentStep = 0;

    function showStep(stepIndex) {
        steps.forEach((step, index) => {
            step.classList.toggle("active", index === stepIndex);
            stepIndicators[index].classList.toggle("active", index === stepIndex);
        });
        prevBtn.style.display = stepIndex === 0 ? "none" : "block";
        nextBtn.textContent =
            stepIndex === steps.length - 2 ? "Confirm" : "Next Step";
    }

};