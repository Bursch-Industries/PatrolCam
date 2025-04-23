// filepath: src/hooks/useCameras.js
'use client';

import { useState, useEffect } from 'react';

export default function useCameras() {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCameras = async () => {
      try {
        const res = await fetch('/api/auth/camerasAPI', { credentials: 'include' });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch cameras');
        }
        const data = await res.json();
        setCameras(data.cameras);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCameras();
  }, []);

  return { cameras, loading, error };
}