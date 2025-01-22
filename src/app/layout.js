import "./globals.css";

export const metadata = {
  title: "ArtValley",
  description: "A Digital ART NFT Platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
