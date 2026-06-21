"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Download, Trash2 } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "sonner";

export default function PrivacyPage() {
    const [isExporting, setIsExporting] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleExportData = async () => {
        try {
            setIsExporting(true);
            const res = await fetch("/api/user/data/export");
            if (!res.ok) throw new Error("Falha ao exportar dados");

            const data = await res.json();

            // Download logic
            const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
            const downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", "matchlearn_meus_dados.json");
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();

            toast.success("Seus dados foram exportados com sucesso!");
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro ao exportar seus dados.");
        } finally {
            setIsExporting(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!confirm("TEM CERTEZA? Esta ação é IRREVERSÍVEL. Todos os seus dados pessoais serão anonimizados e seu acesso será permanentemente revogado. Seus NFTs externos não serão afetados, mas você perderá o acesso à plataforma.")) {
            return;
        }

        try {
            setIsDeleting(true);
            const res = await fetch("/api/user/data/delete", { method: "POST" });
            if (!res.ok) throw new Error("Falha ao excluir conta");

            toast.success("Sua conta foi excluída e seus dados anonimizados.");
            setTimeout(() => {
                signOut({ callbackUrl: "/" });
            }, 2000);
        } catch (error) {
            console.error(error);
            toast.error("Ocorreu um erro ao tentar excluir sua conta.");
            setIsDeleting(false);
        }
    };

    return (
        <div className="container mx-auto max-w-2xl py-8 px-4">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Privacidade e Dados (LGPD)</h1>

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Download className="w-5 h-5 text-indigo-600" />
                            Exportar Meus Dados
                        </CardTitle>
                        <CardDescription>
                            Baixe uma cópia de todos os seus dados pessoais, histórico de batalhas e transações associados à sua conta (Art. 18, LGPD).
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportData}
                            disabled={isExporting}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                            {isExporting ? "Exportando..." : "Baixar Dados (JSON)"}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-600">
                            <AlertCircle className="w-5 h-5" />
                            Excluir Conta
                        </CardTitle>
                        <CardDescription>
                            A exclusão da conta é permanente. Seus dados pessoais serão anonimizados e você não poderá mais fazer login. Seus progressos e itens não salvos em blockchain externa serão perdidos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleDeleteAccount}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isDeleting ? "Excluindo..." : "Excluir Minha Conta"}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
