'use client';

import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';
import { toast } from 'sonner';

export function LanguageSwitcher() {
    const handleSwitch = () => {
        toast.info('Suporte a múltiplos idiomas em breve!');
    };

    return (
        <Button variant="ghost" size="sm" onClick={handleSwitch} className="text-muted-foreground hover:text-primary">
            <Globe className="h-5 w-5" />
            <span className="sr-only">Mudar idioma</span>
        </Button>
    );
}
