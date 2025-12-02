'use client';

import { 
  LayoutDashboard, 
  MessageSquare, 
  Filter, 
  MessageCircle, 
  Lightbulb, 
  BookOpen, 
  Bot, 
  Settings,
  ChevronLeft,
  LogOut
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store';
import { useAuthStore, simulateGoogleLogout } from '@/store/auth';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: <LayoutDashboard size={20} />, label: 'Dashboard', href: '/dashboard' },
  { icon: <MessageSquare size={20} />, label: 'Conversas', href: '/conversas' },
  { icon: <Filter size={20} />, label: 'Funil', href: '/' },
  { icon: <MessageCircle size={20} />, label: 'Chat', href: '/chat' },
  { icon: <Lightbulb size={20} />, label: 'Insights', href: '/insights' },
  { icon: <BookOpen size={20} />, label: 'Playbooks', href: '/playbooks' },
  { icon: <Bot size={20} />, label: 'Bots', href: '/bots' },
  { icon: <Settings size={20} />, label: 'Configurações', href: '/configuracoes' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { sidebarCollapsed, toggleSidebar } = useAppStore();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await simulateGoogleLogout();
    logout();
    router.push('/login');
  };

  return (
    <aside 
      className={`fixed left-0 top-0 h-screen bg-white border-r border-surface-200 flex flex-col transition-all duration-300 z-50 ${
        sidebarCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-primary-200">
          P
        </div>
        {!sidebarCollapsed && (
          <span className="font-display font-semibold text-xl text-surface-800 tracking-tight">
            Performancy
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href === '/' && pathname === '/') ||
              (item.href !== '/' && pathname.startsWith(item.href));
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-primary-500 text-white shadow-lg shadow-primary-200'
                      : 'text-surface-600 hover:bg-surface-100 hover:text-surface-900'
                  }`}
                >
                  <span className={`${isActive ? 'text-white' : 'text-surface-500 group-hover:text-primary-500'}`}>
                    {item.icon}
                  </span>
                  {!sidebarCollapsed && (
                    <span className="font-medium text-sm">{item.label}</span>
                  )}
                  {item.badge && !sidebarCollapsed && (
                    <span className={`ml-auto text-xs font-semibold px-2 py-0.5 rounded-full ${
                      isActive ? 'bg-white/20 text-white' : 'bg-primary-100 text-primary-600'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-surface-200">
        {!sidebarCollapsed && (
          <p className="text-xs text-surface-400 font-medium uppercase tracking-wider mb-3 px-2">
            Skyone
          </p>
        )}
        <div className={`flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-surface-100 transition-colors cursor-pointer ${
          sidebarCollapsed ? 'justify-center' : ''
        }`}>
          {user?.picture ? (
            <img 
              src={user.picture} 
              alt={user.name}
              className="w-9 h-9 rounded-full object-cover shadow-sm"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-500 flex items-center justify-center text-white font-semibold text-sm shadow-sm">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          {!sidebarCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-surface-800 truncate">
                {user?.name || 'User'}
              </p>
              <p className="text-xs text-surface-500 truncate">
                {user?.email || ''}
              </p>
            </div>
          )}
        </div>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 mt-2 w-full rounded-xl text-surface-500 hover:bg-red-50 hover:text-red-600 transition-colors ${
            sidebarCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut size={18} />
          {!sidebarCollapsed && <span className="text-sm font-medium">Sair</span>}
        </button>
      </div>

      {/* Collapse Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-white border border-surface-200 shadow-sm flex items-center justify-center hover:bg-surface-50 transition-colors"
      >
        <ChevronLeft 
          size={14} 
          className={`text-surface-500 transition-transform duration-300 ${sidebarCollapsed ? 'rotate-180' : ''}`}
        />
      </button>
    </aside>
  );
}

