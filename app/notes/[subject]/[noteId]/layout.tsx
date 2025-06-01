export default function NotesPageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="flex flex-col min-h-screen">{children}</main>;
}
