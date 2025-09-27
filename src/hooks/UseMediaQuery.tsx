import { useEffect, useState } from "react";

export function UseMediaQuery(query: string) {
  const [isMatches, setIsMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== isMatches) setIsMatches(media.matches);
    const listener = () => setIsMatches(media.matches);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [isMatches, query]);

  return isMatches;
}
