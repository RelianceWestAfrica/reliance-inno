'use client';

import { useSession, signOut } from 'next-auth/react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { LogOut, User } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';


export function Header() {
  const { data: session, status } = useSession() || {};

  if (status === 'loading') {
    return (
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-end px-8 shadow-sm">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse" />
      </header>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user as any;
  const userInitials = user?.name
    ?.split(' ')
    ?.map((n: string) => n[0])
    ?.join('')
    ?.toUpperCase()
    ?.slice(0, 2) || 'U';

  return (
    <header className="bg-white border-b border-gray-200 h-20 flex items-center justify-end px-8 shadow-sm">
      {/* <div className="text-center md:text-left item-left mr-auto">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="relative w-36 h-26">
            <Image
              src="/in2.png"
              alt="Inno Logo"
              width={92}
              height={28}
              className="object-contain"
            />
          </div>
        </Link>
        
      </div> */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-auto gap-3 hover:bg-gray-50">
            <div className="flex flex-col items-end">
              <span className="text-sm font-medium text-gray-900">{user?.name}</span>
              <span className="text-xs text-gray-500">
                {user?.role === 'Admin' ? 'Administrateur' : 'Utilisateur'}
              </span>
            </div>
            <Avatar className="h-10 w-10 border-2 border-brand-blue">
              <AvatarFallback className="bg-brand-blue text-white text-sm font-semibold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-white" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-gray-900">{user?.name}</p>
              <p className="text-xs leading-none text-gray-500">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer hover:bg-red-50 focus:bg-red-50 text-red-600"
            onClick={() => signOut({ callbackUrl: '/connexion' })}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Se déconnecter</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
