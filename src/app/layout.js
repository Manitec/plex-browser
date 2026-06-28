import './globals.css';
export const metadata = { title: 'plex-browser', description: 'Modular browser shell with Plex AI' };
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
      </head>
      <body className="bg-gray-950 text-gray-100">{children}</body>
    </html>
  );
}
