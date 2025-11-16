const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/auth");
const Order = require("../models/Order");
const User = require("../models/User");
const Item = require("../models/Item");

// Get total statistics
router.get("/stats", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const [totalUsers, totalOrders, totalProducts] = await Promise.all([
      User.countDocuments(),
      Order.countDocuments(),
      Item.countDocuments(),
    ]);

    res.json({
      totalUsers,
      totalOrders,
      totalProducts,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching statistics" });
  }
});

// Get weekly sales data
router.get("/weekly-sales", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: last7Days },
          status: "completed",
        },
      },
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          totalSales: { $sum: "$totalAmount" },
          orderCount: { $sum: 1 },
        },
      },
      {
        $project: {
          day: {
            $switch: {
              branches: [
                { case: { $eq: ["$_id", 1] }, then: "Sun" },
                { case: { $eq: ["$_id", 2] }, then: "Mon" },
                { case: { $eq: ["$_id", 3] }, then: "Tue" },
                { case: { $eq: ["$_id", 4] }, then: "Wed" },
                { case: { $eq: ["$_id", 5] }, then: "Thu" },
                { case: { $eq: ["$_id", 6] }, then: "Fri" },
                { case: { $eq: ["$_id", 7] }, then: "Sat" },
              ],
            },
          },
          sales: "$totalSales",
          orders: "$orderCount",
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json(salesData);
  } catch (error) {
    console.error("Error fetching weekly sales:", error);
    res.status(500).json({ message: "Error fetching weekly sales data" });
  }
});

// Get category distribution
router.get(
  "/category-distribution",
  verifyToken,
  verifyAdmin,
  async (req, res) => {
    try {
      const categoryData = await Item.aggregate([
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 },
          },
        },
        {
          $project: {
            name: "$_id",
            value: "$count",
          },
        },
      ]);

      res.json(categoryData);
    } catch (error) {
      console.error("Error fetching category distribution:", error);
      res.status(500).json({ message: "Error fetching category distribution" });
    }
  }
);

// Get recent activity
router.get("/recent-activity", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name");

    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(5);

    const activity = [
      ...recentOrders.map((order) => ({
        type: "order",
        user: order.user.name,
        action: "placed an order",
        time: order.createdAt,
        amount: order.totalAmount,
      })),
      ...recentUsers.map((user) => ({
        type: "user",
        user: user.name,
        action: "registered",
        time: user.createdAt,
        amount: null,
      })),
    ]
      .sort((a, b) => b.time - a.time)
      .slice(0, 5);

    res.json(activity);
  } catch (error) {
    console.error("Error fetching recent activity:", error);
    res.status(500).json({ message: "Error fetching recent activity" });
  }
});

// Get popular products
router.get("/popular-products", verifyToken, verifyAdmin, async (req, res) => {
  try {
    const popularProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.item",
          totalSales: { $sum: "$items.quantity" },
        },
      },
      {
        $lookup: {
          from: "items",
          localField: "_id",
          foreignField: "_id",
          as: "itemDetails",
        },
      },
      { $unwind: "$itemDetails" },
      {
        $project: {
          name: "$itemDetails.name",
          sales: "$totalSales",
        },
      },
      { $sort: { sales: -1 } },
      { $limit: 5 },
    ]);

    res.json(popularProducts);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ message: "Error fetching popular products" });
  }
});

module.exports = router;
