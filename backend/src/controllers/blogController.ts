import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getBlogs = async (req: Request, res: Response) => {
  const { category, isPublished } = req.query;

  try {
    const filters: any = {};
    if (category) filters.category = category;
    if (isPublished !== undefined) {
      filters.isPublished = isPublished === 'true';
    }

    const blogs = await prisma.blogPost.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' }
    });

    res.json(blogs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogBySlug = async (req: Request, res: Response) => {
  const { slug } = req.params;

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { slug }
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getBlogById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const blog = await prisma.blogPost.findUnique({
      where: { id }
    });

    if (!blog) {
      return res.status(404).json({ error: 'Blog post not found' });
    }

    res.json(blog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createBlog = async (req: Request, res: Response) => {
  const data = req.body;

  try {
    if (!data.title || !data.slug || !data.content) {
      return res.status(400).json({ error: 'Title, slug, and content are required' });
    }

    const newBlog = await prisma.blogPost.create({
      data
    });

    res.status(201).json(newBlog);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateBlog = async (req: Request, res: Response) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const updated = await prisma.blogPost.update({
      where: { id },
      data
    });

    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.blogPost.delete({
      where: { id }
    });

    res.json({ message: 'Blog post deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
