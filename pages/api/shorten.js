import dbConnect from '../../utils/db';
import Url from '../../Models/url';
import { nanoid } from 'nanoid';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { originalUrl, alias } = req.body;

  if (!originalUrl) {
    return res.status(400).json({ message: 'Original URL is required' });
  }

  await dbConnect();

  try {
    // Check if alias already exists (only if alias is provided)
    if (alias) {
      const existingAlias = await Url.findOne({ alias });
      if (existingAlias) {
        return res.status(400).json({ message: 'Custom alias already in use' });
      }
    }

    const shortenUrl = alias || nanoid(6);  

    const newUrl = await Url.create({ originalUrl, shortenUrl, alias: alias || undefined });

    res.status(201).json({ shortenUrl: `${process.env.BASE_URL}/${shortenUrl}` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
