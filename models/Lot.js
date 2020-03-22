const lotSchema = new mongoose.Schema({
    lotName: String,
    description: String,
    address: String,
    imageURLs: Array,
    openSalesDate: Date,
    openLotDate: Date,
    spaces: [{ type: mongoose.Schema.Types.ObjectId, ref: "space" }]
}, { timestamps: true });


const Lot = mongoose.model('Lot', lotSchema);

module.exports = Lot;
