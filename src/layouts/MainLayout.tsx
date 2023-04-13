const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-orange-200">
      {children}
    </main>
  );
};

export default MainLayout;
