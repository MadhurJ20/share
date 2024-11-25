import { useState, useEffect } from "react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandSeparator, CommandList, CommandDialog } from "@components/ui/command";
import { Link2 } from "lucide-react";
import { LinkIcon } from "lucide-react";

const SearchUrls = () => {
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([]);
  const [open, setOpen] = useState(false);

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

  const handleKeyDown = (e) => {
    if (e.key === "k" && (e.metaKey || e.ctrlKey || e.altKey)) {
      e.preventDefault();
      setOpen((prev) => !prev);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="w-3/4 border rounded-lg shadow-md lg:w-1/4">
      <CommandInput
        placeholder="Search for a link..."
        onChange={handleSearchChange}
        className="z-10 px-4 py-2"
      />
      <CommandList className="px-2 py-4">
        {urls.length === 0 ? (
          <CommandEmpty>{error ? error : "No URLs found"}</CommandEmpty>
        ) : (
          <CommandGroup heading="Search URLs">
            {urls.map((url, index) => (
              <CommandItem key={index}>
                <article className="flex items-center gap-2">
                  <LinkIcon />
                  <main className="flex flex-col font-mono">
                    <a
                      href={url.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:text-blue-400 hover:underline"
                    >
                      {url.originalUrl.replace(/^https?:\/\//, '')}
                    </a>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <a
                        href={url.shortenUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-blue-400 hover:underline"
                      >
                        {url.shortenUrl}
                      </a>
                    </div>
                  </main>
                </article>

              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

export default SearchUrls;
