'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, LayoutDashboard, UserCog, LogOut, User, ClipboardList, FileText, AlignCenter } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

export function Sidebar() {
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
    {
      href: '/documents',
      label: 'Documents',
      icon: FileText,
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
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-white border-r border-brand-blue/10 flex flex-col">
      {/* Logo Section */}
      <div className="p-4 border-b border-brand-blue/10">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-36 h-12">
            <Image
              src="/inno1.png"
              alt="Inno Logo"
              width={92}
              height={18}
              className="object-contain"
            />
          </div>
          {/* <span className="font-bold text-2xl text-brand-blue">Inno</span> */}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-3 space-y-1">
        {navItems?.map?.((item) => {
          const Icon = item?.icon;
          const isActive = pathname === item?.href || pathname?.startsWith?.(item?.href + '/');
          return (
            <Link key={item?.href} href={item?.href ?? '#'}>
              <div
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-sm transition-all duration-200',
                  isActive
                    ? 'bg-brand-blue text-white shadow-md'
                    : 'text-gray-700 hover:bg-brand-blue/5 hover:text-brand-blue'
                )}
              >
                {Icon && <Icon className="h-5 w-5" />}
                <span className="font-medium">{item?.label}</span>
              </div>
            </Link>
          );
        }) ?? null}
      </nav>

      {/* User Section */}
      <div className="p-6 border-t border-brand-blue/10">
        {/* <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-brand-gold/20 flex items-center justify-center">
            <User className="h-5 w-5 text-brand-blue" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{session?.user?.name || 'Utilisateur'}</p>
            <p className="text-xs text-brand-blue">
              {isAdmin ? 'Administrateur' : 'Utilisateur'}
            </p>
          </div>
        </div> */}
        <Button
          onClick={() => signOut({ callbackUrl: '/connexion' })}
          variant="outline"
          className="w-full justify-start gap-2 text-gray-700 border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>
    </aside>
  );
}
