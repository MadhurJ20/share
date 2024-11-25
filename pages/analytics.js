import { useEffect } from "react";
import { useState } from "react";

import { Copy, Check, Mouse, Trash2, ImageDown, MousePointerClick } from "lucide-react";
import { Calendar, Pencil, Link, ExternalLink } from "lucide-react";

import { Nav } from "@components/nav";
import SearchUrls from "@components/searchURL";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "@components/ui/dialog";
import { DeleteUrlDialog } from "@components/deleteUrl";

export default function Analytics() {
  const [urls, setUrls] = useState([]);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [clickedButton, setClickedButton] = useState(null);
  const [copiedUrl, setCopiedUrl] = useState(null);
  const [open, setOpen] = useState(false);
  const [urlToDelete, setUrlToDelete] = useState(null);

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


  const handleDelete = async (urlId) => {
    try {
      const res = await fetch(`/api/analytics?id=${urlId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setUrls(urls.filter((url) => url._id !== urlId));  // Remove the deleted URL from the state
        toast.success('URL deleted successfully!');
      } else {
        const { message } = await res.json();
        toast.error(message || 'Failed to delete URL');
      }
    } catch (error) {
      toast.error('Error deleting URL');
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
                    <h2 className="flex justify-between p-1 space-x-4">
                      <main className="flex items-center space-x-4">
                        <Link className="w-5 h-5" />
                        <a href={url.shortenUrl}
                          target="_blank" rel="noopener noreferrer"
                          className='inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline'
                        >{url.shortenUrl}</a>
                      </main>
                      <aside className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                          <span className="flex w-4 aspect-square">
                            {copiedUrl === url.shortenUrl ? <Check /> : <Copy />}
                          </span>
                        </Button>
                        <Button type="button" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                          <span className="flex w-4 aspect-square">
                            <ImageDown />
                          </span>
                        </Button>
                      </aside>
                    </h2>
                    <h2 className="flex justify-between p-1 space-x-4">
                      <main className="flex items-center space-x-4">
                        <ExternalLink className="w-5 h-5" />
                        <a href={url.originalUrl}
                          target="_blank" rel="noopener noreferrer"
                          className='inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline'
                        >{url.originalUrl}</a>
                      </main>
                      <aside className="flex gap-2">
                        <Button type="button" variant="outline" onClick={() => { setUrlToDelete(url._id); setOpen(true) }}>
                          <span className="flex w-4 aspect-square">
                            <Trash2 />
                          </span>
                        </Button>
                        <Button type="button" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                          <span className="flex w-4 aspect-square">
                            <Pencil />
                          </span>
                        </Button>
                      </aside>
                    </h2>
                  </header>
                  <section className="flex justify-between gap-2">
                    <article className="flex flex-col my-4 space-y-1 text-sm">
                      <span className="flex items-center space-x-2"><Calendar className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.createdAt).toLocaleString()}</span></span>
                      <span className="flex items-center space-x-2"><Pencil className="w-4 h-4" /> <span className="text-muted-foreground">{new Date(url.updatedAt).toLocaleString()}</span></span>
                      <span className="flex items-center space-x-2"><MousePointerClick className="w-4 h-4" /> <span className="text-muted-foreground">Clicks: {url.accesses.count}</span></span>
                    </article>
                    <aside>
                      <Button type="button" className="mt-2" variant="outline" onClick={() => handleCopy(url.shortenUrl)}>
                        <span className="flex">
                          Recents
                        </span>
                      </Button>
                    </aside>
                  </section>
                  {
                    url.accesses.lastAccessed.length > 1 ? (
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
                    )
                  }

                </li>
              ))}
            </ul>

          ) : (
            <p>No URLs found</p>
          )}
        </div>
        <DeleteUrlDialog
          open={open}
          setOpen={setOpen}
          urlToDelete={urlToDelete}
          handleDelete={handleDelete}
        />
      </div>
    </main>
  );
};