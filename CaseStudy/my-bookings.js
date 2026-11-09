// Helper function to check if the scheduled playing time has ended
function isBookingEnded(dateStr, timeSlot) {
    if (!dateStr || !timeSlot) return false;
    
    // timeSlot format expected: "08:00 AM - 09:00 AM"
    const timeParts = timeSlot.split(' - ');
    if (timeParts.length < 2) return false;
    
    const endTimeStr = timeParts[1]; // e.g., "09:00 AM"
    
    // Create Date object for the booking date
    const bookingEndDate = new Date(dateStr);
    
    // Parse the end time
    const [time, modifier] = endTimeStr.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    
    if (hours === 12 && modifier === 'AM') hours = 0;
    if (hours < 12 && modifier === 'PM') hours += 12;
    
    bookingEndDate.setHours(hours, parseInt(minutes, 10), 0);
    
    // Return true if current time is past the booking end time
    return new Date() >= bookingEndDate;
}

function displayBookings() {
    const container = document.getElementById('bookingsList');
    if (!container) return;

    const bookings = JSON.parse(localStorage.getItem('pickleballBookings')) || [];

    if (bookings.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>No Bookings Found</h3>
                <p>You haven't scheduled any courts yet.</p>
                <br>
                <a href="booking-form.html" class="btn btn-primary btn-action">Book a Court</a>
            </div>
        `;
        return;
    }

    container.innerHTML = bookings.map(b => {
        // Handle backwards compatibility for older bookings without status
        const status = b.status || 'Confirmed';
        
        // Define badge class based on status
        let badgeClass = 'status-confirmed';
        if (status === 'Completed') badgeClass = 'status-completed';
        if (status === 'Cancelled') badgeClass = 'status-cancelled';

        // Time logic: only show 'Done Playing' if time has passed and status is Confirmed
        const canComplete = status === 'Confirmed' && isBookingEnded(b.date, b.time);

        return `
        <div class="booking-card">
            <div class="booking-info">
                <div class="booking-info-header">
                    <h3>${b.court}</h3>
                    <span class="status-badge ${badgeClass}">${status}</span>
                </div>
                <div class="booking-details">
                    <p><strong>👤 Name:</strong> ${b.name}</p>
                    <p><strong>📅 Date:</strong> ${b.date}</p>
                    <p><strong>⏰ Time:</strong> ${b.time}</p>
                </div>
            </div>
            
            <div class="action-buttons">
                ${canComplete ? `<button class="btn-action btn-done" onclick="markCompleted(${b.id})">Done Playing</button>` : ''}
                
                ${status === 'Confirmed' ? `<button class="btn-action btn-cancel" onclick="cancelBooking(${b.id})">Cancel</button>` : ''}
            </div>
        </div>
        `;
    }).join('');
}

function cancelBooking(id) {
    if(confirm("Are you sure you want to cancel this booking?")) {
        let bookings = JSON.parse(localStorage.getItem('pickleballBookings')) || [];
        // Update status to Cancelled instead of deleting, to maintain record
        const bookingIndex = bookings.findIndex(b => b.id === id);
        if (bookingIndex !== -1) {
            bookings[bookingIndex].status = 'Cancelled';
            localStorage.setItem('pickleballBookings', JSON.stringify(bookings));
            displayBookings(); // Instantly refreshes UI
        }
    }
}

function markCompleted(id) {
    if(confirm("Are you sure you have finished playing on this court?")) {
        let bookings = JSON.parse(localStorage.getItem('pickleballBookings')) || [];
        const bookingIndex = bookings.findIndex(b => b.id === id);
        if (bookingIndex !== -1) {
            // Failsafe: Ensure it cannot overwrite cancelled status
            if (bookings[bookingIndex].status !== 'Cancelled') {
                bookings[bookingIndex].status = 'Completed';
                localStorage.setItem('pickleballBookings', JSON.stringify(bookings));
                displayBookings(); // Instantly refreshes UI
            }
        }
    }
}

document.addEventListener('DOMContentLoaded', displayBookings);