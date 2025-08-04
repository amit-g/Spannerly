import { Html, Head, Main, NextScript } from 'next/document';
import { getAssetPath } from '../utils/assetPath';

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Favicon configuration using the Spannerly logo */}
        <link rel="icon" type="image/png" sizes="32x32" href={getAssetPath("/favicon-32x32.png")} />
        <link rel="icon" type="image/png" sizes="16x16" href={getAssetPath("/favicon-16x16.png")} />
        <link rel="apple-touch-icon" sizes="180x180" href={getAssetPath("/apple-touch-icon.png")} />
        
        {/* Standard favicon fallback */}
        <link rel="icon" href={getAssetPath("/favicon.ico")} />
        
        {/* Android Chrome icons for PWA */}
        <link rel="icon" type="image/png" sizes="192x192" href={getAssetPath("/android-chrome-192x192.png")} />
        <link rel="icon" type="image/png" sizes="512x512" href={getAssetPath("/android-chrome-512x512.png")} />
        
        {/* Web App Manifest */}
        <link rel="manifest" href={getAssetPath("/site.webmanifest")} />
        
        {/* Theme color for mobile browsers */}
        <meta name="theme-color" content="#1976d2" />
        
        {/* App description */}
        <meta name="description" content="Spannerly - A collection of useful web utilities and tools" />
        <meta name="application-name" content="Spannerly" />
        <meta name="apple-mobile-web-app-title" content="Spannerly" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
