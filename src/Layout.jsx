import { Link } from "react-router-dom";
import { createPageUrl } from "./utils";

export default function Layout({ children, currentPageName }) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 via-white to-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={createPageUrl("Home")} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img 
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/695855a36d807e0de1b4ee0b/9ad08b44d_SmallCalc-logo.png" 
                alt="SmallCalc" 
                className="h-8"
              />
            </Link>
            
            <nav className="hidden md:flex items-center gap-6">
              <Link 
                to={createPageUrl("Home")} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === "Home" 
                    ? "text-indigo-600" 
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Home
              </Link>
              <Link 
                to={createPageUrl("TaxCalculator")} 
                className={`text-sm font-medium transition-colors ${
                  currentPageName === "TaxCalculator" 
                    ? "text-indigo-600" 
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
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 mt-12 py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-xs text-slate-400">
            © {new Date().getFullYear()} SmallCalc • Your go-to calculator hub for all your calculation needs
          </p>
        </div>
      </footer>
    </div>
  );
}