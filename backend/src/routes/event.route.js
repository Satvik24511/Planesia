import express from "express";
import {today, month, day, create, details, joinEvent, deleteEvent, updateEvent, leaveEvent, getAllEvents, myEvents, attendingEvents} from "../controllers/event.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();
router.use(protectRoute);

router.get("/today", today);
router.get("/month/:year/:month", month);
router.get("/day/:year/:month/:day", day);
router.post("/", create);
router.get("/allEvents", getAllEvents);
router.get("/myEvents", myEvents);
router.get("/attending", attendingEvents);
router.post("/join/:id", joinEvent);
router.get("/:id", details);
router.delete("/:id", deleteEvent);
router.put("/:id", updateEvent);
router.post("/:id/leave", leaveEvent);



export default router;