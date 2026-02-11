const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Event = require('../models/Event');

// @route   GET api/events
// @desc    Get all events
// @access  Public
router.get('/', async (req, res) => {
    try {
        const events = await Event.find().sort({ date: -1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/events
// @desc    Create an event
// @access  Private (Admin only)
router.post('/', auth, async (req, res) => {
    // Check if user is admin
    if (req.user.role !== 'admin') {
        return res.status(403).json({ msg: 'Access denied. Admins only.' });
    }

    const { title, description, date, location, totalSeats } = req.body;

    try {
        const newEvent = new Event({
            title,
            description,
            date,
            location,
            totalSeats
        });

        const event = await newEvent.save();
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/events/register/:id
// @desc    Register for an event
// @access  Private (Student)
// @route   PUT api/events/register/:id
// @desc    Register for an event
router.put('/register/:id', auth, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);

        if (!event) {
            return res.status(404).json({ msg: 'Event not found' });
        }

        // 1. Check if seats available
        if (event.registeredUsers.length >= event.totalSeats) {
            return res.status(400).json({ msg: 'Event is full' });
        }

        // 2. CHECK IF ALREADY REGISTERED (The Fix)
        // We use .some() to compare IDs as Strings
        const isRegistered = event.registeredUsers.some(
            (userId) => userId.toString() === req.user.id
        );

        if (isRegistered) {
            return res.status(400).json({ msg: 'You are already registered for this event' });
        }

        // 3. Register User
        event.registeredUsers.push(req.user.id);
        await event.save();

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/events/my-events
// @desc    Get logged in user's events
// @access  Private
router.get('/my-events', auth, async (req, res) => {
    try {
        // Find events where the 'registeredUsers' array contains the current user's ID
        const events = await Event.find({ registeredUsers: req.user.id }).sort({ date: 1 });
        res.json(events);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   GET api/events/:id
// @desc    Get single event with Participant Details
// @access  Public (but we use it for Admin)
router.get('/:id', async (req, res) => {
    try {
        // .populate() replaces the User IDs with actual User Data (Name, Email)
        const event = await Event.findById(req.params.id)
            .populate('registeredUsers', 'name email'); 
        
        if (!event) return res.status(404).json({ msg: 'Event not found' });
        
        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/events/:id
// @desc    Delete an event
// @access  Private (Admin Only)
router.delete('/:id', auth, async (req, res) => {
    try {
        // 1. Check if user is Admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // 2. Find and Delete
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ msg: 'Event not found' });

        await Event.deleteOne({ _id: req.params.id });
        res.json({ msg: 'Event removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   PUT api/events/:id
// @desc    Update an event
// @access  Private (Admin Only)
router.put('/:id', auth, async (req, res) => {
    try {
        // 1. Check if user is Admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access denied' });
        }

        // 2. Find and Update
        // { new: true } returns the updated document, not the old one
        const event = await Event.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true }
        );

        if (!event) return res.status(404).json({ msg: 'Event not found' });

        res.json(event);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
