const lotSchema = new mongoose.Schema({
    label: String,
    description: String,
    openSalesDate: Date,
    openLotDate: Date,
    spaces : [{ type: mongoose.Schema.Types.ObjectId, ref: "space" }]
}, { timestamps: true });


const Lot = mongoose.model('Lot', lotSchema);

module.exports = Lot;
