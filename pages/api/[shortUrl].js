import dbConnect from '../../utils/db';
import Url from '../../Models/url';

export default async function handler(req, res) {
  const { shortUrl } = req.query;

  await dbConnect();

  try {
    const url = await Url.findOne({ shortenUrl: shortUrl });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    url.accesses += 1;  // Increment the access count
    await url.save();

    res.writeHead(302, { Location: url.originalUrl });
    res.end();
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
