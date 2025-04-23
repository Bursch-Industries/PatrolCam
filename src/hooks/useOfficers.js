// filepath: src/hooks/useCameras.js
'use client';

import { useState, useEffect } from 'react';

export default function useOfficers() {
const [officers, setOfficers] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
    const fetchOfficers = async () => {
        try {
            const res = await fetch('/api/auth/officersAPI', { credentials: 'include' });
            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || 'Failed to fetch officers');
            }
            const data = await res.json();
            setOfficers(data.officers);
            setError(null);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchOfficers();
}, []);

    return { officers , loading, error };


}