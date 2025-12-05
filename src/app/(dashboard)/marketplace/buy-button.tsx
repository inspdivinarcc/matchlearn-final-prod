'use client';

import { Button } from '@/components/ui/button';
import { buyItem } from '@/server/actions/shop';
import { toast } from 'sonner';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

export function BuyButton({ itemId, price, userCoins }: { itemId: string, price: number, userCoins: number }) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBuy = async () => {
        if (userCoins < price) {
            toast.error('Saldo insuficiente!');
            return;
        }
        setIsLoading(true);
        try {
            const result = await buyItem(itemId);
            if (result.success) {
                toast.success(result.message);
            } else {
                toast.error(result.error);
            }
        } catch (error) {
            console.error(error);
            toast.error('Erro ao processar compra.');
        } finally {
            setIsLoading(false);
        }
    };

    const canAfford = userCoins >= price;

    return (
        <Button
            onClick={handleBuy}
            disabled={!canAfford || isLoading}
            variant={canAfford ? "default" : "secondary"}
            className={canAfford ? "bg-amber-600 hover:bg-amber-700 text-white" : ""}
        >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (canAfford ? 'Comprar' : 'Sem Saldo')}
        </Button>
    );
}
