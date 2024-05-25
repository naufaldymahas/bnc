export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="container">
      <div className="flex flex-col justify-center mx-auto min-h-screen md:w-1/3">
        {children}
      </div>
    </div>
  );
}
