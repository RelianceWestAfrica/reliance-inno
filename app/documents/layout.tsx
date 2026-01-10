import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Banner } from '@/components/banner-doc';

export default async function DocumentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/connexion');
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      <div className="ml-64 flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-8">
          {/* Banner */}
          <Banner 
            title={`Documents et fichiers internes`}
            subtitle="Gestion interne - Documents Reliance West Africa"
          />
          {children}</main>
        <Footer />
      </div>
    </div>
  );
}
