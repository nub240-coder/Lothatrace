/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRouter } from './hooks/useRouter';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { TracePage } from './pages/TracePage';
import { AdminBatchesPage } from './pages/AdminBatchesPage';
import { AdminSimulatorPage } from './pages/AdminSimulatorPage';
import { NotFoundBatch } from './components/NotFoundBatch';
import { QuickScannerModal } from './components/QuickScannerModal';

export default function App() {
  const { route, navigate } = useRouter();
  const [isQuickScanOpen, setIsQuickScanOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfaf7] text-slate-800">
      {/* Top Navbar */}
      <Navbar
        currentRoute={route.type}
        currentPath={route.path}
        onNavigate={navigate}
        onOpenQuickScan={() => setIsQuickScanOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {route.type === 'home' && <HomePage onNavigate={navigate} />}

        {route.type === 'trace' && (
          <TracePage
            batchId={route.batchId || ''}
            onNavigate={navigate}
          />
        )}

        {route.type === 'admin-batches' && (
          <AdminBatchesPage onNavigate={navigate} />
        )}

        {route.type === 'admin-simulator' && (
          <AdminSimulatorPage onNavigate={navigate} />
        )}

        {route.type === 'not-found' && (
          <NotFoundBatch
            batchId={route.path}
            onNavigateHome={() => navigate('/')}
          />
        )}
      </main>

      {/* Quick Scanner Simulation Modal */}
      <QuickScannerModal
        isOpen={isQuickScanOpen}
        onClose={() => setIsQuickScanOpen(false)}
        onSelectBatch={(batchId) => navigate(`/t/${batchId}`)}
      />

      {/* Mandatory Footer on every page */}
      <Footer />
    </div>
  );
}
