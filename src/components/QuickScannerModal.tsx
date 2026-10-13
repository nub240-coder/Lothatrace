import React, { useState } from 'react';
import { X, QrCode, Camera, ArrowRight } from 'lucide-react';
import { getBatches } from '../data/storage';

interface QuickScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectBatch: (batchId: string) => void;
}

export const QuickScannerModal: React.FC<QuickScannerModalProps> = ({
  isOpen,
  onClose,
  onSelectBatch,
}) => {
  const [manualInput, setManualInput] = useState('');
  const batches = getBatches();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualInput.trim()) {
      onSelectBatch(manualInput.trim().toUpperCase());
      onClose();
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs no-print"
    >
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] shadow-2xl max-w-sm w-full p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Mô phỏng máy quét QR
              </h3>
              <p className="text-[11px] text-slate-500">
                Chọn lô mẫu để giả lập thao tác quét
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
            aria-label="Đóng"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder Graphic with Dairy Blue Beam */}
        <div className="relative bg-slate-900 rounded-xl p-6 text-center text-white space-y-2 overflow-hidden">
          <div className="w-32 h-32 mx-auto border-2 border-blue-400/80 rounded-xl relative flex items-center justify-center">
            <div className="w-full h-0.5 bg-blue-400/90 absolute animate-pulse shadow-sm shadow-blue-400" />
            <QrCode className="w-16 h-16 text-slate-500/40" />
          </div>
          <p className="text-xs text-slate-300">
            Hướng camera vào mã QR in trên hộp sữa
          </p>
        </div>

        {/* Quick batch choices */}
        <div className="space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide block">
            Hoặc chọn nhanh mã demo:
          </span>

          <div className="space-y-1.5">
            {batches.map((b) => (
              <button
                key={b.id}
                onClick={() => {
                  onSelectBatch(b.id);
                  onClose();
                }}
                className="w-full p-2.5 rounded-xl border border-[#ebe7dd] hover:border-blue-500 hover:bg-blue-50/50 text-left transition-colors flex items-center justify-between group cursor-pointer text-xs"
              >
                <div>
                  <div className="font-bold text-slate-900 font-mono">
                    {b.id}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {b.status === 'intact'
                      ? 'Chuỗi lạnh nguyên vẹn'
                      : b.status === 'alert'
                      ? 'Có cảnh báo nhiệt độ 8°C'
                      : 'Hết hạn sử dụng'}
                  </div>
                </div>

                <div className="flex items-center gap-1 font-semibold text-blue-700">
                  <span>Quét</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Manual Code Form */}
        <form onSubmit={handleSubmit} className="pt-2 border-t border-[#f0ece1] flex gap-2">
          <input
            type="text"
            value={manualInput}
            onChange={(e) => setManualInput(e.target.value)}
            placeholder="Nhập mã lô khác..."
            className="flex-1 text-xs px-3 py-2 rounded-lg border border-[#ebe7dd] uppercase font-mono focus:outline-none focus:ring-1 focus:ring-blue-600 bg-[#fcfaf5]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700 cursor-pointer"
          >
            Mở
          </button>
        </form>
      </div>
    </div>
  );
};
