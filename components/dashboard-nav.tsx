'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, Users, LayoutDashboard, UserCog, LogOut, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

export function DashboardNav() {
  const { data: session } = useSession() || {};
  const pathname = usePathname();
  const isAdmin = (session?.user as any)?.role === 'Admin';

  const navItems = [
    {
      href: '/dashboard',
      label: 'Tableau de bord',
      icon: LayoutDashboard,
    },
    {
      href: '/evenements',
      label: 'Événements',
      icon: Calendar,
    },
  ];

  if (isAdmin) {
    navItems.push({
      href: '/utilisateurs',
      label: 'Utilisateurs',
      icon: UserCog,
    });
  }

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-brand-blue/10 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png"
                  alt="Inno Logo"
                  width={40}
                  height={40}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-xl text-brand-blue hidden md:block">
                Inno
              </span>
            </Link>

            <div className="hidden md:flex items-center gap-1">
              {navItems?.map?.((item) => {
                const Icon = item?.icon;
                const isActive = pathname === item?.href || pathname?.startsWith?.(item?.href + '/');
                return (
                  <Link key={item?.href} href={item?.href ?? '#'}>
                    <Button
                      variant="ghost"
                      className={cn(
                        'gap-2',
                        isActive
                          ? 'bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20'
                          : 'text-gray-600 hover:text-brand-blue hover:bg-brand-blue/5'
                      )}
                    >
                      {Icon && <Icon className="h-4 w-4" />}
                      {item?.label}
                    </Button>
                  </Link>
                );
              }) ?? null}
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-gold/20 flex items-center justify-center">
                  <User className="h-4 w-4 text-brand-blue" />
                </div>
                <span className="hidden md:block">{session?.user?.name || 'Utilisateur'}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{session?.user?.name || 'Utilisateur'}</p>
                  <p className="text-xs text-muted-foreground">{session?.user?.email}</p>
                  <p className="text-xs text-brand-blue font-medium">
                    {isAdmin ? 'Administrateur' : 'Utilisateur'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="md:hidden">
                {navItems?.map?.((item) => {
                  const Icon = item?.icon;
                  return (
                    <Link key={item?.href} href={item?.href ?? '#'}>
                      <DropdownMenuItem>
                        {Icon && <Icon className="h-4 w-4 mr-2" />}
                        {item?.label}
                      </DropdownMenuItem>
                    </Link>
                  );
                }) ?? null}
                <DropdownMenuSeparator />
              </div>
              <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/connexion' })}>
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}