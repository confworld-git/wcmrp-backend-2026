import crypto from "crypto";
import Payment from "../schema/payment.schema.js";
import razorpay from "../config/payment_gateway.config.js";
import Registration from "../schema/registration.schema.js";

export const payment_validate = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      Order_ID,
    } = req.body;
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const digest = sha.digest("hex");

    if (digest !== razorpay_signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    const paymentDetails = await razorpay.payments.fetch(razorpay_payment_id);

    const registrationData = await Registration.findOne({ id: Order_ID });

    if (registrationData) {
      registrationData.status = "Payment Paid";
      await registrationData.save();
      const paymentData = await Payment(paymentDetails);
      await paymentData.save();

      return res.status(200).json({
        msg: "Payment validated and registration updated successfully!",
      });
    } else {
      return res.status(404).json({ msg: "Registration not found." });
    }
  } catch (error) {
    console.error("Error during payment validation:", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const payment_cancel = async (req, res) => {
  // try {
  //   const { Order_ID } = req.body;
  //   const registrationData = await Registration.findOne({
  //     id: Order_ID,
  //   });

  //   const paymentDetails = await Payment.find({ id: Order_ID });
  //   paymentDetails.status = "Payment Canceled";
  //   await paymentDetails.save();
  //   registrationData.status = "Payment Canceled";
  //   await registrationData.save();

  //   res.status(200).json({ message: "Payment canceled." });
  // } catch (error) {
  //   console.error("Error while canceling order:", error);
  //   res.status(500).json({ message: "Internal server error." });
  // }
  try {
    const { order_id } = req.body;
    const registrationData = await Registration.findOne({ id: order_id });

    if (registrationData) {
      registrationData.status = "Payment Cancelled";
      await registrationData.save();
      return res.status(200).json({ msg: "Payment Cancelled" });
    } else {
      return res.status(404).json({ msg: "Registration not found." });
    }
  } catch (error) {
    console.error("Error updating payment cancellation:", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};

export const payment_verify = async (req, res) => {
  const { payment_id, order_id, signature } = req.body;
  try {
    const sha = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET);
    sha.update(`${order_id}|${payment_id}`);
    const digest = sha.digest("hex");
    if (digest !== signature) {
      return res.status(400).json({ msg: "Transaction is not legit!" });
    }

    const registrationDetails = await instance.payments.fetch(payment_id);

    const registrationData = await Registration.findOne({ order_id: order_id });
    if (registrationData) {
      registrationData.status = "Payment Success";
      registrationData.Razorpay_Payment_Details = registrationDetails;
      await registrationData.save();
      return res.status(200).json({
        msg: "Payment validated and registration updated successfully!",
      });
    } else {
      registrationData.status = "Payment Failed";
      return res.status(404).json({ msg: "Registration not found." });
    }
  } catch (error) {
    const registrationData = await Registration.findOne({ order_id: order_id });
    registrationData.status = "Payment Failed";
    console.error("Error during payment validation:", error);
    return res
      .status(500)
      .json({ msg: "Internal Server Error", error: error.message });
  }
};
