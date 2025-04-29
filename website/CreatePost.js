const form = document.querySelector("form");
const submitBtn = document.querySelector("#postBtn");
const allInputs = form.queryselectorAll("input, select, textarea");

submitBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let isFormValid = true;

    allInputs.forEach((input) => {
        if (input.hasAttribute("required") && input.value.trim() === ""){
            isFormValid = false;
            input.classList.add("error");
        } else{
            input.classList.remove("error");
        }
    });

    if (isFormValid) {
        form.classList.add("submitted");
        alert("Listing submitted successfully!");
    } else {
        alert("Please fill out all required fields.")
    }

});