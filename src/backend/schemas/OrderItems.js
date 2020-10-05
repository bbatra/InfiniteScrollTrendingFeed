import { Schema } from 'mongoose';

const OrderItem = new Schema({
  created: Date,
  orderId: String,
  itemName: String,
  quantity: Number,
  price: Number
});

export default OrderItem;