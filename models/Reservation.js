const reservationSchema = new mongoose.Schema({
    startTime: Date,
    endTime: Date,
    user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
    purchase: Object
}, { timestamps: true });


const Reservation = mongoose.model('Reservation', reservationSchema);

module.exports = Reservation;