import "@/styles/globals.css";
import 'leaflet/dist/leaflet.css';
import type { AppProps } from "next/app";
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Component {...pageProps} />
      {/* Vercel Analytics - Suivi des visites sans cookies, compatible RGPD */}
      <Analytics />
    </>
  );
}
