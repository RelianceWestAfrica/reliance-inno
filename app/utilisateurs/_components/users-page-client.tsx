'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { UsersTable } from '@/components/users-table';

interface UsersPageClientProps {
  users: any[];
  currentUserId: string;
  adminCount: number;
  regularCount: number;
}

export function UsersPageClient({ users, currentUserId, adminCount, regularCount }: UsersPageClientProps) {
  const [searchTerm, setSearchTerm] = useState('');

  // Filter users based on search term
  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    
    const search = searchTerm.toLowerCase();
    const name = user?.name?.toLowerCase() ?? '';
    const email = user?.email?.toLowerCase() ?? '';
    const role = user?.role?.toLowerCase() ?? '';
    
    return (
      name.includes(search) ||
      email.includes(search) ||
      role.includes(search)
    );
  });

  return (
    <div className="space-y-8">
      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Total utilisateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-blue">{users?.length ?? 0}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Administrateurs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-purple-600">{adminCount}</p>
          </CardContent>
        </Card>
        <Card className="border-gray-200 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">
              Utilisateurs réguliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-brand-gold">{regularCount}</p>
          </CardContent>
        </Card>
      </div>

      {/* Users Table with Search */}
      <Card className="border-gray-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-brand-blue mb-3">Liste des utilisateurs</CardTitle>
              <CardDescription className="text-gray-500 ">Gérez les comptes et permissions</CardDescription>
            </div>
          </div>
          {/* Search Bar */}
          <div className="pt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher par nom, email ou rôle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-200 focus:border-brand-blue focus:ring-brand-blue"
              />
            </div>
            {searchTerm && (
              <p className="text-sm text-gray-600 mt-2">
                {filteredUsers.length} résultat{filteredUsers.length !== 1 ? 's' : ''} trouvé{filteredUsers.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <UsersTable users={filteredUsers} currentUserId={currentUserId} />
        </CardContent>
      </Card>
    </div>
  );
}
