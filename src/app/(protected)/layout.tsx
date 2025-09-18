export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="mx-auto px-4 py-8 pt-22 bg-base-300 min-h-screen">
      <div className="max-w-4xl mx-auto mt-4">{children}</div>
    </div>
  );
}
