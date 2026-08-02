export const metadata = {
  title: "maşınbazarı.az",
  description: "Azərbaycanın avtomobil bazarı",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Manrope:wght@400;500;600;700;800&family=Space+Mono:wght@400;700&display=swap"
        />
      </head>
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
