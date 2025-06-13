
import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { LayoutDashboard, Settings, Box, LogOut } from 'lucide-react'; // Example icons
import { useAuth } from '@/hooks/useAuth';

const AdminLayout: React.FC = () => {
  const { signOut } = useAuth();

  // Basic sidebar navigation items
  const navItems = [
    // { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    // { href: '/admin/sections', label: 'Seções Produtos', icon: Box },
    // Add more admin links here (e.g., Products, Orders, Settings)
    // { href: '/admin/settings', label: 'Configurações', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-muted/40">
      {/* Sidebar */}
      <aside className="hidden md:flex md:flex-col md:w-64 bg-background border-r border-border">
        <div className="flex items-center h-16 px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <img src="/lovable-uploads/ad4a0480-9a16-4bb6-844b-c579c660c65d.png" alt="Logo" className="h-8 w-auto" />
            <span className="text-lg">Admin UTI</span>
          </Link>
        </div>
        <nav className="flex-1 py-4 px-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.label}
                to={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted',
                  // Add active state styling if needed using useLocation
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto p-4 border-t border-border">
          <button
            onClick={signOut}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary hover:bg-muted text-sm"
          >
            <LogOut className="h-4 w-4" />
            Sair
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1">
        {/* Optional: Add a mobile header here if needed */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          <Outlet /> {/* Renders the nested admin route component */}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
