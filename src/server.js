import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import cors from "cors";

import { middlelog } from "./middleware/middleware.js";
import { db } from "./config/db.config.js";
import admin from "./routes/admin.route.js";
import speaker from "./routes/speaker.route.js";
import sponsor from "./routes/sponsor.route.js";
import deadline from "./routes/deadline.route.js";
import contact from "./routes/contact.route.js";
import download from "./routes/download.route.js";
import registration from "./routes/registration.route.js";
import paper_submission from "./routes/paper_submission.route.js";
import payment from "./routes/payment.route.js";
import enquriy from "./routes/enquiry.route.js";
import committee_member from "./routes/committee_member.route.js";
import image from "./routes/image.route.js";
import coupon from "./routes/coupon.route.js";

dotenv.config();
const server = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:30005",
  "https://backend.wcmrp.com",
  "https://wcmrp.com",
  "http://wcmrp.com",
  "https://wcmrp.infinityuniquers.com/"
];

server.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
}));


server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.use(cookieParser());

server.use(middlelog);

server.use(admin);
server.use(speaker);
server.use(sponsor);
server.use(deadline);
server.use(contact);
server.use(download);
server.use(registration);
server.use(paper_submission);
server.use(payment);
server.use(enquriy);
server.use(committee_member);
server.use(image);
server.use(coupon);

server.get("/", (req, res) => {
  res.json({
    message: "Server is running",
  });
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
