import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getGalleryItems = async (req: Request, res: Response) => {
  const { category } = req.query;

  try {
    const filters: any = {};
    if (category) filters.category = category.toString();

    const items = await prisma.galleryItem.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });

    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createGalleryItem = async (req: Request, res: Response) => {
  const { imageUrl, caption, category } = req.body;

  try {
    if (!imageUrl || !category) {
      return res.status(400).json({ error: 'Image URL and Category are required' });
    }

    const newItem = await prisma.galleryItem.create({
      data: {
        imageUrl,
        caption: caption || '',
        category
      }
    });

    res.status(201).json(newItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteGalleryItem = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.galleryItem.delete({
      where: { id }
    });
    res.json({ message: 'Gallery item deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
