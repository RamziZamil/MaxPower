const Wishlist = require('../models/Wishlist');
const Item = require('../models/Item');

// Get user's wishlist
exports.getWishlist = async (req, res) => {
    try {
        let wishlist = await Wishlist.findOne({ user: req.user.id }).populate('items');

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: []
            });
        }

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Add item to wishlist
exports.addToWishlist = async (req, res) => {
    try {
        const { itemId } = req.body;

        // Check if item exists
        const item = await Item.findById(itemId);
        if (!item) {
            return res.status(404).json({
                success: false,
                message: 'Item not found'
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user.id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user.id,
                items: [itemId]
            });
        } else {
            // Check if item is already in wishlist
            if (wishlist.items.includes(itemId)) {
                return res.status(400).json({
                    success: false,
                    message: 'Item already in wishlist'
                });
            }
            wishlist.items.push(itemId);
            await wishlist.save();
        }

        wishlist = await Wishlist.findById(wishlist._id).populate('items');

        res.status(200).json({
            success: true,
            data: wishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Remove item from wishlist
exports.removeFromWishlist = async (req, res) => {
    try {
        const { itemId } = req.params;

        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = wishlist.items.filter(
            item => item.toString() !== itemId
        );

        await wishlist.save();

        const updatedWishlist = await Wishlist.findById(wishlist._id).populate('items');

        res.status(200).json({
            success: true,
            data: updatedWishlist
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Clear wishlist
exports.clearWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ user: req.user.id });
        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: 'Wishlist not found'
            });
        }

        wishlist.items = [];
        await wishlist.save();

        res.status(200).json({
            success: true,
            message: 'Wishlist cleared successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
}; 