import { useState, useCallback } from 'react';
import { WHAT3WORDS_API_KEY } from '@/config/api-keys';

interface What3WordsResult {
  words: string;
  nearestPlace?: string;
}

export const useWhat3Words = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const convertToWords = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    if (WHAT3WORDS_API_KEY === 'YOUR_API_KEY_HERE') {
      console.warn('What3Words API key not configured');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://api.what3words.com/v3/convert-to-3wa?coordinates=${lat},${lng}&key=${WHAT3WORDS_API_KEY}`
      );

      if (!response.ok) {
        throw new Error('Failed to convert coordinates');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error.message || 'W3W API error');
      }

      setIsLoading(false);
      return data.words;
    } catch (err) {
      console.error('What3Words error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
      setIsLoading(false);
      return null;
    }
  }, []);

  return { convertToWords, isLoading, error };
};
