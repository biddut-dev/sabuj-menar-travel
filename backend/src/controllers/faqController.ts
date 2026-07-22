import { Request, Response } from 'express';
import prisma from '../lib/prisma';

export const getFAQs = async (req: Request, res: Response) => {
  try {
    const faqs = await prisma.fAQ.findMany({
      orderBy: { order: 'asc' }
    });
    res.json(faqs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createFAQ = async (req: Request, res: Response) => {
  const { question, questionEn, answer, answerEn, category, order } = req.body;

  try {
    if (!question || !answer || !category) {
      return res.status(400).json({ error: 'Question, answer, and category are required' });
    }

    const faq = await prisma.fAQ.create({
      data: {
        question,
        questionEn: questionEn || question,
        answer,
        answerEn: answerEn || answer,
        category,
        order: order ? parseInt(order.toString()) : 0
      }
    });

    res.status(201).json(faq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateFAQ = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { question, questionEn, answer, answerEn, category, order } = req.body;

  try {
    const faq = await prisma.fAQ.update({
      where: { id },
      data: {
        question,
        questionEn: questionEn || question,
        answer,
        answerEn: answerEn || answer,
        category,
        order: order ? parseInt(order.toString()) : undefined
      }
    });

    res.json(faq);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteFAQ = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.fAQ.delete({
      where: { id }
    });
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
