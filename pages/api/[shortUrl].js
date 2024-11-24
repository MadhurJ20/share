import dbConnect from '../../utils/db';
import Url from '../../Models/url';

export default async function handler(req, res) {
  const { shortUrl } = req.query;

  // Ensure database connection
  await dbConnect();

  try {
    // Find URL by the short URL
    const url = await Url.findOne({ shortenUrl: shortUrl });
    if (!url) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Increment the access count
    url.accesses += 1;
    await url.save();

    // Perform the redirection
    res.redirect(302, url.originalUrl);
  } catch (error) {
    console.error('Error redirecting to original URL:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
