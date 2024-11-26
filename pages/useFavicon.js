import axios from "axios";
import { useState, useEffect } from "react";

const useFavicon = (url) => {
  const cleanUrl = (url) => {
    let cleanedUrl = url.includes("https")
      ? url.slice(8)
      : url.includes("http") && url.slice(7);
    cleanedUrl = cleanedUrl.includes("/") ? cleanedUrl.split("/")[0] : cleanedUrl;
    return cleanedUrl;
  };

  const siteUrl = cleanUrl(url);

  const [isError, setError] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [favicon, setFavicon] = useState();

  const getFavicon = async (url) => {
    try {
      const { data } = await axios.get(
        `https://favicongrabber.com/api/grab/${url}`
      );
      setFavicon(data.icons[0].src);
      setIsReady(true);
    } catch (error) {
      setError(true);
    }
  };

  useEffect(() => {
    if (url) {
      getFavicon(siteUrl);
    }
  }, [siteUrl]); // Only re-run when `url` changes, not `favicon`

  return [favicon, isReady, isError];
};

export default useFavicon;
