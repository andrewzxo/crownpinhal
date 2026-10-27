"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAppStore } from "@/lib/store";
import MySubscriptionsModal from "./MySubscriptionsModal";

export default function AccountMenu() {
  const user = useAppStore((s) => s.user);
  const setView = useAppStore((s) => s.setView);
  const logout = useAppStore((s) => s.logout);
  const [showSubs, setShowSubs] = useState(false);

  if (!user) return null;

  const initials = user.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const roleLabel =
    user.role === "OWNER" ? "Dono" : user.role === "ADMIN" ? "Administrador" : "Aluno";

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            aria-label="Menu da conta"
            className="flex items-center gap-2 border border-[#2b2b31] bg-[#101010] text-zinc-100 hover:border-[#d9a441]/60 transition-colors pl-1 pr-3 py-1 cursor-pointer"
          >
            <Avatar className="w-8 h-8 rounded-none border border-[#d9a441]/50">
              <AvatarFallback className="rounded-none bg-gold-gradient text-black text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="hidden sm:block text-sm font-medium max-w-[110px] truncate">
              {user.name.split(" ")[0]}
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="w-56 bg-[#141418] border-[#2b2b31] text-zinc-100"
        >
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium truncate">{user.name}</span>
              <span className="text-xs text-zinc-400 truncate">{user.email}</span>
              <span className="mt-1 inline-flex items-center gap-1 text-[10px] font-heading uppercase tracking-wider text-[#d9a441]">
                {roleLabel}
              </span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-[#2b2b31]" />
          <DropdownMenuItem
            onClick={() => setShowSubs(true)}
            className="cursor-pointer focus:bg-[#d9a441]/10 focus:text-[#d9a441]"
          >
            Meus pedidos
          </DropdownMenuItem>
          {(user.role === "ADMIN" || user.role === "OWNER") && (
            <DropdownMenuItem
              onClick={() => setView("admin")}
              className="cursor-pointer focus:bg-[#d9a441]/10 focus:text-[#d9a441]"
            >
              Painel Admin
            </DropdownMenuItem>
          )}
          {user.role === "OWNER" && (
            <DropdownMenuItem
              onClick={() => setView("owner")}
              className="cursor-pointer focus:bg-[#d9a441]/10 focus:text-[#d9a441]"
            >
              Dashboard do Dono
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-[#2b2b31]" />
          <DropdownMenuItem
            onClick={() => logout()}
            className="cursor-pointer text-red-400 focus:text-red-300 focus:bg-red-500/10"
          >
            <LogOut className="w-4 h-4 mr-2" /> Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MySubscriptionsModal open={showSubs} onOpenChange={setShowSubs} />
    </>
  );
}
