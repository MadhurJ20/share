import dbConnect from '../../utils/db';
import Url from '../../Models/url';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { url, alias } = req.body;

    await dbConnect();

    const shortUrl = alias || Math.random().toString(36).substr(2, 6);
    const newUrl = await Url.create({
      originalUrl: url,
      shortUrl,
      customAlias: alias || null,
    });

    res.status(200).json({ shortenedUrl: `${process.env.BASE_URL}/${shortUrl}` });
  }
}
