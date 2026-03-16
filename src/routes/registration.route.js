import express from "express";
import { authorization } from "../middleware/middleware.js";
import {
  registration_GetAll,
  registration_GetById,
  registration_Create,
} from "../controllers/registration.controllers.js";

const registration = express.Router();

registration.get("/registration", authorization, registration_GetAll);
registration.get("/registration/:id", registration_GetById);
registration.post("/registration", registration_Create);

export default registration;
