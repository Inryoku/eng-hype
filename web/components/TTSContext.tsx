"use client";

import {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
  ReactNode,
} from "react";

interface TTSContextType {
  isPlaying: boolean;
  isLoading: boolean;
  activeText: string | null;
  play: (text: string) => Promise<void>;
  stop: () => void;
}

const TTSContext = createContext<TTSContextType | undefined>(undefined);

export function TTSProvider({ children }: { children: ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeText, setActiveText] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const stop = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setActiveText(null);
  }, []);

  const play = useCallback(
    async (text: string) => {
      try {
        // If clicking the same text that is playing, stop it (toggle behavior handled in UI, but safe here)
        if (isPlaying && activeText === text) {
          stop();
          return;
        }

        stop(); // Stop any current playback
        setIsLoading(true);
        setActiveText(text);

        const cacheKey = `/api/tts?text=${encodeURIComponent(text)}`;
        let blob: Blob | null = null;

        // 1. Try to get from cache
        try {
          const cache = await caches.open("tts-cache");
          const cachedResponse = await cache.match(cacheKey);

          if (cachedResponse) {
            blob = await cachedResponse.blob();
          }
        } catch (e) {
          console.warn("Cache API not supported or error:", e);
        }

        // 2. If not in cache, fetch from API
        if (!blob) {
          const response = await fetch("/api/tts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text }),
          });

          if (!response.ok) {
            const errText = await response.text();
            throw new Error(
              `TTS Request failed: ${response.status} ${errText}`,
            );
          }

          blob = await response.blob();

          // 3. Save to cache (if possible)
          try {
            const cache = await caches.open("tts-cache");
            const responseToCache = new Response(blob, {
              status: 200,
              headers: { "Content-Type": "audio/mpeg" },
            });
            await cache.put(cacheKey, responseToCache);
          } catch (e) {
            console.warn("Failed to cache TTS response:", e);
          }
        }

        const url = URL.createObjectURL(blob);
        const audio = new Audio(url);

        audio.onended = () => {
          setIsPlaying(false);
          setActiveText(null);
          URL.revokeObjectURL(url);
        };

        audio.onerror = () => {
          setIsPlaying(false);
          setIsLoading(false);
          setActiveText(null);
          URL.revokeObjectURL(url);
        };

        audioRef.current = audio;
        await audio.play();
        setIsLoading(false);
        setIsPlaying(true);
      } catch (error) {
        console.error("TTS Error:", error);
        setIsLoading(false);
        setIsPlaying(false);
        setActiveText(null);
      }
    },
    [stop, isPlaying, activeText],
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  return (
    <TTSContext.Provider
      value={{ play, stop, isPlaying, isLoading, activeText }}
    >
      {children}
    </TTSContext.Provider>
  );
}

export function useTTS() {
  const context = useContext(TTSContext);
  if (context === undefined) {
    throw new Error("useTTS must be used within a TTSProvider");
  }
  return context;
}
