import "./globals.css";

export const metadata = {
  title: "Flashkiss Booth",
  description: "Smart Photobooth System by Flashkiss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
