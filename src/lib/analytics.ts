import { track } from '@vercel/analytics/server';

type EventName =
    | 'battle_started'
    | 'battle_completed'
    | 'item_purchased'
    | 'level_up'
    | 'nft_minted';

export function trackEvent(eventName: EventName, properties?: Record<string, string | number | boolean>) {
    try {
        // Vercel analytics properties only support string, number, boolean
        track(eventName, properties as any);
    } catch (error) {
        console.error(`Failed to track event ${eventName}:`, error);
    }
}
