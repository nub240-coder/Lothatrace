import React from 'react';
import { Batch } from '../types';
import { Milk, MapPin, Calendar, Clock, Copy, Check } from 'lucide-react';

interface ProductInfoCardProps {
  batch: Batch;
}

export const ProductInfoCard: React.FC<ProductInfoCardProps> = ({ batch }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(batch.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Product Information Card with Milky Surface */}
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 flex items-center justify-center shrink-0">
              <Milk className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {batch.productName}
              </h2>
              {/* Unboxed metadata per anti-slop zero-pill guidelines */}
              <div className="flex flex-wrap items-center gap-x-2 text-xs text-slate-500 mt-1">
                <span>Dung tích {batch.volume}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums font-semibold text-slate-700">Mã lô: {batch.id}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleCopy}
            title="Sao chép mã lô"
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-[#f6f3eb] rounded-lg transition-colors cursor-pointer shrink-0"
            aria-label="Sao chép mã lô"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Date Specifications */}
        <div className="grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-[#f0ece1]">
          <div className="space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Ngày sản xuất
            </span>
            <p className="text-sm font-semibold text-slate-800 font-mono tabular-nums">
              {batch.productionDate}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Hạn sử dụng (HSD)
            </span>
            <p className={`text-sm font-semibold font-mono tabular-nums ${batch.status === 'expired' ? 'text-rose-600' : 'text-slate-800'}`}>
              {batch.expiryDate}
            </p>
          </div>
        </div>
      </div>

      {/* Origin Card with Dairy Blue Accent */}
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-50/80 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
            <MapPin className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-1 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-blue-700 tracking-wide uppercase">
                Xuất xứ sữa tươi
              </span>
              <span className="text-[11px] text-slate-400">Dữ liệu giả lập</span>
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {batch.origin.farmName}
            </h3>
            <p className="text-sm text-slate-600">
              {batch.origin.district}, {batch.origin.province}
            </p>
            <p className="text-xs text-slate-500 pt-1 leading-relaxed">
              Vùng chăn nuôi bò sữa đạt chuẩn thực hành nông nghiệp tốt (mô phỏng). Khai thác khép kín và làm lạnh ngay trong 30 phút sau khi vắt.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
