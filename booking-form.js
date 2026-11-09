document.addEventListener('DOMContentLoaded', function () {
    const bookingDateInput = document.getElementById('bookingDate');
    const bookingForm = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const courtCards = document.querySelectorAll('.court-card');
    const courtSelect = document.getElementById('courtNumber');

    // Prevent selecting dates in the past
    if (bookingDateInput) {
        bookingDateInput.min = new Date().toISOString().split('T')[0];
    }

    // Function to visually select a court and update hidden dropdown
    function selectCourt(courtValue) {
        courtCards.forEach(c => c.classList.remove('selected'));
        const targetCard = document.querySelector(`.court-card[data-court="${courtValue}"]`);
        if (targetCard) {
            targetCard.classList.add('selected');
        }
        if (courtSelect) {
            courtSelect.value = courtValue;
        }
    }

    // Check URL parameters for auto-selection (e.g. from View Courts page)
    const urlParams = new URLSearchParams(window.location.search);
    const preselectedCourt = urlParams.get('court');
    if (preselectedCourt) {
        selectCourt(preselectedCourt);
    }

    // Image click selection logic
    if (courtCards.length > 0 && courtSelect) {
        courtCards.forEach(card => {
            card.addEventListener('click', function() {
                const courtValue = this.getAttribute('data-court');
                selectCourt(courtValue);
            });
        });
    }

    // Existing form submission logic
    if (bookingForm) {
        bookingForm.addEventListener('submit', function (e) {
            e.preventDefault();

            if (!courtSelect.value) {
                alert("Please click on a court image to select a court.");
                return;
            }

            const newBooking = {
                id: Date.now(),
                name: document.getElementById('fullName').value,
                court: courtSelect.value,
                date: document.getElementById('bookingDate').value,
                time: document.getElementById('timeSlot').value,
                status: 'Confirmed' // Default status for new bookings
            };

            const existingBookings = JSON.parse(localStorage.getItem('pickleballBookings')) || [];
            existingBookings.push(newBooking);

            localStorage.setItem('pickleballBookings', JSON.stringify(existingBookings));

            bookingForm.reset();
            courtCards.forEach(c => c.classList.remove('selected'));
            
            if (successMessage) {
                successMessage.style.display = 'block';
                setTimeout(() => {
                    successMessage.style.display = 'none';
                }, 4000);
            }
        });
    }
});