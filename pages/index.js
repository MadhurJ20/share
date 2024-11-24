import { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setCustomAlias] = useState('');
  const [shortenUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    const formattedUrl = originalUrl.startsWith('http://') || originalUrl.startsWith('https://')
      ? originalUrl
      : `http://${originalUrl}`;

    try {
      const res = await fetch('/api/shorten', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ originalUrl, alias }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShortUrl(data.shortenUrl);
    } catch (err) {
      setError(err.message);
    }
  };

  const BASE_URL = process.env.BASE_URL || originalUrl;
  const generateQRCodeValue = (url) => {
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      if (process.env.BASE_URL == '') return `http://${BASE_URL}`;
      else return `${url}`;
    }
    return url;
  };

  console.log("Look at me: ", generateQRCodeValue(shortenUrl));
  return (
    <main className="flex flex-col items-center justify-center font-inter">
      <h1 className='text-2xl'>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <Input
          type="text"
          placeholder="Custom alias (optional)"
          value={alias}
          onChange={(e) => setCustomAlias(e.target.value)}
        />
        <Button type="submit">Shorten</Button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortenUrl && (
        <div>
          <p>Short URL: <a href={shortenUrl} target="_blank" rel="noopener noreferrer">{shortenUrl}</a></p>
          <QRCodeSVG value={generateQRCodeValue(shortenUrl)} />
        </div>
      )}
    </main>
  );
}
