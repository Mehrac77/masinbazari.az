export const metadata = {
  title: "maşınbazarı.az",
  description: "Azərbaycanın avtomobil bazarı",
};

export default function RootLayout({ children }) {
  return (
    <html lang="az">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
