import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

/**
GET /applications — lists all applications by status
 */
export const listApps = async (req, res, next) => {
  try {
    const apps = await prisma.application.findMany({
      where: { userId: req.user.id },
      include: { job: true, interviews: true },
      orderBy: { appliedAt: "desc" },
    });
    res.json({ applications: apps });
  } catch (e) {
    next(e);
  }
};

/**
POST /applications — saves or creates a job entry
 */
export const createApp = async (req, res, next) => {
  try {
    const { job, status = "SAVED" } = req.body;
    const userId = req.user.id;

    if (!job?.url) {
      return res.status(400).json({ error: "Job URL is required" });
    }

    // 1. Find or create job by URL
    let existingJob = await prisma.job.findFirst({ where: { url: job.url } });

    if (!existingJob) {
      existingJob = await prisma.job.create({
        data: {
          title: job.title,
          company: job.company,
          location: job.location || "",
          industry: job.industry || "",
          jobType: job.jobType || "",
          description: job.description || "",
          url: job.url,
          datePosted: job.datePosted ? new Date(job.datePosted) : null,
        },
      });
    }

    // 2. Check if user already has an application for this job
    const existingApp = await prisma.application.findFirst({
      where: { userId, jobId: existingJob.id },
      include: { job: true },
    });

    if (existingApp) {
      // Toggle unsave: remove application if it's only saved
      if (existingApp.status === "SAVED") {
        await prisma.application.delete({ where: { id: existingApp.id } });
        return res.json({ message: "Job unsaved successfully", unsaved: true });
      } else {
        return res.json({
          message: "Already applied or progressed for this job",
          application: existingApp,
        });
      }
    }

    // 3. Otherwise, create a new saved application
    const newApp = await prisma.application.create({
      data: {
        userId,
        jobId: existingJob.id,
        status: status.toUpperCase(),
      },
      include: { job: true },
    });

    res.status(201).json({
      message: "Job saved successfully",
      application: newApp,
      unsaved: false,
    });
  } catch (e) {
    console.error(" createApp error:", e);
    res.status(500).json({ error: "Failed to save or toggle job" });
  }
};


/**
PATCH /applications/:id/status — updates status (Saved → Applied → Offer → Rejected)
 */
export const updateAppStatus = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { status } = req.body;

    const app = await prisma.application.update({
      where: { id },
      data: { status },
    });

    res.json({ application: app });
  } catch (e) {
    console.error(" Failed to update status:", e);
    next(e);
  }
};


/**
POST /applications/:id/interviews — adds an interview with conflict check
 */
export const addInterview = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const { start, end, mode, meetingLink, interviewId } = req.body;

    const startDate = new Date(start);
    const endDate = new Date(end);
    if (isNaN(startDate) || isNaN(endDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    if (endDate <= startDate) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    // Ensure the application belongs to this user
    const app = await prisma.application.findUnique({
      where: { id, userId: req.user.id },
      include: { interviews: true },
    });
    if (!app) return res.status(404).json({ error: "Application not found" });

    // Check overlap conflicts (ignore self if editing)
    const conflict = await prisma.interview.findFirst({
      where: {
        application: { userId: req.user.id },
        id: interviewId ? { not: interviewId } : undefined,
        start: { lt: endDate },
        end: { gt: startDate },
      },
    });
    
    if (conflict) {
      return res
        .status(409)
        .json({ error: "Interview time conflict — overlaps with another scheduled interview" });
    }

    let interview;

    // Case 1: Edit existing interview
    if (interviewId) {
      interview = await prisma.interview.update({
        where: { id: interviewId },
        data: {
          start: startDate,
          end: endDate,
          mode,
          meetingLink,
        },
      });
    } else {
      // Case 2: Replace any existing interview for this app
      const existing = await prisma.interview.findFirst({
        where: { applicationId: id },
      });

      if (existing) {
        interview = await prisma.interview.update({
          where: { id: existing.id },
          data: {
            start: startDate,
            end: endDate,
            mode,
            meetingLink,
          },
        });
      } else {
        // Case 3: No interview yet → create one
        interview = await prisma.interview.create({
          data: {
            applicationId: id,
            start: startDate,
            end: endDate,
            mode,
            meetingLink,
          },
        });
      }
    }

    res.json({ interview });
  } catch (err) {
    console.error(" Error saving interview:", err);
    res.status(500).json({ error: "Failed to save interview" });
  }
};




/**
 DELETE /applications/:id — removes an application and its interviews
 */
export const deleteApp = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.application.findUnique({ where: { id } });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }
    await prisma.interview.deleteMany({ where: { applicationId: id } });
    await prisma.application.delete({ where: { id } });
    res.json({ ok: true });
  } catch (e) {
    next(e);
  }
};
// Toggle favorite
export const toggleFavorite = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const app = await prisma.application.update({
      where: { id },
      data: { isFavorite: { set: req.body.isFavorite } },
    });
    res.json({ application: app });
  } catch (e) {
    next(e);
  }
};

// Toggle archive
export const toggleArchive = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const app = await prisma.application.update({
      where: { id },
      data: { isArchived: { set: req.body.isArchived } },
    });
    res.json({ application: app });
  } catch (e) {
    next(e);
  }
};

