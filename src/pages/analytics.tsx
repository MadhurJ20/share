import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import Link from "next/link";
import { SpeedInsights } from "@vercel/speed-insights/next";

import { toast } from "sonner";

import {
  QrCode,
  Calendar,
  Pencil,
  Link as LinkIcon,
  ExternalLink,
  RefreshCcw,
  ChartSpline,
  Copy,
  Check,
  Trash2,
  MousePointerClick,
  Database,
} from "lucide-react";
import {
  Nav,
  Input,
  Button,
  SortSelect,
  URLStatus,
  GradientTop,
  DeleteUrlDialog,
  EditUrlDialog,
  QRCodeDialog,
  RecentAccessesDialog,
  AccessGraphDialog,
} from "@components/index";
import { Checkbox } from "@components/ui/checkbox";
import { useHandleDialogs } from "@hooks/useHandleDialogs";
import { downloadCSV } from "@utils/utils";
import { useAuthen } from "@hooks/useAuthen";
import { URLDocument, URLWithDuplicateCount, SortOption } from "types/types";

export default function Analytics() {
  const router = useRouter();
  const { query } = router;
  const { dialogs, openDialog, closeDialog } = useHandleDialogs();
  const authenticated = useAuthen();
  const inputRef = useRef<HTMLInputElement>(null);
  const [urls, setUrls] = useState<URLWithDuplicateCount[]>([]);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState<SortOption>("dateAsc");
  const [showConfirmation, setShowConfirmation] = useState<boolean>(true);
  const handleToggleConfirmation = () => {
    setShowConfirmation(!showConfirmation);
  };

  const addDuplicateCounts = (urls: URLDocument[]): URLWithDuplicateCount[] => {
    // const urlCountMap: Record<string, number> = urls.reduce((acc, url) => {
    const urlCountMap: { [key: string]: number } = urls.reduce((acc, url) => {
      acc[url.originalUrl] = (acc[url.originalUrl] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return urls.map((url) => {
      const count = urlCountMap[url.originalUrl] || 0;
      return { ...url, duplicateCount: count };
    });
  };

  const fetchUrls = async (): Promise<void> => {
    try {
      const res = await fetch("/api/analytics");
      const data: URLDocument[] = await res.json();
      const processedData: URLWithDuplicateCount[] = addDuplicateCounts(data);
      setUrls(processedData); // Store the fetched data in state
    } catch (error) {
      setError("Failed to fetch URLs");
    }
  };

  useEffect(() => {
    fetchUrls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshData = () => {
    fetchUrls();
    toast.success("Data refreshed successfully!");
  };

  useEffect(() => {
    const handleShortcut = (e: KeyboardEvent) => {
      if (e.altKey && e.key === "l") {
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleShortcut);
    return () => {
      window.removeEventListener("keydown", handleShortcut);
    };
  }, []);

  const handleCopy = (shortenUrl: string) => {
    if (shortenUrl) {
      navigator.clipboard
        .writeText(shortenUrl)
        .then(() => {
          toast.success("URL copied to clipboard!");
          setCopiedUrl(shortenUrl);
        })
        .catch((err) => {
          toast.error("Failed to copy: " + err);
        });
    }
  };

  const handleEdit = async (
    urlId: string,
    updatedFields: Partial<URLDocument>
  ) => {
    try {
      const res = await fetch(`/api/analytics?id=${urlId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedFields),
      });

      if (res.ok) {
        // Update the URL in state with the new fields
        setUrls(
          urls.map((url) =>
            url._id === urlId ? { ...url, ...updatedFields } : url
          )
        );
        toast.success("URL updated successfully!");
      } else {
        // Handle error from API response
        const { message } = await res.json();
        toast.error(message || "Failed to update URL");
      }
    } catch (error) {
      toast.error("Error updating URL");
    } finally {
      closeDialog("edit");
    }
  };

  const handleDelete = async (urlId: string) => {
    try {
      const res = await fetch(`/api/analytics?id=${urlId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setUrls(urls.filter((url) => url._id !== urlId)); // Remove the deleted URL from the state
        toast.success("URL deleted successfully!");
      } else {
        const { message } = await res.json();
        toast.error(message || "Failed to delete URL");
      }
    } catch (error) {
      toast.error("Error deleting URL");
    } finally {
      closeDialog("delete");
    }
  };

  useEffect(() => {
    if (!(typeof query.id === "string")) return;
    const id = query.id as string;
    if (!id) return;
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        // console.log("Element found:", element);
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        const iconElement = element.querySelector(".short-link");
        element.classList.add("animate-pulse");
        if (iconElement) {
          iconElement.classList.add("animate-spin", "text-blue-500");
        }
        setTimeout(() => {
          element.classList.remove("animate-pulse");
          if (iconElement) {
            iconElement.classList.remove("animate-spin", "text-blue-500");
          }
          window.history.replaceState(null, "", window.location.pathname);
        }, 2000);
      } else {
        toast.error("URL doesn't exist");
      }
    }, 500);
  }, [query.id]);
  const sortUrls = (urls: URLWithDuplicateCount[]) => {
    switch (sortOption) {
      case "dateAsc":
        return [...urls].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateA - dateB;
        });
      case "dateDesc":
        return [...urls].sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });
      case "clicksAsc":
        return [...urls].sort((a, b) => a.accesses.count - b.accesses.count);
      case "clicksDesc":
        return [...urls].sort((a, b) => b.accesses.count - a.accesses.count);
      case "duplicateAsc":
        return [...urls]
          .filter((url) => url.duplicateCount > 1)
          .sort((a, b) => a.duplicateCount - b.duplicateCount);
      default:
        return urls;
    }
  };
  const filteredUrls = sortUrls(
    urls.filter(
      (url) =>
        url.shortenUrl.toLowerCase().includes(searchTerm.toLowerCase()) ||
        url.originalUrl.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  if (!authenticated) {
    return null;
  }

  return (
    <>
      <Head>
        <title>ACES Share | Analytics</title>
        <link
          rel="icon"
          href="https://raw.githubusercontent.com/ACES-RMDSSOE/Website/main/images/favicon.ico"
        />
      </Head>
      <main className="relative overflow-x-hidden flex flex-col items-center justify-center h-screen font-inter min-h-svh bg-zinc-50 dark:bg-[#09090b] c-beige:bg-beige-100">
        <div className="relative">
          <GradientTop />
        </div>
        <Nav />
        <div className="relative w-full py-24 overflow-x-hidden">
          <div className="w-full px-[1.15rem] py-10 mx-auto lg:px-8 lg:py-16">
            <div className="header">
              <div className="flex justify-center items-center">
                <a href="https://aces-rmdssoe.tech">
                  <img
                    src="https://raw.githubusercontent.com/ACES-RMDSSOE/Website/main/images/logo.png"
                    alt="ACES Logo"
                    className="w-[7em] h-[7em] rounded-[50%] mt-3"
                  />
                </a>
              </div>
              <h1 className="pt-4 pb-3 text-3xl font-bold xl:text-5xl md:text-4xl text-center c-beige:text-beige-800">
                <Link
                  className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl"
                  href="/share"
                >
                  Share
                </Link>
              </h1>
              <p className="mb-2 font-mono text-center small-caps c-beige:text-beige-800">
                URL Shortener + QR Code Generator
              </p>
            </div>
            <header className="relative flex flex-col items-center justify-center w-full mb-10 space-y-8 overflow-hidden">
              <h2 className="text-4xl font-extrabold tracking-tight scroll-m-20 lg:text-5xl c-beige:text-beige-800">
                Analytics
              </h2>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  className="-mb-8 dark:bg-transparent group"
                  onClick={downloadCSV}
                >
                  <Database className="w-4 h-4 mr-2 group-hover:animate-pulse" />{" "}
                  Export as CSV
                </Button>
                <Button
                  variant="outline"
                  className="-mb-5 group dark:bg-transparent"
                  onClick={refreshData}
                >
                  <RefreshCcw className="w-4 h-4 mr-2 group-hover:animate-spin" />{" "}
                  Refresh Data
                </Button>
              </div>

              <section className="flex items-center p-2 border rounded-lg dark:bg-[#0c0e0f] bg-white c-beige:bg-[#f7f4e9]">
                <Input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by URL..."
                  className="flex-grow focus-visible:ring-0 focus-visible:ring-offset-0 dark:bg-[#0c0e0f] border-none"
                />
                <kbd className="p-1 ml-2 mr-2 font-mono text-xs bg-gray-100 rounded ring-1 ring-gray-900/10 dark:bg-zinc-800 dark:ring-gray-900/50 dark:text-zinc-300 whitespace-nowrap">
                  ALT<span className="text-[.25rem]">&nbsp;</span>+
                  <span className="text-[.25rem]">&nbsp;</span>L
                </kbd>
              </section>
            </header>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <section className="flex flex-col items-start gap-2 my-4 ml-4 md:gap-4 md:items-center md:flex-row">
              <SortSelect
                sortOption={sortOption}
                onSortChange={setSortOption}
              />
              <label className="flex h-10 items-center justify-center rounded-md border bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 space-x-3">
                <Checkbox
                  checked={showConfirmation}
                  onCheckedChange={handleToggleConfirmation}
                />
                <span className="cursor-pointer">Confirm before delete</span>
              </label>
            </section>
            {urls.length > 0 ? (
              <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredUrls.map((url) => {
                  // const [favicon, isReady, isError] = useFavicon(url.originalUrl);
                  return (
                    // url._id
                    <li
                      key={url._id}
                      id={url._id}
                      className="p-4 rounded-lg shadow-lg url-card dark:border dark:bg-[#0c0e0f88] dark:backdrop-blur c-beige:bg-[hsl(48,44%,90%)] c-beige:text-beige-900"
                    >
                      <header className="flex flex-col gap-0 !text-sm">
                        <h2 className="flex justify-between p-1 space-x-4">
                          <main className="flex items-center ml-1 space-x-4">
                            <LinkIcon className="w-5 h-5 short-link" />
                            <Link
                              href={url.shortenUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary c-beige:text-beige-700 hover:underline"
                            >
                              {url.shortenUrl}
                            </Link>
                          </main>
                          <aside className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => handleCopy(url.shortenUrl)}
                            >
                              <span className="flex w-4 aspect-square">
                                {copiedUrl === url.shortenUrl ? (
                                  <Check />
                                ) : (
                                  <Copy />
                                )}
                              </span>
                            </Button>

                            <img
                              src={`http://www.google.com/s2/favicons?sz=64&domain=${url.originalUrl}`}
                              alt="L"
                              className="block rounded !aspect-square h-10"
                              loading="lazy"
                            />
                          </aside>
                        </h2>
                        <h2 className="flex justify-between p-1 space-x-4">
                          <main className="flex items-center ml-1 space-x-4">
                            <ExternalLink className="w-5 h-5" />
                            <Link
                              href={url.originalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-3 py-1.5 font-mono border rounded-lg text-primary hover:underline overflow-x-auto max-w-[128px] scrollbar-none whitespace-nowrap c-beige:text-beige-700"
                            >
                              {url.originalUrl}
                            </Link>
                          </main>
                          <aside className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => {
                                if (showConfirmation) {
                                  // If confirmation is enabled, open the delete dialog
                                  openDialog("delete", url._id);
                                } else {
                                  // If confirmation is disabled, directly delete the URL
                                  handleDelete(url._id);
                                }
                              }}
                            >
                              <span className="flex w-4 aspect-square">
                                <Trash2 className="text-red-400" />
                              </span>
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => openDialog("edit", url)}
                            >
                              <span className="flex w-4 aspect-square">
                                <Pencil className="text-yellow-600 dark:text-yellow-400" />
                              </span>
                            </Button>
                          </aside>
                        </h2>
                      </header>
                      <section className="flex justify-between gap-2">
                        <article className="flex flex-col my-4 space-y-1 text-sm *:flex *:items-center *:space-x-2 *:truncate">
                          <span className="">
                            <Calendar className="w-4 h-4" />{" "}
                            <span className="text-muted-foreground">
                              {new Date(url.createdAt).toLocaleString()}
                            </span>
                          </span>
                          <span className="">
                            <Pencil className="w-4 h-4" />{" "}
                            <span className="text-muted-foreground">
                              {new Date(url.updatedAt).toLocaleString()}
                            </span>
                          </span>
                          <span className="">
                            <MousePointerClick className="w-4 h-4" />{" "}
                            <span className="text-muted-foreground">
                              Clicks: {url.accesses.count}
                            </span>
                          </span>
                        </article>
                        <aside className="flex flex-col items-end space-y-2">
                          <Button
                            type="button"
                            className="mt-1"
                            variant="outline"
                            onClick={() => openDialog("recents", url)}
                          >
                            <span className="flex">Recents</span>
                          </Button>
                          <div className="flex items-center gap-2 mt-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() =>
                                openDialog("qrCode", url.shortenUrl)
                              }
                            >
                              <span className="flex w-4 aspect-square">
                                <QrCode className="text-gray-600 dark:text-gray-400" />
                              </span>
                            </Button>
                            <Button
                              type="button"
                              className="w-max"
                              variant="outline"
                              onClick={() => openDialog("accessGraph", url)}
                            >
                              <span className="flex w-4 aspect-square">
                                <ChartSpline className="text-green-600 dark:text-green-400" />
                              </span>
                            </Button>
                          </div>
                        </aside>
                      </section>
                      <URLStatus url={url} />
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p>No URLs found</p>
            )}
          </div>
          <DeleteUrlDialog
            open={dialogs.delete.isOpen}
            setOpen={() => {
              closeDialog("delete");
            }}
            urlToDelete={dialogs.delete.data || ""}
            handleDelete={handleDelete}
          />
          <EditUrlDialog
            open={dialogs.edit.isOpen}
            setOpen={() => {
              closeDialog("edit");
            }}
            urlToEdit={dialogs.edit.data}
            handleEdit={handleEdit}
          />
          <QRCodeDialog
            open={dialogs.qrCode.isOpen}
            setOpen={() => {
              closeDialog("qrCode");
            }}
            shortenUrl={dialogs.qrCode.data || ""}
            // shortenUrl={dialogs.qrCode.data}
          />
          {dialogs.recents.data && (
            <RecentAccessesDialog
              open={dialogs.recents.isOpen}
              setOpen={() => closeDialog("recents")}
              recentAccesses={dialogs.recents.data?.accesses?.lastAccessed}
            />
          )}
          {dialogs.accessGraph.data && (
            <AccessGraphDialog
              open={dialogs.accessGraph.isOpen}
              setOpen={() => closeDialog("accessGraph")}
              recentAccesses={dialogs.accessGraph.data?.accesses?.lastAccessed}
            />
          )}
        </div>
        <SpeedInsights />
      </main>
    </>
  );
}