"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import {
  Crown,
  Dumbbell,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  LogIn,
  Mail,
  Phone,
  User,
  UserPlus,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { api } from "@/lib/api";
import { useAppStore } from "@/lib/store";
import type { SessionUser } from "@/lib/types";

const inputCls =
  "h-11 bg-[#0a0a0a] border-[#2a2a2a] text-foreground placeholder:text-muted-foreground/50 focus-visible:ring-[#d9a441]/50 focus-visible:border-[#d9a441]/60 transition-all";

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
      <TabsList className="grid w-full grid-cols-2 h-12 bg-[#0a0a0a] border border-[#262626] rounded-lg p-1">
        <TabsTrigger
          value="login"
          className="font-heading uppercase tracking-wider text-sm data-[state=active]:bg-gold-gradient data-[state=active]:text-black data-[state=active]:font-semibold rounded-md"
        >
          <LogIn className="w-4 h-4 mr-2" />
          Entrar
        </TabsTrigger>
        <TabsTrigger
          value="register"
          className="font-heading uppercase tracking-wider text-sm data-[state=active]:bg-gold-gradient data-[state=active]:text-black data-[state=active]:font-semibold rounded-md"
        >
          <UserPlus className="w-4 h-4 mr-2" />
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
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-email"
                type="email"
                required
                placeholder="seu@email.com"
                className={`${inputCls} pl-10`}
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
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="login-password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Sua senha"
                className={`${inputCls} pl-10 pr-10`}
                value={login.password}
                onChange={(e) => setLogin({ ...login, password: e.target.value })}
              />
              <button
                type="button"
                aria-label="Mostrar ou ocultar senha"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-[#d9a441] transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading !== null}
            className="w-full h-12 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base gold-glow-sm transition-all hover:scale-[1.01]"
          >
            {loading === "login" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
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
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="reg-name"
                required
                placeholder="Seu nome"
                className={`${inputCls} pl-10`}
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
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-email"
                  type="email"
                  required
                  placeholder="seu@email.com"
                  className={`${inputCls} pl-10`}
                  value={register.email}
                  onChange={(e) => setRegister({ ...register, email: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-phone" className="font-heading uppercase text-xs tracking-wider text-[#d9a441]">
                WhatsApp <span className="text-muted-foreground normal-case">(opcional)</span>
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-phone"
                  type="tel"
                  placeholder="(19) 99999-9999"
                  className={`${inputCls} pl-10`}
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Mín. 6 caracteres"
                  className={`${inputCls} pl-10`}
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
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="reg-confirm"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  placeholder="Repita a senha"
                  className={`${inputCls} pl-10`}
                  value={register.confirm}
                  onChange={(e) => setRegister({ ...register, confirm: e.target.value })}
                />
              </div>
            </div>
          </div>
          <Button
            type="submit"
            disabled={loading !== null}
            className="w-full h-12 bg-gold-gradient hover:brightness-110 text-black font-heading uppercase tracking-wider font-semibold text-base gold-glow-sm transition-all hover:scale-[1.01]"
          >
            {loading === "register" ? <Loader2 className="w-5 h-5 animate-spin" /> : <Crown className="w-5 h-5" />}
            Criar minha conta
          </Button>
        </form>
      </TabsContent>
    </Tabs>
  );
}

export default function AuthGate() {
  const setVisitor = useAppStore((s) => s.setVisitor);

  return (
    <div className="min-h-screen bg-[#050505] text-foreground relative overflow-hidden grain-overlay">
      {/* Fundo */}
      <img
        src="/img/hero.jpg"
        alt=""
        aria-hidden
        className="absolute inset-0 w-full h-full object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/85 via-[#050505]/60 to-[#050505]" />
      <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#d9a441]/10 blur-[130px]" />
      <div className="absolute -bottom-32 -right-32 w-[500px] h-[500px] rounded-full bg-[#d9a441]/10 blur-[130px]" />

      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center max-w-6xl mx-auto px-4 py-10 gap-8 lg:gap-16 lg:flex-row lg:justify-between">
        {/* Marca */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="hidden lg:flex flex-col items-center text-center max-w-md"
        >
          <img
            src="/logo.png"
            alt="Logo da Academia CROWN Pinhal-SP"
            className="w-80 gold-drop-glow"
          />
          <h1 className="mt-8 font-display text-4xl uppercase leading-tight">
            Sua coroa não se <span className="text-gold-gradient">ganha.</span>
            <br />
            Ela se <span className="text-gold-gradient">conquista.</span>
          </h1>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Entre para acompanhar seus treinos, conhecer as modalidades e garantir seu plano
            na academia mais completa de Pinhal-SP.
          </p>
          <div className="mt-6 flex items-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-[#d9a441]" /> CROSS • HYROX • RUN
            </span>
            <span className="flex items-center gap-2">
              <Crown className="w-4 h-4 text-[#d9a441]" /> Estrutura premium
            </span>
          </div>
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
              className="h-20 w-auto gold-drop-glow"
            />
          </div>

          <div className="rounded-2xl bg-[#0d0d0d]/95 backdrop-blur-xl border border-[#262626] p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-6">
              <p className="font-heading uppercase tracking-[0.3em] text-xs text-[#d9a441]">
                Acesso CROWN
              </p>
              <h2 className="mt-2 font-display text-2xl uppercase">
                Bem-vindo ao <span className="text-gold-gradient">império</span>
              </h2>
            </div>

            <AuthForm />

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-[#262626]" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-[#0d0d0d] px-4 text-xs uppercase tracking-widest text-muted-foreground">
                  ou
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              onClick={() => setVisitor(true)}
              className="w-full h-12 bg-transparent border-[#3a3a3a] hover:bg-[#d9a441]/10 hover:text-[#d9a441] hover:border-[#d9a441]/50 font-heading uppercase tracking-wider transition-all"
            >
              <Eye className="w-5 h-5 mr-2" />
              Entrar como visitante
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Explore as modalidades e horários sem criar conta.
              <br />
              Para assinar um plano, o cadastro é necessário.
            </p>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground/60">
            © {new Date().getFullYear()} CROWN Academia — Pinhal-SP
          </p>
        </motion.div>
      </div>
    </div>
  );
}
