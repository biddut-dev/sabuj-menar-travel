import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.websiteSettings.findFirst();
    if (!settings) {
      settings = await prisma.websiteSettings.create({ data: {} });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSettings = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    let settings = await prisma.websiteSettings.findFirst();
    if (!settings) {
      settings = await prisma.websiteSettings.create({ data });
    } else {
      settings = await prisma.websiteSettings.update({
        where: { id: settings.id },
        data
      });
    }
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getHomepageContent = async (req: Request, res: Response) => {
  try {
    let content = await prisma.homepageContent.findFirst();
    if (!content) {
      content = await prisma.homepageContent.create({
        data: {
          aboutStory: 'Story not configured.',
          aboutStoryEn: 'Story not configured.',
          aboutMission: 'Mission not configured.',
          aboutMissionEn: 'Mission not configured.',
          aboutVision: 'Vision not configured.',
          aboutVisionEn: 'Vision not configured.'
        }
      });
    }
    res.json(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateHomepageContent = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    let content = await prisma.homepageContent.findFirst();
    if (!content) {
      content = await prisma.homepageContent.create({ data });
    } else {
      content = await prisma.homepageContent.update({
        where: { id: content.id },
        data
      });
    }
    res.json(content);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
