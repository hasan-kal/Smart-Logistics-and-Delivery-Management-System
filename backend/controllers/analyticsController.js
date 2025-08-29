const Shipment = require('../models/Shipment');

const getOverview = async (req, res) => {
  try {
    // Total shipments
    const totalShipments = await Shipment.countDocuments();

    // Active deliveries (In Transit)
    const activeDeliveries = await Shipment.countDocuments({ status: "In Transit" });

    // Completed deliveries
    const completedDeliveries = await Shipment.countDocuments({ status: "Delivered" });

    // Cancelled deliveries
    const cancelledDeliveries = await Shipment.countDocuments({ status: "Cancelled" });

    // Average delivery time (only for delivered shipments)
    const deliveredShipments = await Shipment.find({ status: "Delivered" });
    let avgDeliveryTime = 0;
    if (deliveredShipments.length > 0) {
      const totalTime = deliveredShipments.reduce((acc, s) => {
        if (s.pickedAt && s.deliveredAt) {
          return acc + (s.deliveredAt - s.pickedAt);
        }
        return acc;
      }, 0);

      avgDeliveryTime = totalTime / deliveredShipments.length / (1000 * 60); // in minutes
    }

    res.json({
      totalShipments,
      activeDeliveries,
      completedDeliveries,
      cancelledDeliveries,
      avgDeliveryTime: avgDeliveryTime.toFixed(2) + " mins",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

const getTrends = async (req, res) => {
  try {
    const trends = await Shipment.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
          },
          total: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(trends);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

module.exports = { getOverview, getTrends };