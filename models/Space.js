const spaceSchema = new mongoose.Schema({
    price: Number,
    timeLimitMinutes: Number,
    reservations : [{ type: mongoose.Schema.Types.ObjectId, ref: "reservation" }]
}, { timestamps: true });


const Space = mongoose.model('Space', spaceSchema);

module.exports = Space;