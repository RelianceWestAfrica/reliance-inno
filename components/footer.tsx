export function Footer() {
  return (
    <footer className="bg-white border-t border-brand-blue/10 py-9 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-600">
              © 2025 <span className="font-semibold text-gray-600">Inno</span> 
              {/* by{' '}
              <span className="text-brand-gold"><a href="reliancewestafrica.com">Reliance West Africa</a></span> */}
            </p>
            {/* <p className="text-xs text-gray-500 mt-1">
              Système intelligent de gestion d'événements
            </p> */}
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="mailto:ephremkodah7@gmail.com" className="hover:text-brand-blue transition-colors">
              Support
            </a>
            <a href="#" className="hover:text-brand-blue transition-colors">
              Documentation
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
