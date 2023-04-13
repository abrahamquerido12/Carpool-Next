const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-10 ph-30 bg-white">
      {children}
    </main>
  );
};

export default MainLayout;
