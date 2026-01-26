import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <style>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .stripe-gradient {
          background: linear-gradient(135deg, 
            rgba(99, 102, 241, 0.05) 0%,
            rgba(168, 85, 247, 0.05) 25%,
            rgba(236, 72, 153, 0.05) 50%,
            rgba(251, 146, 60, 0.05) 75%,
            rgba(59, 130, 246, 0.05) 100%
          );
          background-size: 200% 200%;
        }
      `}</style>
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-70 transition-opacity duration-200">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695855a36d807e0de1b4ee0b/9ad08b44d_SmallCalc-logo.png" 
                alt="SmallCalc" 
                className="h-7"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-1">
              <Link 
                to={createPageUrl("Home")} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPageName === "Home" 
                    ? "text-slate-900 bg-slate-100" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("TaxCalculator")} 
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  currentPageName === "TaxCalculator" 
                    ? "text-slate-900 bg-slate-100" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Tax Calculator
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 stripe-gradient">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/60 mt-auto py-8 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            © {new Date().getFullYear()} SmallCalc
          </p>
        </div>
      </footer>
    </div>
  );
}