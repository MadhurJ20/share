import { useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';

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

  return (
    <main className="flex flex-col items-center justify-center font-inter">
      <h1 className='underline'>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="string"
          placeholder="Enter original URL"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom alias (optional)"
          value={alias}
          onChange={(e) => setCustomAlias(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {shortenUrl && (
        <div>
          <p>Short URL: <a href={shortenUrl} target="_blank" rel="noopener noreferrer">{shortenUrl}</a></p>
          <QRCodeSVG value={shortenUrl} />
        </div>
      )}
    </main>
  );
}
