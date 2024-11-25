import { useState, useEffect } from "react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandDialog
} from "@components/ui/command";
import { LinkIcon, ExternalLinkIcon } from "lucide-react";
import Link from "next/link";

const SearchUrls = () => {
  const [error, setError] = useState('');
  const [urls, setUrls] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // Track the selected item index
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter URLs based on search query
  const filteredUrls = urls.filter((url) =>
    url.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
    url.shortenUrl.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle keydown events for navigation and selection
  const handleKeyDown = (e) => {
    // Allow the input to focus and type freely
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
  }, [filteredUrls, selectedIndex]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen} className="border rounded-lg max-w-3/4 lg:w-1/4">
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
                <article className="flex items-center gap-2 p-1">
                  <section className="flex flex-col space-y-2">
                    <main className="flex items-center space-x-3 font-mono">
                      <ExternalLinkIcon className="w-4 h-4" />
                      <a
                        href={url.originalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-normal hover:text-blue-400 hover:underline"
                      >
                        {url.originalUrl.replace(/^https?:\/\//, '')}
                      </a>
                    </main>
                    <div className="flex items-center space-x-3 font-mono text-muted-foreground">
                      <LinkIcon className="w-4 h-4" />
                      <Link
                        href={`/analytics?id=${url._id}`}
                        target="_blank"
                        className="text-[.85rem] hover:underline"
                        passHref
                      >
                        {url.shortenUrl}
                      </Link>
                    </div>
                  </section>
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
