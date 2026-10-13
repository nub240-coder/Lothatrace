import React from 'react';
import { BatchStatus } from '../types';
import { ShieldCheck, AlertTriangle, ClockAlert } from 'lucide-react';

interface StatusCardProps {
  status: BatchStatus;
  expiryDate: string;
}

export const StatusCard: React.FC<StatusCardProps> = ({ status, expiryDate }) => {
  if (status === 'intact') {
    return (
      <section
        aria-label="Trạng thái chuỗi lạnh"
        className="w-full bg-emerald-50/90 border border-emerald-300/80 rounded-2xl p-5 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <ShieldCheck className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-100 text-emerald-900 text-sm font-bold tracking-tight">
              <span>Chuỗi lạnh nguyên vẹn</span>
            </div>
            <p className="text-sm text-emerald-900 font-medium leading-relaxed pt-0.5">
              Sữa được giữ lạnh liên tục đúng tiêu chuẩn từ trang trại đến điểm bán, đảm bảo hương vị và độ tươi mới.
            </p>
          </div>
        </div>
      </section>
    );
  }

  if (status === 'alert') {
    return (
      <section
        aria-label="Trạng thái chuỗi lạnh"
        className="w-full bg-amber-50/90 border border-amber-300/90 rounded-2xl p-5 shadow-xs"
      >
        <div className="flex items-start gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0 shadow-xs">
            <AlertTriangle className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 text-amber-950 text-sm font-bold tracking-tight">
              <span>Có cảnh báo nhiệt độ</span>
            </div>
            <p className="text-sm text-amber-950 font-medium leading-relaxed pt-0.5">
              Phát hiện nhiệt độ tăng chạm hoặc vượt ngưỡng 8°C trong vận chuyển; đơn vị vận hành đã kiểm tra và xử lý khắc phục.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Expired
  return (
    <section
      aria-label="Trạng thái chuỗi lạnh"
      className="w-full bg-slate-100 border border-slate-300 rounded-2xl p-5 shadow-xs"
    >
      <div className="flex items-start gap-3.5">
        <div className="w-12 h-12 rounded-xl bg-slate-600 text-white flex items-center justify-center shrink-0 shadow-xs">
          <ClockAlert className="w-7 h-7" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-200 text-slate-800 text-sm font-bold tracking-tight">
            <span>Hết hạn</span>
          </div>
          <p className="text-sm text-slate-700 font-medium leading-relaxed pt-0.5">
            Lô sản phẩm đã vượt quá hạn sử dụng khuyến nghị ({expiryDate}), vui lòng không tiếp tục tiêu dùng.
          </p>
        </div>
      </div>
    </section>
  );
};
