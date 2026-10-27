"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { SessionUser } from "@/lib/types";

const inputCls =
  "h-11 bg-[#141418] border-[#2b2b31] text-zinc-100 placeholder:text-zinc-500 focus-visible:ring-[#d9a441]/50 focus-visible:border-[#d9a441]/60 transition-all";

/**
 * Botão "Entrar com Google".
 * Verifica antes se o login com Google está configurado no servidor:
 * - Configurado → segue o fluxo OAuth normal.
 * - Não configurado → mostra um aviso na hora, sem recarregar a página
 *   (antes o botão recarregava e "não fazia nada" para quem usa o site).
 */
export function GoogleButton({ className = "" }: { className?: string }) {
  const [configured, setConfigured] = useState<boolean | null>(null);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch("/api/auth/google/status", { cache: "no-store" })
      .then((r) => r.json())
      .then((d: { configured: boolean }) => {
        if (alive) setConfigured(Boolean(d.configured));
      })
      .catch(() => {
        if (alive) setConfigured(false);
      });
    return () => {
      alive = false;
    };
  }, []);

  function handleClick() {
    if (configured) {
      window.location.href = "/api/auth/google";
      return;
    }
    // Google ainda sem credenciais no servidor: avisa sem sair da tela.
    setShowHint(true);
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleClick}
        aria-describedby="google-login-hint"
        className={`w-full h-12 flex items-center justify-center gap-3 bg-white text-[#1f1f1f] hover:bg-zinc-100 transition-colors font-medium text-sm cursor-pointer ${className}`}
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5" aria-hidden>
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47a5.57 5.57 0 0 1-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09A11.99 11.99 0 0 0 12 24Z"
          />
          <path
            fill="#FBBC05"
            d="M5.27 14.29A7.2 7.2 0 0 1 4.89 12c0-.8.14-1.57.38-2.29V6.62H1.29a12 12 0 0 0 0 10.76l3.98-3.09Z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42A11.98 11.98 0 0 0 12 0 11.99 11.99 0 0 0 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75Z"
          />
        </svg>
        Entrar com Google
      </button>
      {showHint && (
        <p
          id="google-login-hint"
          role="status"
          className="mt-3 text-center text-xs leading-relaxed text-[#d9a441] bg-[#d9a441]/10 border border-[#d9a441]/40 px-3 py-2"
        >
          Entrar com Google está temporariamente indisponível. Use e-mail e senha para
          entrar ou crie sua conta — é rapidinho.
        </p>
      )}
    </div>
  );
}

export function AuthForm({ onSuccess }: { onSuccess?: () => void }) {
  const setUser = useAppStore((s) => s.setUser);
  const [loading, setLoading] = useState<"login" | "register" | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState({ email: "", password: "" });
  const [register, setRegister] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirm: "",
  });

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading("login");
    try {
      const { user } = await api<{ user: SessionUser }>("/api/auth/login", {
        method: "POST",
        body: JSON.stringify(login),
      });
      setUser(user);
      toast.success(`Bem-vindo de volta, ${user.name.split(" ")[0]}!`);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao entrar.");
    } finally {
      setLoading(null);
    }
  }

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    if (register.password !== register.confirm) {
      toast.error("As senhas não coincidem.");
      return;
    }
    setLoading("register");
    try {
      const { user } = await api<{ user: SessionUser }>("/api/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: register.name,
          email: register.email,
          phone: register.phone,
          password: register.password,
        }),
      });
      setUser(user);
      toast.success(`Conta criada! Bem-vindo à CROWN, ${user.name.split(" ")[0]}!`);
      onSuccess?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao criar conta.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <Tabs defaultValue="login" className="w-full">
      <TabsList className="grid w-full grid-cols-2 h-12 bg-[#141418] border border-[#2b2b31] p-1">
        <TabsTrigger
          value="login"
          className="font-heading uppercase tracking-wider text-sm text-zinc-400 data-[state=active]:bg-[#d9a441] data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          Entrar
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="font-heading uppercase tracking-wider text-sm text-zinc-400 data-[state=active]:bg-[#d9a441] data-[state=active]:text-black data-[state=active]:font-semibold"
        >
          Criar conta
        </TabsTrigger>
      </TabsList>

      {/* ---------- LOGIN ---------- */}
      <TabsContent value="login">
        <form onSubmit={handleLogin} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="login-email" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
              E-mail
            </Label>
            <div className="relative">
              <Input
                id="login-email"
                type="email"
                required
                placeholder="seu@email.com"
                className={inputCls}
                value={login.email}
                onChange={(e) => setLogin({ ...login, email: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
              Senha
            </Label>
            <div className="relative">
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Sua senha"
                className={`${inputCls} pr-10`}
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
              />
              <button
                type="button"
                aria-label="Mostrar ou ocultar senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-[#d9a441] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading !== null}
            className="w-full h-12 rounded-none bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base transition-all hover:scale-[1.01]"
          >
            {loading === "login" ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Entrar agora
          </Button>
        </form>
      </TabsContent>

      {/* ---------- CADASTRO ---------- */}
      <TabsContent value="register">
        <form onSubmit={handleRegister} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="reg-name" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
              Nome completo
            </Label>
            <div className="relative">
              <Input
                id="reg-name"
                required
                placeholder="Seu nome"
                className={inputCls}
                value={register.name}
                onChange={(e) => setRegister({ ...register, name: e.target.value })}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-email" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                E-mail
              </Label>
              <div className="relative">
                <Input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className={inputCls}
                  value={register.email}
                  onChange={(e) => setRegister({ ...register, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                WhatsApp <span className="text-zinc-400 normal-case">(opcional)</span>
              </Label>
              <div className="relative">
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="(19) 99999-9999"
                  className={inputCls}
                  value={register.phone}
                  onChange={(e) => setRegister({ ...register, phone: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reg-password" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                Senha
              </Label>
              <div className="relative">
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Mín. 6 caracteres"
                  className={inputCls}
                  value={register.password}
                  onChange={(e) => setRegister({ ...register, password: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                Confirmar senha
              </Label>
              <div className="relative">
                <Input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Repita a senha"
                  className={inputCls}
                  value={register.confirm}
                  onChange={(e) => setRegister({ ...register, confirm: e.target.value })}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading !== null}
            className="w-full h-12 rounded-none bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base transition-all hover:scale-[1.01]"
          >
            {loading === "register" ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            Criar minha conta
          </Button>
        </form>
      </TabsContent>

      {/* ---------- GOOGLE ---------- */}
      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-[#2b2b31]" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#17171b] px-4 text-xs uppercase tracking-widest text-zinc-500">
            ou
          </span>
        </div>
      </div>
      <GoogleButton />
    </Tabs>
  );
}

export default function AuthGate() {
  const setVisitor = useAppStore((s) => s.setVisitor);

  return (
    <div className="min-h-screen bg-[#101013] text-zinc-50 relative overflow-hidden">
      {/* Fundo */}
      <img
        src="/img/hero.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-15"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#101013]/85 via-[#101013]/60 to-[#101013]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-10 gap-8 lg:gap-16 lg:flex-row lg:justify-between">
        {/* Marca */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center text-center max-w-md relative"
        >
          <img
            src="/logo.png"
            alt="Logo da Academia CROWN Pinhal-SP"
            className="w-80"
          />
          <h1 className="mt-8 font-display text-4xl uppercase leading-tight">
            12 <span className="text-[#d9a441]">modalidades.</span>
            <br />
            7 <span className="text-[#d9a441]">dias por semana.</span>
          </h1>
          <p className="mt-6 text-zinc-400 leading-relaxed">
            Entre para acompanhar seus treinos, conhecer as modalidades e garantir seu plano.
          </p>
        </motion.div>

        {/* Card de acesso */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.15 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex justify-center mb-6">
            <img
              src="/logo.png"
              alt="Logo da Academia CROWN Pinhal-SP"
              className="h-20 w-auto"
            />
          </div>

          <div className="clip-blade border border-[#2b2b31] bg-[#17171b]/95 backdrop-blur-xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <p className="font-heading uppercase tracking-[0.3em] text-xs text-zinc-400">
                Acesso CROWN
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase">
                Bem-vindo à <span className="text-[#d9a441]">CROWN</span>
              </h2>
            </div>

            <AuthForm />

            <Button
              variant="outline"
              onClick={() => setVisitor(true)}
              className="w-full h-12 mt-4 -skew-x-[10deg] rounded-none bg-transparent border-[#3a3a42] hover:bg-white/10 hover:text-white hover:border-[#52525b] font-heading uppercase tracking-wider transition-all"
            >
              <span className="flex items-center justify-center gap-2 skew-x-[10deg]">
                Entrar como visitante
              </span>
            </Button>
            <p className="mt-3 text-center text-xs text-zinc-400">
              Explore as modalidades e horários sem criar conta.
              <br />
              Para assinar um plano, o cadastro é necessário.
            </p>
            </div>

          <p className="mt-6 text-center text-xs text-zinc-500">
            © {new Date().getFullYear()} CROWN Academia — Pinhal-SP
          </p>
        </motion.div>
      </div>
    </div>
  );
}
