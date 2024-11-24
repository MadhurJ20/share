
'use client';
// import "./globals.css";
import { useState } from 'react';
import {QRCodeCanvas} from 'qrcode.react';

export default function Home() {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [shortenedUrl, setShortenedUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, alias }),
    });
    const data = await response.json();
    setShortenedUrl(data.shortenedUrl);
  };

  return (
    <div>
      <h1>URL Shortener</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="url"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Custom Alias (optional)"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <button type="submit">Shorten</button>
      </form>

      {shortenedUrl && (
        <div>
          <p>Shortened URL: <a href={shortenedUrl}>{shortenedUrl}</a></p>
          <QRCode value={shortenedUrl} />
        </div>
      )}
    </div>
  );
}
