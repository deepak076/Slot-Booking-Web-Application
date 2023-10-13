// /app.js
express = require('express');
const app = express();
const port = 3000;

const availableTimeSlots = [
    { time: '2:00 PM', slots: 4 },
    { time: '2:30 PM', slots: 4 },
    { time: '3:30 PM', slots: 4 },
    { time: '4:30 PM', slots: 4 },
    // Add more time slots as needed
];

const bookedMeetings = [];

app.use(express.json());

// Serve static files (HTML, CSS, and JavaScript)
app.use(express.static('public'));

app.get('/timeslots', (req, res) => {
    res.json(availableTimeSlots);
});

app.post('/book', (req, res) => {
    const { name, email, selectedTime } = req.body;

    const timeSlot = availableTimeSlots.find(slot => slot.time === selectedTime);
    if (timeSlot && timeSlot.slots > 0) {
        timeSlot.slots--;
        bookedMeetings.push({ name, email, selectedTime });
        res.json({ message: 'Booking successful', name, email, selectedTime });
    } else {
        res.status(400).json({ message: 'Time slot not available' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
