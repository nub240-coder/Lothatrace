import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { getBatches, resetToDemo, EVENT_DATA_UPDATED } from '../data/storage';
import { Batch } from '../types';
import {
  QrCode,
  Download,
  Printer,
  ExternalLink,
  ShieldCheck,
  AlertTriangle,
  ClockAlert,
  RotateCcw,
  X,
  Milk,
} from 'lucide-react';

interface AdminBatchesPageProps {
  onNavigate: (path: string) => void;
}

export const AdminBatchesPage: React.FC<AdminBatchesPageProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>(getBatches);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showPrintModal, setShowPrintModal] = useState<boolean>(false);

  const refresh = () => {
    setBatches(getBatches());
  };

  useEffect(() => {
    refresh();
    const handleUpdate = () => refresh();
    window.addEventListener(EVENT_DATA_UPDATED, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(EVENT_DATA_UPDATED, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleOpenQr = async (batch: Batch) => {
    setSelectedBatch(batch);
    setIsGenerating(true);
    try {
      const targetUrl = `${window.location.origin}/t/${batch.id}`;
      const dataUrl = await QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0f172a',
          light: '#ffffff',
        },
        errorCorrectionLevel: 'H',
      });
      setQrDataUrl(dataUrl);
    } catch (err) {
      console.error('Error generating QR code:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPng = () => {
    if (!qrDataUrl || !selectedBatch) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `LothaTrace_QR_${selectedBatch.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handlePrintLabel = () => {
    window.print();
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header with Demo Warning */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#e9e5db]">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Quản lý lô hàng & Tạo mã QR
            </h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
              Chỉ dùng để demo
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Bảng danh sách lô sữa thanh trùng, lượt quét mã và công cụ in nhãn dán bao bì
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              if (confirm('Khôi phục toàn bộ dữ liệu demo về trạng thái ban đầu?')) {
                resetToDemo();
                refresh();
              }
            }}
            className="px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-[#dcd6c8] rounded-lg hover:bg-[#f6f3eb] transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Đặt lại dữ liệu</span>
          </button>
          <button
            onClick={() => onNavigate('/admin/simulator')}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span>Mở giả lập IoT</span>
          </button>
        </div>
      </div>

      {/* Batches Table with Milk Styling */}
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-[#fcfaf5] border-b border-[#ede9df] text-xs font-semibold text-slate-600">
                <th className="py-3.5 px-4">Mã lô</th>
                <th className="py-3.5 px-4">Tên sản phẩm</th>
                <th className="py-3.5 px-4">Trạng thái chuỗi lạnh</th>
                <th className="py-3.5 px-4 text-center">Lượt quét</th>
                <th className="py-3.5 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#f2eee3]">
              {batches.map((batch) => {
                const isAlert = batch.status === 'alert';
                const isExpired = batch.status === 'expired';

                return (
                  <tr key={batch.id} className="hover:bg-[#fcfaf5]/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900 text-sm whitespace-nowrap">
                      {batch.id}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">{batch.productName}</div>
                      <div className="text-xs text-slate-400">
                        {batch.volume} · HSD: {batch.expiryDate}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {isAlert && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200 text-xs font-semibold">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                          <span>Có cảnh báo nhiệt độ</span>
                        </span>
                      )}
                      {isExpired && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 text-slate-800 border border-slate-200 text-xs font-semibold">
                          <ClockAlert className="w-3.5 h-3.5 text-slate-500" />
                          <span>Hết hạn</span>
                        </span>
                      )}
                      {!isAlert && !isExpired && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 text-blue-900 border border-blue-200 text-xs font-semibold">
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>Chuỗi lạnh nguyên vẹn</span>
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-center font-mono tabular-nums font-semibold text-slate-700 whitespace-nowrap">
                      {batch.scanCount}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenQr(batch)}
                          className="px-3 py-1.5 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Tạo mã QR</span>
                        </button>

                        <button
                          onClick={() => onNavigate(`/t/${batch.id}`)}
                          className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-[#f6f3eb] rounded-lg transition-colors cursor-pointer"
                          title="Mở trang người tiêu dùng"
                          aria-label={`Mở trang tra cứu lô ${batch.id}`}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* QR Code Modal */}
      {selectedBatch && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs no-print"
        >
          <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] shadow-2xl max-w-md w-full p-6 space-y-5">
            <div className="flex items-start justify-between pb-3 border-b border-[#f0ece1]">
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Mã QR Lô Hàng: {selectedBatch.id}
                </h3>
                <p className="text-xs text-slate-500">
                  Liên kết đích: /t/{selectedBatch.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedBatch(null)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
                aria-label="Đóng"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QR Image Display */}
            <div className="flex flex-col items-center justify-center p-4 bg-[#fcfaf5] rounded-xl border border-[#ede9df]">
              {isGenerating ? (
                <div className="w-48 h-48 flex items-center justify-center">
                  <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              ) : qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`Mã QR truy xuất lô ${selectedBatch.id}`}
                  className="w-56 h-56 rounded-lg bg-white p-2 shadow-2xs"
                />
              ) : null}

              <p className="text-xs font-mono text-slate-500 mt-3 text-center break-all">
                {window.location.origin}/t/{selectedBatch.id}
              </p>
            </div>

            {/* Actions: Download PNG & Print Label */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleDownloadPng}
                disabled={!qrDataUrl}
                className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Tải PNG</span>
              </button>

              <button
                onClick={() => setShowPrintModal(true)}
                disabled={!qrDataUrl}
                className="w-full h-11 rounded-xl bg-slate-800 hover:bg-slate-900 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>In nhãn dán</span>
              </button>
            </div>

            <button
              onClick={() => {
                onNavigate(`/t/${selectedBatch.id}`);
                setSelectedBatch(null);
              }}
              className="w-full py-2.5 text-xs text-blue-700 hover:text-blue-800 font-semibold hover:underline flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Xem trực tiếp giao diện người quét</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Printable Label View */}
      {showPrintModal && selectedBatch && qrDataUrl && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
        >
          <div className="bg-[#fefefe] rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl no-print border border-[#ebe7dd]">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
              <h3 className="font-bold text-slate-900 text-base">
                Xem trước bản in nhãn hộp sữa
              </h3>
              <button
                onClick={() => setShowPrintModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Label preview box */}
            <div className="p-4 bg-[#fbf9f4] rounded-xl flex justify-center border border-[#ece7dc]">
              <div className="w-72 bg-white border-2 border-dashed border-[#cfc9b9] p-4 rounded-xl text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-blue-700 font-bold text-sm">
                  <Milk className="w-4 h-4" />
                  <span>LOTHATRACE · SỮA TƯƠI</span>
                </div>
                <div className="text-xs font-semibold text-slate-900">
                  {selectedBatch.productName}
                </div>
                <img
                  src={qrDataUrl}
                  alt="QR nhãn in"
                  className="w-36 h-36 mx-auto my-1 border border-slate-200 p-1 rounded-sm"
                />
                <div className="text-xs font-mono font-bold text-slate-800">
                  MÃ LÔ: {selectedBatch.id}
                </div>
                <div className="text-[11px] text-slate-600">
                  HSD: {selectedBatch.expiryDate} · {selectedBatch.volume}
                </div>
                <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                  Quét mã để tra cứu nhiệt độ chuỗi lạnh
                </div>
                <div className="text-[9px] text-amber-700">
                  Dự án sinh viên – dữ liệu minh họa
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowPrintModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-[#f6f3eb] rounded-lg cursor-pointer"
              >
                Hủy
              </button>
              <button
                onClick={handlePrintLabel}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Bắt đầu in</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden container specifically for system printing via window.print() */}
      {selectedBatch && qrDataUrl && (
        <div className="print-label-area hidden print:block">
          <div className="max-w-xs mx-auto border-2 border-black p-4 text-center space-y-2 font-sans">
            <h2 className="text-base font-bold tracking-tight">
              LOTHATRACE · TRUY XUẤT CHUỖI LẠNH
            </h2>
            <p className="text-sm font-semibold">{selectedBatch.productName}</p>
            <div className="my-2 flex justify-center">
              <img
                src={qrDataUrl}
                alt={`Mã QR lô ${selectedBatch.id}`}
                className="w-44 h-44 mx-auto"
              />
            </div>
            <p className="text-base font-mono font-bold">MÃ LÔ: {selectedBatch.id}</p>
            <p className="text-xs font-semibold">
              Hạn dùng: {selectedBatch.expiryDate} · Thể tích: {selectedBatch.volume}
            </p>
            <p className="text-[11px] text-slate-700">
              Quét mã bằng điện thoại để kiểm tra lịch sử nhiệt độ bảo quản
            </p>
            <p className="text-[10px] text-slate-500 pt-1 border-t border-slate-300">
              Dự án sinh viên – dữ liệu minh họa, không phải số liệu thật của Lothamilk.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
