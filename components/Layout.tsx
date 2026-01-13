import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-black text-white font-sans selection:bg-purple-500 selection:text-white">
      {/* Background Gradients */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900 rounded-full blur-[120px] opacity-40 animate-pulse"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-900 rounded-full blur-[120px] opacity-40 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="fixed top-[40%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 w-[30%] h-[30%] bg-indigo-900 rounded-full blur-[100px] opacity-20"></div>

      {/* Main Content Wrapper */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4 sm:p-8">
        <div className="w-full max-w-4xl backdrop-blur-2xl bg-white/5 border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-10 min-h-[600px] flex flex-col relative overflow-hidden">
           {/* Glass Shine Effect */}
           <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
           
           {children}
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-white/30 text-xs tracking-wider">
          <p className="mb-2">Designed by Ref-Vibe Architect</p>
          <p>© 2026 REFERENCE HRD. All Rights Reserved.</p>
        </footer>
      </main>
    </div>
  );
};

export default Layout;