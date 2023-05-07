import React from 'react';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between pt-5 px-4 bg-white">
      {children}
    </main>
  );
};

export default MainLayout;
