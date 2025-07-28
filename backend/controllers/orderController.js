import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import sendMail from "../utils/sendMail.js";

//global variables
const currency = "inr";
const deliveryCharge = 10;

// gateway initialize
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing orders using COD Method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    // 1. Check stock for each item
    for (const item of items) {
      const product = await productModel.findById(item._id);
      if (!product) {
        return res.json({
          success: false,
          message: `Product not found: ${item.name}`,
        });
      }

      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
      if (sizeIndex === -1) {
        return res.json({
          success: false,
          message: `Size "${item.size}" not available for ${product.name}`,
        });
      }

      const availableQty = product.sizes[sizeIndex].quantity;
      if (availableQty < item.quantity) {
        return res.json({
          success: false,
          message: `Only ${availableQty} items left for ${product.name} (${item.size})`,
        });
      }
    }

    // 2. Deduct stock now that all are valid
    for (const item of items) {
      const product = await productModel.findById(item._id);
      const sizeIndex = product.sizes.findIndex((s) => s.size === item.size);
      product.sizes[sizeIndex].quantity -= item.quantity;
      product.markModified("sizes"); // 👈
      await product.save();
    }

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const formattedAddress = `${address.street}, ${address.city}, ${address.postalCode}, ${address.country}`;

    const newOrdr = new orderModel(orderData);
    await newOrdr.save();

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    // Send order notification to admin
    const productSummary = items
      .map((item) => `${item.name} (${item.size}) x ${item.quantity}`)
      .join(", ");

    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const htmlContent = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #4CAF50;">Thank you for your order, ${user.name}!</h2>
    <p>Your order <strong>#${
      newOrdr._id
    }</strong> has been successfully placed.</p>

    <h3>Order Details:</h3>
    <ul>
      ${items
        .map(
          (item) => `<li>${item.name} (${item.size}) x ${item.quantity}</li>`
        )
        .join("")}
    </ul>

    <p><strong>Total Amount:</strong> ₹${amount}</p>

    <h3>Delivery Address:</h3>
    <p>
    ${address.firstName}  ${address.lastName}<br/>
      ${address.street}<br/>
      ${address.city}, ${address.zipcode}<br/>
      ${address.state ? address.state + "<br/>" : ""}
      ${address.country}
    </p>

    <p><strong>Phone Number: ${address.phone}</strong></p>
    <p><strong>Email address: ${address.email}</strong></p>

    <p><strong>Payment Method:</strong> Cash on Delivery</p>

    <p>If you have any questions, feel free to contact our support team.</p>

    <hr />
    <p style="font-size: 0.9em; color: #777;">Thank you for shopping with us!</p>
    </div>
    `;

    const subject = `Order Confirmation – Order #${newOrdr._id}`;

    setImmediate(async () => {
      try {
        // Send admin email
        await sendMail(
          "New Order Received - COD",
          `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2E86C1;">New Order Received</h2>
    <p>You have received a new order from <strong>User ID: ${userId}</strong>.</p>

    <h3>Order Details:</h3>
    <ul>
    ${items
      .map((item) => `<li>${item.name} (${item.size}) x ${item.quantity}</li>`)
      .join("")}
    </ul>

    <p><strong>Total Amount:</strong> ₹${amount}</p>

    <h3>Delivery Address:</h3>
    <p>
    ${address.firstName}  ${address.lastName}<br/>
    ${address.street}<br/>
    ${address.city}, ${address.zipcode}<br/>
    ${address.state ? address.state + "<br/>" : ""}
    ${address.country}
    </p>

    <p><strong>Phone Number: ${address.phone}</strong></p>
    <p><strong>Email address: ${address.email}</strong></p>


    <p><strong>Payment Method:</strong> Cash on Delivery</p>

    <hr />
    <p style="font-size: 0.9em; color: #777;">Please process the order as soon as possible.</p>
    </div>
    `
        );

        // Send customer confirmation
        await sendMail(
          subject,
          htmlContent,
          user.email // 👈 Pass customer's email here
        );
      } catch (e) {
        console.error("Post-order actions failed:", e.message);
      }
    });

    res.json({ success: true, message: "Order Placed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Stripe Method
const placeOrderStripe = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const { origin } = req.headers;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Stripe",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData);
    await newOrder.save();

    const line_items = items.map((item) => ({
      price_data: {
        currency: currency,
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    line_items.push({
      price_data: {
        currency: currency,
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: deliveryCharge * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${origin}/verify?success=false&orderId=${newOrder._id}`,
      line_items,
      mode: "payment",
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Verify Stripe

const verifyStripe = async (req, res) => {
  const { orderId, success, userId } = req.body;

  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      await userModel.findByIdAndUpdate(userId, { cartData: {} });
      res.json({ success: true });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment was not successful." });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req, res) => {};

// All orders data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// User orders data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

// Update order status from Admin Panel
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    //await orderModel.findByIdAndUpdate(orderId, { status });
    // 1. Update order status
    const updatedOrder = await orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.json({ success: false, message: "Order not found" });
    }

    // 2. Get user info
    const user = await userModel.findById(updatedOrder.userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // 3. Send status update email to customer
    const htmlContent = `
      <h2>Order Status Updated</h2>
      <p>Dear ${user.name},</p>
      <p>Your order <strong>#${updatedOrder._id}</strong> has been updated to: <strong>${status}</strong>.</p>
      <p>Thank you for shopping with us!</p>
    `;

    await sendMail(
      `📦 Order Status Update: ${status}`,
      htmlContent,
      user.email // 👈 Pass customer's email here
    );

    console.log(user.email);

    res.json({ success: true, message: "Order Status Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export {
  placeOrder,
  placeOrderRazorpay,
  placeOrderStripe,
  allOrders,
  userOrders,
  updateStatus,
  verifyStripe,
};
