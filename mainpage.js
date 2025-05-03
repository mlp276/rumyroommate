document.addEventListener("DOMContentLoaded", () => {
    const listingsContainer = document.getElementById("listings");
    const notificationsContainer = document.getElementById("notifications");
    const filterForm = document.getElementById("filter-form");
    const authenticatedSection = document.getElementById("authenticated-section");

    const isAuthenticated = true;

    if (isAuthenticated) {
        authenticatedSection.style.display = "block";
        loadNotifications();
    }

    loadListings();

    filterForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const preference = document.getElementById("preference").value;
        filterListings(preference);
    });

    function loadListings() {
        const listings = [
            { id: 1, campus: "Busch", roommates: 2, preferences: "Quiet, Non-smoker" },
            { id: 2, campus: "Livingston", roommates: 1, preferences: "Pet-friendly" },
            { id: 3, campus: "College Ave", roommates: 3, preferences: "Vegetarian" }
        ];

        listingsContainer.innerHTML = "";
        listings.forEach(listing => {
            const listingCard = document.createElement("div");
            listingCard.className = "col-md-4 mb-3";
            listingCard.innerHTML = `
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Campus: ${listing.campus}</h5>
                        <p class="card-text">Roommates: ${listing.roommates}</p>
                        <p class="card-text">Preferences: ${listing.preferences}</p>
                        ${isAuthenticated ? `<button class="btn btn-primary">Save Listing</button>` : ""}
                    </div>
                </div>
            `;
            listingsContainer.appendChild(listingCard);
        });
    }

    function loadNotifications() {
        const notifications = [
            "User123 matched your preferences!",
            "New listing available on Busch campus.",
            "Your saved listing has been updated."
        ];

        notificationsContainer.innerHTML = "";
        notifications.forEach(notification => {
            const notificationItem = document.createElement("li");
            notificationItem.textContent = notification;
            notificationsContainer.appendChild(notificationItem);
        });
    }

    function filterListings(preference) {
        console.log(`Filtering listings by preference: ${preference}`);
    }
});