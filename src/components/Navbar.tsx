import React from 'react';
import { RouteType } from '../hooks/useRouter';
import { ShieldCheck, Cpu, Package, Home, QrCode } from 'lucide-react';

interface NavbarProps {
  currentRoute: RouteType;
  currentPath: string;
  onNavigate: (path: string) => void;
  onOpenQuickScan?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRoute,
  onNavigate,
  onOpenQuickScan,
}) => {
  return (
    <>
      {/* Top Bar - follows strict 3-zone contract with fresh dairy blue & creamy milk surface */}
      <header className="sticky top-0 z-30 bg-[#fdfcf9]/95 backdrop-blur-md border-b border-[#e9e5db]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              LT
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0">
              LothaTrace
            </span>
          </button>

          {/* Zone 2: 4 nav links, 1-2 word labels, single-line text */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentRoute === 'home' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Trang chủ
            </button>
            <button
              onClick={() => onNavigate('/t/LT-2610-001')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentRoute === 'trace' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Tra cứu lô
            </button>
            <button
              onClick={() => onNavigate('/admin/batches')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentRoute === 'admin-batches' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Quản lý mã QR
            </button>
            <button
              onClick={() => onNavigate('/admin/simulator')}
              className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                currentRoute === 'admin-simulator' ? 'text-blue-600 font-bold' : ''
              }`}
            >
              Giả lập IoT
            </button>
          </nav>

          {/* Zone 3: 1 primary action in fresh milk blue */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onOpenQuickScan) {
                  onOpenQuickScan();
                } else {
                  onNavigate('/admin/simulator');
                }
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Quét mã demo</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Fixed Bottom Tab Bar (thumb-zone ergonomics) */}
      <nav
        aria-label="Điều hướng chính"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#fdfcf9]/95 backdrop-blur-md border-t border-[#e9e5db] no-print"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          <button
            onClick={() => onNavigate('/')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentRoute === 'home' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[11px] mt-1 tracking-tight">Trang chủ</span>
          </button>

          <button
            onClick={() => onNavigate('/t/LT-2610-001')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentRoute === 'trace' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[11px] mt-1 tracking-tight">Tra cứu</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/batches')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentRoute === 'admin-batches' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Package className="w-5 h-5" />
            <span className="text-[11px] mt-1 tracking-tight">Lô hàng</span>
          </button>

          <button
            onClick={() => onNavigate('/admin/simulator')}
            className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors cursor-pointer ${
              currentRoute === 'admin-simulator' ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            <Cpu className="w-5 h-5" />
            <span className="text-[11px] mt-1 tracking-tight">Giả lập IoT</span>
          </button>
        </div>
      </nav>
    </>
  );
};
