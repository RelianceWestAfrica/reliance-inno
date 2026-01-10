import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Banner } from '@/components/banner-user';

export default async function UsersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/connexion');
  }

  // Check if user is admin
  if ((session.user as any)?.role !== 'Admin') {
    redirect('/dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 p-8">
          {/* Banner */}
          <Banner 
            title={`Utilisateurs internes`}
            subtitle="Gestion interne - Utilisateurs Reliance West Africa du système"
          />
          {children}</main>
        <Footer />
      </div>
    </div>
  );
}
