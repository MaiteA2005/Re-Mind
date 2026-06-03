import express from "express";
import BusinessRequest from "../models/BusinessRequest.js";
import protect from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  try {
    const { company, contact, email, teamSize, phone, message } = req.body;

    if (!company || !contact || !email || !teamSize) {
      return res.status(400).json({
        message:
          "Bedrijfsnaam, contactpersoon, email en teamgrootte zijn verplicht",
      });
    }

    const request = await BusinessRequest.create({
      userId: req.user._id,
      company,
      contact,
      email,
      teamSize,
      phone,
      message,
      status: "approved",
    });

    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      {
        subscriptionPlan: "business",
        businessRole: "admin",
        businessName: company,
      },
      { new: true }
    ).select("-password");

    res.status(201).json({
      message: "Business aanvraag opgeslagen en bedrijfslicentie geactiveerd",
      request,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({
      message: "Aanvraag kon niet opgeslagen worden",
      error: error.message,
    });
  }
});

export default router;