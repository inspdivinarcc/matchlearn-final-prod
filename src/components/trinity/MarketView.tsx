"use client";

import React, { useEffect, useState } from 'react';
import { getGigs } from '@/server/actions/gig';
import { MarketViewClient } from './MarketViewClient';

export const MarketView = () => {
    const [gigs, setGigs] = useState<any[]>([]);

    useEffect(() => {
        const fetchGigs = async () => {
            const res = await getGigs();
            if (res.success && res.gigs) {
                setGigs(res.gigs);
            }
        };
        fetchGigs();
    }, []);

    return <MarketViewClient initialGigs={gigs} />;
};
