// getNotification.js

// Fetches notifications from the server and adds them to the DOM
async function getNotifications() {
    try {
        const res = await fetch('/api/notifications', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        if (!res.ok) {
            console.error('Server responded with error:', res.status);
            return;
        }

        const data = await res.json();
        updateNotificationList(data);
    } catch (err) {
        console.error('Error fetching notifications:', err);
    }
}

// Adds notification items to the notification container
function updateNotificationList(notifications) {
    const container = document.getElementById('notification-container');
    container.innerHTML = '';

    if (!notifications || notifications.length === 0) {
        const emptyMsg = document.createElement('div');
        emptyMsg.className = 'notification-empty';
        emptyMsg.textContent = 'No new notifications.';
        container.appendChild(emptyMsg);
        return;
    }

    notifications.forEach((item) => {
        const note = document.createElement('div');
        note.className = 'notification-item';

        let message = '';

        if (item.type === 'message') {
            message = `New message from ${item.from}: "${item.preview}"`;
        } else if (item.type === 'match') {
            message = `You matched with ${item.roommateName}!`;
        } else if (item.type === 'recommendation') {
            message = `New roommate recommendation: ${item.recommendation}`;
        } else {
            message = 'You have a new notification.';
        }

        note.textContent = message;
        container.appendChild(note);
    });
}

// Refresh notifications every 30 seconds
setInterval(getNotifications, 30000);

// Fetch immediately on page load
window.addEventListener('load', getNotifications);
