import { useCallback } from 'react';
import md5 from 'md5';

const env = import.meta.env;

export function useMarvelAPI() {
  const fetchMarvelData = useCallback(async (endpoint, params = {}) => {
    const ts = new Date().getTime();
    const hash = md5(ts + env.VITE_PRIVATE_KEY + env.VITE_PUBLIC_KEY);

    const queryParams = new URLSearchParams({
      ts: ts,
      apikey: env.VITE_PUBLIC_KEY,
      hash: hash,
      ...params
    });

    try {
      const response = await fetch(`https://gateway.marvel.com/v1/public/${endpoint}?${queryParams}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Marvel data:', error);
      throw error;
    }
  }, []);

  return { fetchMarvelData };
}