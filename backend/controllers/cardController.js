import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";

// add product to user cart
const addToCart = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;

    const userData = await userModel.findById(userId);
    console.log(userData);

    if (!userData) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await productModel.findById(itemId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const sizeData = product.sizes?.find((s) => s.size === size);
    const availableStock = sizeData?.quantity || 0;

    let cartData = (await userData.cartData) || {};

    const existingQty = cartData?.[itemId]?.[size] || 0;

    if (existingQty >= availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in size ${size}`,
      });
    }

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }

    await userModel.findByIdAndUpdate(userId, { cartData });

    res.json({ success: true, message: "Added To Cart" });
  } catch (error) {
    //console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const updateCart = async (req, res) => {
  try {
    const { userId, itemId, size, quantity } = req.body;
    const userData = await userModel.findById(userId);

    const product = await productModel.findById(itemId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const sizeData = product.sizes?.find((s) => s.size === size);
    const availableStock = sizeData?.quantity || 0;

    if (quantity > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Only ${availableStock} items available in size ${size}`,
      });
    }

    let cartData = await userData.cartData;
    cartData[itemId][size] = quantity;

    await userModel.findByIdAndUpdate(userId, { cartData });
    res.json({ success: true, message: "Cart Updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
const getUserCart = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId);

    let cartData = await userData.cartData;

    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addToCart, updateCart, getUserCart };
