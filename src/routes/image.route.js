import express from "express";
import { getImage } from "../controllers/image.controllers.js";

const Image = express.Router();
Image.get("/image/:id", getImage);

export default Image;
