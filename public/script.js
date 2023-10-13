document.addEventListener('DOMContentLoaded', () => {
    const timeSlotsContainer = document.getElementById('time-slots');
    const bookingForm = document.getElementById('booking-form');
    const meetingInfo = document.getElementById('meeting-info');
    let selectedTime = null; // Track the selected time

    // Fetch and display available time slots
    fetch('/timeslots')
        .then(response => response.json())
        .then(data => {
            data.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.innerHTML = `
                    <p>${slot.time} - Slots: ${slot.slots}</p>
                    <button class="book-button" data-time="${slot.time}">Book Slot</button>
                `;

                slotElement.querySelector('.book-button').addEventListener('click', () => {
                    let newSelectedTime = slot.time;
                    if (newSelectedTime !== selectedTime) {
                        // Clear the previously selected time
                        selectedTime = newSelectedTime;
                        showNameEmailInputs(selectedTime);
                    }
                });

                timeSlotsContainer.appendChild(slotElement);
            });
        });

    function showNameEmailInputs(selectedTime) {
        const nameEmailFields = document.getElementById('name-email-fields');
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const scheduleButton = document.querySelector('button[type="submit"]');

        // Show the name, email inputs, and schedule button
        nameEmailFields.style.display = 'block';
        nameInput.style.display = 'block';
        emailInput.style.display = 'block';
        scheduleButton.style.display = 'block';

        // Set the selected time in a hidden input field
        const hiddenTimeInput = document.createElement('input');
        hiddenTimeInput.type = 'hidden';
        hiddenTimeInput.name = 'selectedTime';
        hiddenTimeInput.value = selectedTime;
        bookingForm.appendChild(hiddenTimeInput);
    }

    bookingForm.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const selectedTime = document.querySelector('input[name="selectedTime"]').value;

        fetch('/book', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, selectedTime }),
        })
        .then(response => response.json())
        .then(data => {
            if (data.message === 'Booking successful') {
                const meetingInfoBox = document.createElement('div');
                meetingInfoBox.className = 'meeting-info-box';
                meetingInfoBox.innerHTML = `
                    <p>Hi ${data.name},</p>
                    <p>Please join the meeting via this <a href="https://meet.google.com/ric-mkyw-wgg" target="_blank">link</a> at ${data.selectedTime}</p>
                    <button class="cancel-button">Cancel</button>
                `;

                const cancelButton = meetingInfoBox.querySelector('.cancel-button');
                cancelButton.addEventListener('click', () => {
                    meetingInfo.innerHTML = '';
                });

                meetingInfo.innerHTML = '';
                meetingInfo.appendChild(meetingInfoBox);
                document.getElementById('name').value = '';
                document.getElementById('email').value = '';
                let selectedTime = null; // Track the selected time
                timeSlotsContainer.innerHTML = '';

                fetch('/timeslots')
                    .then(response => response.json())
                    .then(data => {
                        data.forEach(slot => {
                            const slotElement = document.createElement('div');
                            slotElement.innerHTML = `
                                <p>${slot.time} - Slots: ${slot.slots}</p>
                                <button class="book-button" data-time="${slot.time}">Book Slot</button>
                            `;
                            slotElement.querySelector('.book-button').addEventListener('click', () => {
                                const newSelectedTime = slot.time;
                                if (newSelectedTime !== selectedTime) {
                                    selectedTime = newSelectedTime;
                                    showNameEmailInputs(selectedTime);
                                }
                            });
                            timeSlotsContainer.appendChild(slotElement);
                        });
                    });
            }
        });
    });
});
