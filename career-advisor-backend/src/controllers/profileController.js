
import prisma from "../lib/prisma.js";
import fs from "fs";
import path from "path";

// ======================= GET PROFILE =======================
export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        profile: true,
        skills: { include: { skill: true } },
        resumes: { orderBy: { uploadedAt: "desc" }, take: 1 },
      },
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    const skillNames = user.skills.map((us) => us.skill.name);
    const latestResume = user.resumes[0]?.fileUrl || null;

    res.json({
      profile: {
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
        title: user.profile?.title || "",
        bio: user.profile?.bio || "",
        location: user.profile?.location || "",
        skills: skillNames,
        resume: latestResume,
        aiCourses: user.profile?.aiCourses || [],
        aiArticles: user.profile?.aiArticles || [],
        aiAdvice: user.profile?.aiAdvice || [],
      },
    });
  } catch (err) {
    console.error(" Error fetching profile:", err);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
};

// ======================= UPSERT PROFILE =======================
export const upsertProfile = async (req, res) => {
  try {
    console.log("Incoming profile payload:", req.body);
    const userId = req.user.id;

    const {
      title,
      bio,
      location,
      skills,
      firstName,
      lastName,
      aiCourses,
      aiArticles,
      aiAdvice,
    } = req.body;

    //  Fetch existing user & profile
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true, skills: { include: { skill: true } } },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    //  Merge logic (preserve old data if missing in new payload)
    const mergedProfile = {
      title: title ?? existingUser.profile?.title ?? "",
      bio: bio ?? existingUser.profile?.bio ?? "",
      location: location ?? existingUser.profile?.location ?? "",
      aiCourses: aiCourses ?? existingUser.profile?.aiCourses ?? [],
      aiArticles: aiArticles ?? existingUser.profile?.aiArticles ?? [],
      aiAdvice: aiAdvice ?? existingUser.profile?.aiAdvice ?? [],
      resume: existingUser.profile?.resume ?? null,
    };

    //  Update profile safely
    await prisma.profile.upsert({
      where: { userId },
      update: mergedProfile,
      create: { userId, ...mergedProfile },
    });

    // Update user table fields (only if provided)
    await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: firstName ?? existingUser.firstName,
        lastName: lastName ?? existingUser.lastName,
      },
    });

    // Merge + sync skills only if provided
    if (Array.isArray(skills)) {
      const existingSkillNames = existingUser.skills.map((s) => s.skill.name);

      // Add new ones
      for (const skillName of skills) {
        if (!existingSkillNames.includes(skillName)) {
          const skill = await prisma.skill.upsert({
            where: { name: skillName },
            update: {},
            create: { name: skillName },
          });
          await prisma.userSkill.create({
            data: { userId, skillId: skill.id },
          });
        }
      }

      // Remove missing ones
      for (const s of existingUser.skills) {
        if (!skills.includes(s.skill.name)) {
          await prisma.userSkill.delete({ where: { id: s.id } });
        }
      }
    }

    res.json({ message: " Profile safely updated (merged fields)" });
  } catch (err) {
    console.error("Error saving profile:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
};


// ======================= UPLOAD RESUME =======================
// ======================= UPLOAD RESUME =======================
export const uploadResume = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const fileUrl = `/uploads/${file.filename}`;

    // Delete previous resume file (if exists)
    const oldResume = await prisma.resume.findFirst({
      where: { userId },
      orderBy: { uploadedAt: "desc" },
    });
    if (oldResume) {
      const oldPath = path.join(process.cwd(), "src", oldResume.fileUrl);
      try {
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      } catch (e) {
        console.warn(" Failed to delete old resume file:", e.message);
      }
      await prisma.resume.delete({ where: { id: oldResume.id } });
    }

    // Create new resume entry
    const newResume = await prisma.resume.create({
      data: { userId, fileUrl },
    });

    // Fetch existing profile so we don’t overwrite user data
    const existing = await prisma.profile.findUnique({
      where: { userId },
    });

    //  Update or create profile with resume path (merge safely)
    await prisma.profile.upsert({
      where: { userId },
      update: {
        resume: fileUrl,
        firstName: existing?.firstName || undefined,
        lastName: existing?.lastName || undefined,
        title: existing?.title || undefined,
        bio: existing?.bio || undefined,
        location: existing?.location || undefined,
        skills: existing?.skills || [],
        aiCourses: existing?.aiCourses || [],
        aiArticles: existing?.aiArticles || [],
        aiAdvice: existing?.aiAdvice || [],
      },
      create: {
        userId,
        resume: fileUrl,
        firstName: existing?.firstName || "",
        lastName: existing?.lastName || "",
        title: existing?.title || "",
        bio: existing?.bio || "",
        location: existing?.location || "",
        skills: existing?.skills || [],
        aiCourses: existing?.aiCourses || [],
        aiArticles: existing?.aiArticles || [],
        aiAdvice: existing?.aiAdvice || [],
      },
    });

    //  Return combined info to frontend
    res.json({
      message: "Resume uploaded successfully!",
      fileUrl,
      resume: newResume,
    });
  } catch (err) {
    console.error(" Resume upload error:", err);
    res.status(500).json({ error: "Failed to upload resume" });
  }
};


