// routes/places.js
import { Router } from "express";
import { getPlaces, getPlaceById, getCities } from "../controllers/placesController.js";

const router = Router();

router.get("/", getPlaces);
router.get("/cities", getCities);
router.get("/:id", getPlaceById);

export default router;
