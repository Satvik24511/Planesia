import User from "../models/User.model";
import Event from "../models/Event.model";

const getDayBounds = (year, month, day) => {
    const start = new Date(Date.UTC(year, month - 1, day, 0, 0, 0))
    const end = new Date(Date.UTC(year, month - 1, day, 23, 59, 59, 999)); 
    return { start, end };
};

export const today = async (req, res) => {
    try {
        const userId = req.user._id;

        const now = new Date();
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth() + 1;
        const currentDay = now.getUTCDate();
        const { start, end } = getDayBounds(currentYear, currentMonth, currentDay);

        const events = await Event.find({
            date: {
                $gte: start,
                $lte: end 
            },
            $or: [
                { owner: userId },
                { attendee_list: userId }
            ]
        }).populate('owner', 'name email');

        res.status(200).json({ success: true, events: events });
    } catch (error) {
        console.error('Error in today controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const month = async (req, res) => {
    try {
        const userId = req.user._id;
        let { year, month } = req.params;

        year = parseInt(year, 10);
        month = parseInt(month, 10);

        if (isNaN(year) || isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ success: false, message: 'Invalid year or month parameters.' });
        }

        const startOfMonth = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(year, month, 1, 0, 0, 0));

        const events = await Event.find({
            date: {
                $gte: startOfMonth,
                $lt: endOfMonth
            },
            $or: [
                { owner: userId },
                { attendee_list: userId }
            ]
        }).populate('owner', 'name email');

        res.status(200).json({ success: true, events: events });
    } catch (error) {
        console.error('Error in month controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const day = async (req, res) => {
    try {
        const userId = req.user._id;
        let { year, month, day } = req.params;

        year = parseInt(year, 10);
        month = parseInt(month, 10);
        day = parseInt(day, 10);

        if (isNaN(year) || isNaN(month) || isNaN(day) || month < 1 || month > 12 || day < 1 || day > 31) {
            return res.status(400).json({ success: false, message: 'Invalid date parameters.' });
        }

        const { start, end } = getDayBounds(year, month, day);

        const events = await Event.find({
            date: {
                $gte: start,
                $lte: end
            },
            $or: [
                { owner: userId },
                { attendee_list: userId }
            ]
        }).populate('owner', 'name email');

        res.status(200).json({ success: true, events: events });
    } catch (error) {
        console.error('Error in day controller:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

export const details = async (req, res) => {
    try {
        const eventId = req.params.id;

        const event = await Event.findById(eventId).populate('owner', 'name email');

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        res.status(200).json({ success: true, event: event });
    } catch (error) {
        console.error('Error in details controller:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid event ID' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const create = async (req, res) => {
    try {
        const userId = req.user._id; 

        const { title, description, date, location, capacity, ticket_price, imageUrls, contact_info } = req.body;

        if (!title || !description || !date || !location || !capacity || !ticket_price || !imageUrls || !contact_info) {
            return res.status(400).json({ success: false, message: 'Please provide all required event details.' });
        }

        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime())) {
            return res.status(400).json({ success: false, message: 'Invalid date format.' });
        }

        const event = await Event.create({
            ...req.body,
            owner: userId,
            date: eventDate
        });

        await User.findByIdAndUpdate(
            userId,
            { $push: { eventsOwned: event._id } },
            { new: true, runValidators: true }
        );

        res.status(201).json({ success: true, message: 'Event created successfully', event: event });

    } catch (error) {
        console.error('Error in create event controller:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ success: false, message: messages.join(', ') });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const deleteEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to delete this event' });
        }

        await User.findByIdAndUpdate(
            event.owner,
            { $pull: { eventsOwned: event._id } },
            { new: true }
        );

        if (event.attendee_list && event.attendee_list.length > 0) {
            await User.updateMany(
                { _id: { $in: event.attendee_list } },
                { $pull: { eventsJoined: event._id } }
            );
        }
        await Event.deleteOne({ _id: id });
        res.status(200).json({ success: true, message: 'Event deleted successfully' });

    } catch (error) {
        console.error('Error deleting event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const updateEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; 
        const updates = req.body; 

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.owner.toString() !== userId) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this event' });
        }

        Object.keys(updates).forEach(key => {
            if (key in event) { 
                event[key] = updates[key];
            }
        });

        if (updates.date) {
            event.date = new Date(updates.date);
        }

        const updatedEvent = await event.save();

        res.status(200).json({
            success: true,
            message: 'Event updated successfully',
            event: updatedEvent
        });

    } catch (error) {
        console.error('Error updating event:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: error.message, errors: error.errors });
        }
        res.status(500).json({ success: false, error: error.message });
    }
};

export const joinEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (event.attendee_list.includes(userId)) {
            return res.status(400).json({ success: false, message: 'You have already joined this event' });
        }

        if (event.tickets_sold >= event.capacity) {
            return res.status(400).json({ success: false, message: 'Event is full, no more tickets available' });
        }

        event.attendee_list.push(userId);
        event.tickets_sold += 1;
        await event.save();

        await User.findByIdAndUpdate(
            userId,
            { $addToSet: { eventsJoined: event._id } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Successfully joined the event' });

    } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const leaveEvent = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const event = await Event.findById(id);

        if (!event) {
            return res.status(404).json({ success: false, message: 'Event not found' });
        }

        if (!event.attendee_list.includes(userId)) {
            return res.status(400).json({ success: false, message: 'You are not an attendee of this event' });
        }

        event.attendee_list.pull(userId);
        event.tickets_sold = Math.max(0, event.tickets_sold - 1);
        await event.save();

        await User.findByIdAndUpdate(
            userId,
            { $pull: { eventsJoined: event._id } },
            { new: true }
        );

        res.status(200).json({ success: true, message: 'Successfully left the event' });

    } catch (error) {
        console.error('Error leaving event:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};