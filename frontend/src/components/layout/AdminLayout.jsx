import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Ticket,
  Receipt,
  Layers,
  PlusCircle,
  Image as ImageIcon,
  List,
  Star,
  ShieldCheck,
  LogOut,
  ChevronRight,
  MessageSquare,
  Menu,
  X,
} from 'lucide-react';
import api from '../../services/api';

const navGroups = [
  {
    title: 'Main menu',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: ShoppingCart, label: 'Order Management', path: '/orders' },
      { icon: MessageSquare, label: 'Enquiries', path: '/enquiries' },
      { icon: Users, label: 'Customers', path: '/customers' },
      { icon: Ticket, label: 'Coupon Code', path: '/coupons' },
      { icon: Receipt, label: 'Transaction', path: '/transactions' },
    ],
  },
  {
    title: 'Product',
    items: [
      { icon: PlusCircle, label: 'Add Products', path: '/add-product' },
      { icon: Layers, label: 'Categories', path: '/categories' },
      { icon: ImageIcon, label: 'Product Media', path: '/media' },
      { icon: List, label: 'Product List', path: '/products' },
      { icon: Star, label: 'Product Reviews', path: '/reviews' },
    ],
  },
  {
    title: 'Admin',
    items: [
      { icon: ShieldCheck, label: 'Admin role', path: '/roles' },
    ],
  },
];

export default function AdminLayout({ setIsAuthenticated }) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (err) {
      console.error('Logout failed:', err);
    }
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    if (setIsAuthenticated) setIsAuthenticated(false);
    else window.location.href = '/';
  };

  const closeSidebar = () => setSidebarOpen(false);

  const SidebarContent = () => (
    <>
      <div className="admin-sidebar-logo">
        <div className="admin-brand">
          <div className="admin-brand-mark">D</div>
          <span className="admin-brand-name">DEALP<span>O</span>RT</span>
        </div>
        <button
          className="admin-sidebar-close"
          type="button"
          aria-label="Close admin menu"
          onClick={closeSidebar}
        >
          <X size={18} />
        </button>
      </div>

      <nav className="admin-sidebar-nav">
        {navGroups.map((group) => (
          <div key={group.title} className="admin-nav-group">
            <div className="admin-nav-title">{group.title}</div>
            {group.items.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeSidebar}
                  className={`admin-nav-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight size={14} />}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="admin-sidebar-footer">
        <button onClick={handleLogout} className="admin-logout-button">
          <LogOut size={16} />
          Secure Logout
        </button>
      </div>
    </>
  );

  return (
    <div className={`admin-shell ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <button
        className="admin-mobile-menu"
        type="button"
        aria-label="Open admin menu"
        onClick={() => setSidebarOpen(true)}
      >
        <Menu size={20} />
        <span>Menu</span>
      </button>

      {sidebarOpen && (
        <button
          className="admin-sidebar-backdrop"
          type="button"
          aria-label="Close admin menu"
          onClick={closeSidebar}
        />
      )}

      <aside className="admin-sidebar">
        <SidebarContent />
      </aside>

      <div className="admin-main">
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
