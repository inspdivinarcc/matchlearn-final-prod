"use client";

import CookieConsent from "react-cookie-consent";
import Link from "next/link";

export function CookieBanner() {
    return (
        <CookieConsent
            location="bottom"
            buttonText="Aceitar"
            declineButtonText="Recusar"
            enableDeclineButton
            cookieName="matchlearn_consent"
            style={{ background: "#2B373B", zIndex: 9999 }}
            buttonStyle={{ background: "#4f46e5", color: "#fff", fontSize: "14px", borderRadius: "6px", padding: "8px 16px" }}
            declineButtonStyle={{ background: "transparent", color: "#fff", border: "1px solid #71717a", fontSize: "14px", borderRadius: "6px", padding: "8px 16px" }}
            expires={150}
        >
            Utilizamos cookies essenciais e tecnologias semelhantes para oferecer a melhor experiência educacional e de gamificação (LGPD).{" "}
            <Link href="/privacy" className="underline hover:text-indigo-300">
                Leia nossa Política de Privacidade
            </Link>.
        </CookieConsent>
    );
}
