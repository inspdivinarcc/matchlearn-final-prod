import { Navigation } from '@/components/ui/nav';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen flex flex-col">
            <Navigation />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
}
