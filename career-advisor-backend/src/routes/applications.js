
import express from "express";
import { z } from "zod";
import { verifyToken } from "../middleware/authMiddleware.js";
import { validate } from "../middleware/validate.js";
import {
  listApps,
  createApp,
  updateAppStatus,
  addInterview,
  deleteApp,
  toggleFavorite,
  toggleArchive,
} from "../controllers/applicationsController.js";
import prisma from "../lib/prisma.js";

const router = express.Router();

/**
GET /api/applications — lists user’s applications
 */
router.get("/", verifyToken, listApps);

/**
 POST /api/applications — saves or creates a job application
 */
router.post(
  "/",
  verifyToken,
  validate({
    body: z.object({
      job: z.object({
        title: z.string(),
        company: z.string(),
        location: z.string().optional(),
        industry: z.string().optional(),
        url: z.string().url(),
        jobType: z.string().optional(),
        description: z.string().optional(),
        datePosted: z.string().optional(),
      }),
      status: z
        .enum(["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"])
        .optional(),
    }),
  }),
  createApp
);

/**
PATCH /api/applications/:id/status — updates application status
 */
router.patch(
  "/:id/status",
  verifyToken,
  validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: z.object({
      status: z.string()
        .transform((val) => val.toUpperCase())
        .refine((val) =>
          ["SAVED", "APPLIED", "INTERVIEW", "OFFER", "REJECTED"].includes(val),
          { message: "Invalid status" }
        ),
    }),
  }),
  updateAppStatus
);

router.patch(
  "/:id/favorite",
  verifyToken,
  validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: z.object({ isFavorite: z.boolean() }),
  }),
  toggleFavorite
);

router.patch(
  "/:id/archive",
  verifyToken,
  validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: z.object({ isArchived: z.boolean() }),
  }),
  toggleArchive
);
router.delete("/:appId/interviews/:interviewId", verifyToken, async (req, res) => {
  try {
    const { appId, interviewId } = req.params;

    // Ensure interview belongs to that application
    const interview = await prisma.interview.findUnique({
      where: { id: Number(interviewId) },
    });
    if (!interview || interview.applicationId !== Number(appId))
      return res.status(404).json({ error: "Interview not found" });

    await prisma.interview.delete({ where: { id: Number(interviewId) } });
    res.json({ message: "Interview deleted" });
  } catch (err) {
    console.error("Delete interview error:", err);
    res.status(500).json({ error: "Failed to delete interview" });
  }
});

/**
POST /api/applications/:id/interviews — adds an interview
 */
router.post(
  "/:id/interviews",
  verifyToken,
  validate({
    params: z.object({ id: z.coerce.number().int() }),
    body: z.object({
      start: z.string().nonempty("Start time required"),
      end: z.string().nonempty("End time required"),
      mode: z.string().optional(),
      meetingLink: z.string().url().or(z.literal("")).optional(),
    }),
  }),
  addInterview
);



/**
 DELETE /api/applications/:id - Remove an application and its interviews
 */
router.delete(
  "/:id",
  verifyToken,
  validate({
    params: z.object({ id: z.coerce.number().int() }),
  }),
  deleteApp
);

export default router;
