const form = document.querySelector("form");
const submitBtn = document.querySelector("#postBtn");
const allInputs = form.queryselectorAll("input, select, textarea");
const apiKey = '6a87dedbc88053347a5a49405418396d';
const elements = document.getElementsByClassName("add");
const query = element; 
const endpoint = `http://api.positionstack.com/v1/forward?access_key=${apiKey}&query=${query}`; 

async function getGeocodingData() {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

getGeocodingData();

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
