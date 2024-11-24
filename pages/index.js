import { useRef, useState } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Copy, Github, Link, Share } from 'lucide-react';

import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { toast } from 'sonner';

export default function Home() {
  const [originalUrl, setOriginalUrl] = useState('');
  const [alias, setCustomAlias] = useState('');
  const [shortenUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');
  const qrCodeRef = useRef(null);

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


  const handleCopy = () => {
    if (shortenUrl) {
      navigator.clipboard.writeText(shortenUrl)
        .then(() => {
          toast.success('URL copied to clipboard!');
        })
        .catch((err) => {
          toast.error('Failed to copy: ' + err);
        });
    }
  };

  const handleClear = () => {
    setOriginalUrl('');
    setCustomAlias('');
    setShortUrl('');
    setError('');
  };

  console.log("Look at me: ", generateQRCodeValue(shortenUrl));
  return (
    <main className="flex flex-col items-center justify-center h-screen font-inter min-h-svh">
      <div className="relative py-24 overflow-hidden lg:py-32">
        {/* Gradients */}
        <div
          aria-hidden="true"
          className="absolute flex transform -translate-x-1/2 -top-96 start-1/2"
        >
          <div className="bg-gradient-to-r from-background/50 to-background blur-3xl w-[25rem] h-[44rem] rotate-[-60deg] transform -translate-x-[10rem]" />
          <div className="bg-gradient-to-tl blur-3xl w-[90rem] h-[50rem] rounded-full origin-top-left -rotate-12 -translate-x-[15rem] from-primary-foreground via-primary-foreground to-background" />
        </div>
        <div className="relative z-10">
          <div className="container py-10 lg:py-16">
            <div className="max-w-2xl mx-auto text-center">
              <p className="small-caps">URL Shortener + QR Code Generator</p>
              <header className="max-w-2xl mt-5">
                <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
                  Enter The Link!
                </h1>
              </header>
              <article className="max-w-2xl mt-5">
                <p className="text-lg text-muted-foreground">
                  Enter your link below. In case you want to see analytics
                  head over to the <a href='/analytics' className='hover:underline'><span>analytics page</span><Link className='inline-block w-6 ps-1 pe-1 aspect-square' /></a>. Each link can only be shortened once.
                </p>
              </article>
              {/* Buttons */}
              <form className="flex flex-col justify-center gap-3 mt-8" onSubmit={handleSubmit}>
                <section className='flex flex-col justify-center gap-3 mt-2 md:flex-row'>
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
                </section>
                <footer className='flex flex-row gap-3'>
                  <Button type="submit" className='flex-1'>Shorten</Button>
                  <Button type="button" className='flex flex-1 w-max' onClick={handleClear}>Clear</Button>
                  <Button type="button" variant='outline'><span className='flex w-4 aspect-square' onClick={handleCopy}><Copy /></span></Button>
                  <Button type="button" variant='outline'><span className='flex w-4 aspect-square'><Share /></span></Button>
                  <Button type="button" variant='outline'><a className='flex w-4 aspect-square' href="https://github.com/ACES-RMDSSOE/qr-code-generator"><Github /></a></Button>
                </footer>
              </form>
              <section className='mt-4'>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {shortenUrl && (
                  <div className='flex flex-col items-center justify-center gap-4'>
                    <header className='flex flex-row items-center justify-center gap-4'>
                      <h2 className='text-xl font-semibold small-caps text-muted-foreground'>Short URL:</h2>
                      <a href={shortenUrl}
                        target="_blank" rel="noopener noreferrer"
                        className='font-mono font-thin text-primary hover:underline'
                      >{shortenUrl}</a>
                    </header>
                    <footer>
                      <QRCodeSVG value={generateQRCodeValue(shortenUrl)}
                        title={"Scan me!"}
                        size={128}
                        bgColor={"#ffffff"}
                        fgColor={"#000000"}
                        level={"H"}
                        marginSize={1}
                        imageSettings={{
                          src: "https://raw.githubusercontent.com/ACES-RMDSSOE/Website/main/images/favicon.ico",
                          x: undefined,
                          y: undefined,
                          height: 24,
                          width: 24,
                          opacity: 1,
                          excavate: true,
                        }} />
                    </footer>
                  </div>
                )}
              </section>
              {/* End Buttons */}
            </div>
          </div>
        </div>
      </div>

    </main>
  );
}
