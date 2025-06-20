import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        ref: "User"
    },
    location: {
        type: String,
        required: true,
    },
    capacity: {
        type: Number,
        required: true,
    },
    ticket_price: {
        type: Number,
        required: true,
    },
    imageUrls: [{
        type: String,
        required: true
    }],
    contact_info: {
        type: String,
        required: true
    },
    tickets_sold: {
        type: Number,
        default: 0
    },
    attendee_list: [{
        type: mongoose.Schema.ObjectId,
        ref: "User"
    }]
}, {
    timestamps: true,
});

const Event = mongoose.model('Event', eventSchema);

export default Event;