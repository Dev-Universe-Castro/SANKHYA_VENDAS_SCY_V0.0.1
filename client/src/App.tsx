
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Empresas from "@/pages/empresas";
import Logs from "@/pages/logs";
import Configuracoes from "@/pages/configuracoes";
import NotFound from "@/pages/not-found";
import { Building2, LayoutDashboard, FileText, Settings, Lock } from "lucide-react";

const navigationItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Empresas", url: "/empresas", icon: Building2 },
  { title: "Logs", url: "/logs", icon: FileText },
  { title: "Configurações", url: "/configuracoes", icon: Settings },
];

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  const [location, setLocation] = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M32 18.75C30.5 17.25 28.5 16.25 26.25 16.25C22.25 16.25 19 19.5 19 23.5C19 27.5 22.25 30.75 26.25 30.75C28.5 30.75 30.5 29.75 32 28.25L36.25 32.5C33.5 35.25 29.75 36.75 26.25 36.75C18.75 36.75 12.5 30.5 12.5 23C12.5 15.5 18.75 9.25 26.25 9.25C29.75 9.25 33.5 10.75 36.25 13.5L32 18.75Z" fill="currentColor" className="text-primary"/>
            </svg>
            <span className="text-lg font-semibold text-gray-900">Central Sankhya</span>
          </div>

          {/* Horizontal Navigation */}
          <nav className="flex items-center gap-1">
            {navigationItems.map((item) => {
              const isActive = location === item.url;
              return (
                <button
                  key={item.title}
                  onClick={() => setLocation(item.url)}
                  className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-gray-900 text-white"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                  data-testid={`nav-${item.title.toLowerCase()}`}
                >
                  <item.icon className="h-4 w-4" />
                  {item.title}
                </button>
              );
            })}
          </nav>

          {/* Right Side Actions */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => console.log('Logout triggered')}
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              data-testid="button-logout"
            >
              <Lock className="h-4 w-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-6 py-8">{children}</div>
      </main>
    </div>
  );
}

function Router() {
  const [location] = useLocation();

  if (location === "/login") {
    return <Login />;
  }

  return (
    <AuthenticatedLayout>
      <Switch>
        <Route path="/" component={Dashboard} />
        <Route path="/empresas" component={Empresas} />
        <Route path="/logs" component={Logs} />
        <Route path="/configuracoes" component={Configuracoes} />
        <Route component={NotFound} />
      </Switch>
    </AuthenticatedLayout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
