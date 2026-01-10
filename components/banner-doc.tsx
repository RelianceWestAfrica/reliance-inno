'use client';

import Image from 'next/image';
import { Calendar, Users, CheckCircle } from 'lucide-react';

interface BannerProps {
  title?: string;
  subtitle?: string;
  showStats?: boolean;
  stats?: {
    events?: number;
    guests?: number;
    users?: number;
  };
}

export function Banner({ 
  title = 'Bienvenue sur Inno', 
  subtitle = 'Système intelligent de gestion d\'événements',
  showStats = false,
  stats
}: BannerProps) {
  return (
    <div className="relative w-full h-64 mb-8 rounded-xl overflow-hidden shadow-xl border">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src="/photo 21 copie.png"
          alt="Event Management Banner"
          fill
          className="object-cover"
          priority
        />
      </div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/90 via-brand-blue/70 to-brand-blue/50" />
      
      {/* Content */}
      <div className="relative h-full flex flex-col justify-center px-8 md:px-12">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
          {title}
        </h1>
        <p className="text-xl md:text-2xl text-gray-100 mb-6">
          {subtitle}
        </p>
        
        {/* {showStats && stats && (
          <div className="flex flex-wrap gap-6 mt-4">
            {stats.events !== undefined && (
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-lg">
                <div className="bg-white/30 p-2 rounded-full">
                  <Calendar className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.events}</p>
                  <p className="text-sm text-gray-100">Événements</p>
                </div>
              </div>
            )}
            
            {stats.guests !== undefined && (
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-lg">
                <div className="bg-white/30 p-2 rounded-full">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.guests}</p>
                  <p className="text-sm text-gray-100">Invités</p>
                </div>
              </div>
            )}
            
            {stats.users !== undefined && (
              <div className="flex items-center gap-3 bg-white/20 backdrop-blur-sm px-5 py-3 rounded-lg">
                <div className="bg-white/30 p-2 rounded-full">
                  <CheckCircle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stats.users}</p>
                  <p className="text-sm text-gray-100">Utilisateurs</p>
                </div>
              </div>
            )}
          </div>
        )} */}
      </div>
    </div>
  );
}
