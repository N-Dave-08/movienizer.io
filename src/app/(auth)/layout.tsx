export default function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex flex-col items-center justify-center px-8">
      <div className="flex-1 flex items-center justify-center">{children}</div>

      <div className="pb-16">
        <blockquote className="text-xl italic text-center text-base-content/90">
          "For every minute spent organizing, an hour is earned."
          <span className="block mt-4 text-base font-semibold text-base-content/70">
            – Benjamin Franklin
          </span>
        </blockquote>
      </div>
    </div>
  );
}
