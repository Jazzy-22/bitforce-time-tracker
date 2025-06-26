import "./globals.css";

export const metadata = {
  title: "TimeTrack by BitForce",
  description: "One, Two, Three Martinis",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
