export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This is a pass-through layout for next-intl
  // The actual HTML structure is in app/[locale]/layout.tsx
  return children;
}
