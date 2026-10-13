import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { getBatches, resetToDemo } from '../data/storage';
import { Batch } from '../types';
import {
  ShieldCheck,
  AlertTriangle,
  ClockAlert,
  ArrowRight,
  Cpu,
  Database,
  BellRing,
  QrCode,
  Milk,
  RotateCcw,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>(getBatches);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [manualCode, setManualCode] = useState<string>('');

  useEffect(() => {
    // Generate QR images for the 3 demo batches
    const currentBatches = getBatches();
    setBatches(currentBatches);

    currentBatches.forEach(async (batch) => {
      try {
        const url = `${window.location.origin}/t/${batch.id}`;
        const dataUrl = await QRCode.toDataURL(url, {
          width: 220,
          margin: 1.5,
          color: {
            dark: '#0f172a',
            light: '#ffffff',
          },
        });
        setQrImages((prev) => ({ ...prev, [batch.id]: dataUrl }));
      } catch (e) {
        console.error('Failed to generate QR for batch', batch.id, e);
      }
    });
  }, []);

  const handleManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualCode.trim()) {
      onNavigate(`/t/${manualCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-8">
      {/* Hero Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 border border-blue-200/80 text-xs font-semibold text-blue-800">
          <Milk className="w-3.5 h-3.5" />
          <span>Hệ thống thử nghiệm truy xuất nguồn gốc sữa tươi</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-slate-900">
          Minh bạch từng giọt sữa tươi với công nghệ chuỗi lạnh
        </h1>
        {/* ONE-PARAGRAPH EXPLANATION (Required by prompt) */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
          Ứng dụng minh họa cách chuỗi lạnh sữa tươi vận hành khép kín: <strong>Cảm biến</strong> đo nhiệt độ tại từng chặng → <strong>Dữ liệu lô</strong> được đồng bộ tự động → <strong>Cảnh báo</strong> kích hoạt khi nhiệt độ vượt 8°C → Người tiêu dùng <strong>Quét QR</strong> trên hộp sữa để kiểm tra nguồn gốc trang trại và toàn bộ lịch sử làm mát trước khi uống.
        </p>
      </div>

      {/* 4-Step Architecture Flow Strip with Milky Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#fefefe] p-3.5 rounded-xl border border-[#ebe7dd] shadow-2xs space-y-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
            1
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pt-1">
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            <span>Cảm biến IoT</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Đo nhiệt độ liên tục ở 5 công đoạn vận chuyển.
          </p>
        </div>

        <div className="bg-[#fefefe] p-3.5 rounded-xl border border-[#ebe7dd] shadow-2xs space-y-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
            2
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pt-1">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>Dữ liệu lô</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Lưu vết trang trại, ngày sản xuất và hạn dùng.
          </p>
        </div>

        <div className="bg-[#fefefe] p-3.5 rounded-xl border border-[#ebe7dd] shadow-2xs space-y-1">
          <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-200">
            3
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pt-1">
            <BellRing className="w-3.5 h-3.5 text-amber-600" />
            <span>Cảnh báo tự động</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Phát hiện ngay khi nhiệt độ vượt ngưỡng ≥ 8°C.
          </p>
        </div>

        <div className="bg-[#fefefe] p-3.5 rounded-xl border border-[#ebe7dd] shadow-2xs space-y-1">
          <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center font-bold text-xs border border-blue-100">
            4
          </div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 pt-1">
            <QrCode className="w-3.5 h-3.5 text-blue-600" />
            <span>Quét QR xem ngay</span>
          </div>
          <p className="text-[11px] text-slate-500 leading-normal">
            Khách hàng xem chuỗi lạnh chỉ trong 5 giây.
          </p>
        </div>
      </div>

      {/* Manual lookup input */}
      <div className="bg-[#f4efe4] p-3.5 rounded-2xl max-w-md mx-auto border border-[#e5dfd2]">
        <form onSubmit={handleManualSearch} className="flex items-center gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            placeholder="Nhập mã lô (ví dụ: LT-2610-001)..."
            className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl bg-white border border-[#dcd6c8] focus:outline-none focus:ring-2 focus:ring-blue-600 uppercase font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2.5 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors cursor-pointer shrink-0"
          >
            Tra cứu
          </button>
        </form>
      </div>

      {/* 3 DEMO QR CODES SECTION */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-2">
              <span>3 Mã QR Demo để thử nghiệm</span>
              <span className="text-xs font-normal text-slate-500">(Bấm trực tiếp để mở trang tra cứu)</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Mô phỏng 3 kịch bản thực tế: Chuỗi lạnh chuẩn, Phát sinh cảnh báo nhiệt độ, và Hết hạn sử dụng
            </p>
          </div>

          <button
            onClick={() => {
              resetToDemo();
              setBatches(getBatches());
            }}
            className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 hover:underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Khôi phục dữ liệu gốc</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {batches.map((batch) => {
            const isAlert = batch.status === 'alert';
            const isExpired = batch.status === 'expired';

            let statusTitle = 'Chuỗi lạnh nguyên vẹn';
            let statusIcon = <ShieldCheck className="w-4 h-4 text-emerald-600" />;
            let badgeClass = 'bg-emerald-50 text-emerald-900 border-emerald-200';
            let cardBorder = 'border-[#ebe7dd] hover:border-blue-500';

            if (isAlert) {
              statusTitle = 'Có cảnh báo nhiệt độ';
              statusIcon = <AlertTriangle className="w-4 h-4 text-amber-600" />;
              badgeClass = 'bg-amber-50 text-amber-950 border-amber-300';
              cardBorder = 'border-amber-200 hover:border-amber-500';
            } else if (isExpired) {
              statusTitle = 'Hết hạn';
              statusIcon = <ClockAlert className="w-4 h-4 text-slate-500" />;
              badgeClass = 'bg-slate-100 text-slate-800 border-slate-300';
              cardBorder = 'border-slate-200 hover:border-slate-400';
            }

            return (
              <div
                key={batch.id}
                onClick={() => onNavigate(`/t/${batch.id}`)}
                className={`bg-[#fefefe] rounded-2xl border ${cardBorder} p-5 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
              >
                <div className="space-y-3">
                  {/* Status Badge */}
                  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-xs font-bold ${badgeClass}`}>
                    {statusIcon}
                    <span>{statusTitle}</span>
                  </div>

                  {/* Batch Details */}
                  <div>
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      Lô {batch.id}
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      {batch.productName} · {batch.volume}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      HSD: {batch.expiryDate} · Đã quét: {batch.scanCount} lần
                    </p>
                  </div>

                  {/* QR Code Container with Milk Border */}
                  <div className="p-3 bg-[#fcfaf5] rounded-xl border border-[#ede9df] flex flex-col items-center justify-center my-2">
                    {qrImages[batch.id] ? (
                      <img
                        src={qrImages[batch.id]}
                        alt={`Mã QR lô ${batch.id}`}
                        className="w-36 h-36 bg-white p-1.5 rounded-lg shadow-2xs"
                      />
                    ) : (
                      <div className="w-36 h-36 flex items-center justify-center text-xs text-slate-400">
                        Đang tạo mã QR...
                      </div>
                    )}
                    <span className="text-[10px] text-slate-400 mt-2 font-mono">
                      /t/{batch.id}
                    </span>
                  </div>
                </div>

                {/* Direct Action Link */}
                <div className="pt-3 border-t border-[#f0ece1] flex items-center justify-between text-xs font-semibold text-blue-700 group-hover:text-blue-800">
                  <span>Mở trang tra cứu lô</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Simulator Feature Banner in Deep Dairy Blue */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <h3 className="text-base font-bold">Mô phỏng Cảm biến IoT Thời gian thực</h3>
          </div>
          <p className="text-xs sm:text-sm text-blue-100 max-w-xl leading-relaxed">
            Thử gửi số đo 9.0°C vào lô LT-2610-001 để kiểm tra cơ chế cảnh báo nhiệt độ tự động kích hoạt tức thì mà không cần tải lại trang.
          </p>
        </div>

        <button
          onClick={() => onNavigate('/admin/simulator')}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs whitespace-nowrap shadow-xs transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Cpu className="w-4 h-4" />
          <span>Mở Giả Lập IoT</span>
        </button>
      </div>
    </div>
  );
};
