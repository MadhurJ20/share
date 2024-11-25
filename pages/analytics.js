import { useEffect } from "react";
import { useState } from "react";

import { Copy, Check } from "lucide-react";
import { Calendar } from "lucide-react";
import { Pencil } from "lucide-react";
import { Link } from "lucide-react";
import { ExternalLink } from "lucide-react";

import { Nav } from "@components/nav";
import SearchUrls from "@components/searchURL";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { toast } from "sonner";

export default function Analytics() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);

  useEffect(() => {
    const fetchUrls = async () => {
      try {
        const res = await fetch('/api/analytics');
        const data = await res.json();
        setUrls(data); // Store the fetched data in state
      } catch (error) {
        setError('Failed to fetch URLs');
      }
    };

    fetchUrls();
  }, []);

  const handleCopy = (shortenUrl) => {
    if (shortenUrl) {
      navigator.clipboard.writeText(shortenUrl)
        .then(() => {
          toast.success('URL copied to clipboard!');
          setCopiedUrl(shortenUrl);
        })
        .catch((err) => {
          toast.error('Failed to copy: ' + err);
        });
    }
  };

  const handleClick = (buttonName, action = () => { }) => {
    action();
    setClickedButton(buttonName);
    setTimeout(() => {
      setClickedButton(null);
    }, 1000);
  };

  const filteredUrls = urls.filter((url) =>
    url.shortenUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <main className="relative overflow-x-hidden flex flex-col items-center justify-center h-screen font-inter min-h-svh bg-zinc-50 dark:bg-[#09090b]">
      <Nav />
      <div className="relative w-full py-24 overflow-x-hidden lg:py-32">
        <div className="container py-10 mx-auto lg:py-16">

          <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-10 overflow-hidden">
            <h1 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl">
              Analytics
            </h1>
            {/* <SearchUrls /> */}
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by URL..."
              className="max-w-2xl focus-visible:ring-0 focus-visible:ring-offset-0" />
          </header>
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {urls.length > 0 ? (
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredUrls.map((url) => (
                <li key={url._id} id={url._id} className="p-4 rounded-lg shadow-lg url-card">
                  <header className="flex flex-col gap-0 !text-sm">
                    <h2 className="flex justify-between p-2 space-x-4">
                      <main className="flex items-center space-x-4">
                        <Link className="w-5 h-5" />
                        <a href={url.shortenUrl}
                          target="_blank" rel="noopener noreferrer"
                          className='inline-block px-4 py-2 font-mono border rounded-lg text-primary hover:underline'
                        >{url.shortenUrl}</a>
                      </main>
                      <aside>
                        <Button type="button" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                          <span className="flex w-4 aspect-square">
                            {copiedUrl === url.shortenUrl ? <Check /> : <Copy />}
                          </span>
                        </Button>
                      </aside>
                    </h2>
                    <h2 className="flex items-center p-2 space-x-4">
                      <ExternalLink className="w-5 h-5" />
                      <a href={url.originalUrl}
                        target="_blank" rel="noopener noreferrer"
                        className='inline-block px-4 py-2 font-mono border rounded-lg text-primary hover:underline'
                      >{url.originalUrl}</a>
                    </h2>
                  </header>
                  <section className="flex flex-col my-4 space-y-1 text-sm">
                    <span className="flex items-center space-x-2"><Calendar className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.createdAt).toLocaleString()}</span></span>
                    <span className="flex items-center space-x-2"><Pencil className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.updatedAt).toLocaleString()}</span></span>
                  </section>
                  <strong>Access Count:</strong> {url.accesses.count}
                  {url.accesses.lastAccessed.length > 1 ? (
                    <div>
                      <strong>Last Accessed:</strong>
                      <ul>
                        {url.accesses.lastAccessed.map((date, index) => (
                          <li key={index}>{new Date(date).toLocaleString()}</li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div><strong>Last Accessed:</strong> Never accessed</div>
                  )}
                </li>
              ))}
            </ul>

          ) : (
            <p>No URLs found</p>
          )}
        </div>
      </div>
    </main>
  );
};