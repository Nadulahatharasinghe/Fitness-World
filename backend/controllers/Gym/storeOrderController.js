import StoreOrder from '../../models/Gym/StoreOrder.js';
import StoreProduct from '../../models/Gym/StoreProduct.js';
import { sendEmailNotification } from '../../utils/notifications.js';

// User: create a store order with payment slip upload
export const createStoreOrder = async (req, res) => {
  try {
    const { items, fullName, email, phone, deliveryAddress } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Payment slip is required.' });
    }

    // items will come as a JSON string in FormData, parse it
    let parsedItems = [];
    try {
      parsedItems = typeof items === 'string' ? JSON.parse(items) : items;
    } catch (err) {
      return res.status(400).json({ message: 'Invalid items format. Must be JSON array.' });
    }

    if (!parsedItems || parsedItems.length === 0) {
      return res.status(400).json({ message: 'Order must contain at least one item.' });
    }

    // Verify stock and calculate total amount
    let totalAmount = 0;
    const validatedItems = [];

    for (const item of parsedItems) {
      const product = await StoreProduct.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}. Available: ${product.stock}` });
      }

      totalAmount += product.price * item.quantity;
      validatedItems.push({
        product: item.product,
        quantity: item.quantity,
        price: product.price
      });
    }

    // Normalize path
    const paymentSlipPath = req.file.path.replace(/\\/g, '/');

    const order = new StoreOrder({
      user: req.userId,
      items: validatedItems,
      fullName,
      email,
      phone,
      deliveryAddress,
      totalAmount,
      paymentSlip: paymentSlipPath,
      paymentStatus: 'pending',
      orderStatus: 'pending'
    });

    await order.save();
    res.status(201).json({ message: 'Order submitted successfully. Pending payment verification.', order });

  } catch (error) {
    console.error('Create store order error:', error);
    res.status(500).json({ message: 'Error creating order.', error: error.message });
  }
};

// User: get my orders
export const getMyStoreOrders = async (req, res) => {
  try {
    const orders = await StoreOrder.find({ user: req.userId })
      .populate('items.product', 'name category image')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching order history.', error: error.message });
  }
};

// Admin: get all store orders
export const adminGetAllStoreOrders = async (req, res) => {
  try {
    const orders = await StoreOrder.find({})
      .populate('user', 'username email firstName lastName')
      .populate('items.product', 'name category price image stock')
      .sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching admin orders.', error: error.message });
  }
};

// Admin: approve store order payment
export const adminApproveStoreOrder = async (req, res) => {
  try {
    const order = await StoreOrder.findById(req.params.id).populate('items.product');
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.paymentStatus === 'approved') {
      return res.status(400).json({ message: 'Order payment is already approved.' });
    }

    // Verify stock and update inventory
    for (const item of order.items) {
      const product = await StoreProduct.findById(item.product._id);
      if (!product) {
        return res.status(404).json({ message: `Product no longer exists: ${item.product.name}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name} to approve order. Available: ${product.stock}` });
      }
      
      // Reduce stock
      product.stock -= item.quantity;
      await product.save();
    }

    order.paymentStatus = 'approved';
    order.orderStatus = 'processing';
    order.approvedAt = new Date();
    if (req.body.adminMessage) {
      order.adminMessage = req.body.adminMessage;
    }

    await order.save();

    // Trigger email notification
    await sendEmailNotification({
      to: order.email,
      subject: 'Fitness World - Order Payment Approved! 📦',
      text: `Hello ${order.fullName},\n\nYour payment for order ID ${order._id} has been approved.\nAmount Paid: Rs. ${order.totalAmount.toLocaleString()}\nStatus: Processing\n\nWe are preparing your items for delivery. Thank you for shopping with Fitness World!`
    });

    res.json({ message: 'Order payment approved. Inventory updated.', order });
  } catch (error) {
    res.status(500).json({ message: 'Error approving order.', error: error.message });
  }
};

// Admin: reject store order payment
export const adminRejectStoreOrder = async (req, res) => {
  try {
    const { adminMessage } = req.body;
    const order = await StoreOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.paymentStatus = 'rejected';
    order.orderStatus = 'rejected';
    order.adminMessage = adminMessage || 'Payment slip verification failed.';
    await order.save();

    // Trigger email notification
    await sendEmailNotification({
      to: order.email,
      subject: 'Fitness World - Order Payment Slip Rejected',
      text: `Hello ${order.fullName},\n\nWe could not verify your payment slip for order ID ${order._id}.\nReason: ${order.adminMessage}\n\nPlease check your receipt and contact Fitness World (+94711701408).\n\nBest regards,\nFitness World Admin`
    });

    res.json({ message: 'Order payment rejected.', order });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting order.', error: error.message });
  }
};

// Admin: update order status
export const adminUpdateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, adminMessage } = req.body;
    const allowedStatuses = ['pending', 'processing', 'ready', 'completed', 'rejected'];
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: 'Invalid order status.' });
    }

    const order = await StoreOrder.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    order.orderStatus = orderStatus;
    if (adminMessage !== undefined) {
      order.adminMessage = adminMessage;
    }

    await order.save();

    // Send update email
    await sendEmailNotification({
      to: order.email,
      subject: `Fitness World - Order Status Update: ${orderStatus.toUpperCase()}`,
      text: `Hello ${order.fullName},\n\nYour order ID ${order._id} status has been updated to: ${orderStatus.toUpperCase()}.\n${order.adminMessage ? `Admin message: ${order.adminMessage}\n` : ''}\nThank you for choosing Fitness World!`
    });

    res.json({ message: `Order status updated to ${orderStatus}.`, order });
  } catch (error) {
    res.status(500).json({ message: 'Error updating order status.', error: error.message });
  }
};
