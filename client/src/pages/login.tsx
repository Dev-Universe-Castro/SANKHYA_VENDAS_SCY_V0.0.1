
import { useState } from "react";
import { useLocation } from "wouter";
import { Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Usuário estático
    const STATIC_USER = {
      email: "admin@sistema.com",
      password: "admin123",
      nome: "Administrador",
    };

    setTimeout(() => {
      if (email === STATIC_USER.email && password === STATIC_USER.password) {
        localStorage.setItem("token", "static-token-demo");
        localStorage.setItem("user", JSON.stringify({
          id: "1",
          email: STATIC_USER.email,
          nome: STATIC_USER.nome,
          perfil: "ADM",
        }));

        toast({
          title: "Login realizado",
          description: `Bem-vindo, ${STATIC_USER.nome}!`,
        });
        setLocation("/");
      } else {
        toast({
          title: "Erro",
          description: "Credenciais inválidas. Use: admin@sistema.com / admin123",
          variant: "destructive",
        });
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Form */}
      <div className="flex w-full flex-col justify-between bg-white p-12 lg:w-5/12">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <svg width="32" height="32" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 18.75C30.5 17.25 28.5 16.25 26.25 16.25C22.25 16.25 19 19.5 19 23.5C19 27.5 22.25 30.75 26.25 30.75C28.5 30.75 30.5 29.75 32 28.25L36.25 32.5C33.5 35.25 29.75 36.75 26.25 36.75C18.75 36.75 12.5 30.5 12.5 23C12.5 15.5 18.75 9.25 26.25 9.25C29.75 9.25 33.5 10.75 36.25 13.5L32 18.75Z" fill="currentColor" className="text-blue-600"/>
          </svg>
          <span className="text-xl font-semibold text-gray-900">Central Sankhya</span>
        </div>

        {/* Form */}
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-4xl font-semibold text-gray-900">Welcome Back</h1>
            <p className="mt-2 text-sm text-gray-500">Welcome Back, Please enter your details</p>
          </div>

          {/* Tabs */}
          <div className="mb-8 flex gap-2 rounded-lg bg-gray-50 p-1">
            <button
              onClick={() => setActiveTab("signin")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "signin"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab("signup")}
              className={`flex-1 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                activeTab === "signup"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Signup
            </button>
          </div>

          {activeTab === "signin" ? (
            <form onSubmit={handleLogin} className="space-y-5">
              {/* Email Input */}
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@sistema.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 pl-12 text-base"
                    data-testid="input-email"
                  />
                  {email && (
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4">
                      <div className="flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                        <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-12 pl-12 text-base"
                    data-testid="input-password"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="h-12 w-full bg-blue-600 text-base font-medium hover:bg-blue-700" 
                disabled={loading}
              >
                {loading ? "Entrando..." : "Continue"}
              </Button>
            </form>
          ) : (
            <div className="space-y-5 text-center text-gray-500">
              <p>Funcionalidade de cadastro em desenvolvimento.</p>
              <p className="text-sm">Use as credenciais: admin@sistema.com / admin123</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-sm text-gray-500">
          <p>
            Gerencie sincronizações entre Sankhya e Oracle de forma centralizada. 
            <br />
            Acompanhe logs e configure empresas facilmente.
          </p>
        </div>
      </div>

      {/* Right Panel - Image/Illustration */}
      <div className="hidden w-7/12 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 lg:flex lg:items-center lg:justify-center">
        <div className="relative">
          {/* Safe/Vault Illustration using CSS */}
          <div className="relative h-96 w-96">
            {/* Background glow */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-200/40 to-blue-300/40 blur-3xl"></div>
            
            {/* Safe body */}
            <div className="relative h-full w-full rounded-3xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-2xl">
              {/* Safe door */}
              <div className="absolute inset-8 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-400 shadow-inner">
                {/* Lock circle */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div className="h-32 w-32 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg">
                    <div className="absolute inset-2 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500"></div>
                    <div className="absolute inset-4 rounded-full bg-gradient-to-br from-white/20 to-transparent"></div>
                    
                    {/* Lock handle */}
                    <div className="absolute left-1/2 top-1/2 h-20 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-b from-cyan-600 to-blue-700 shadow-md"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
