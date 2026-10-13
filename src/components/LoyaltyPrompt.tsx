import React, { useState } from 'react';
import { Award, Sparkles, X, CheckCircle } from 'lucide-react';

export const LoyaltyPrompt: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto px-4 py-2 text-xs font-semibold rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-900 flex items-center justify-center gap-2 transition-colors cursor-pointer"
        aria-label="Tích điểm thành viên"
      >
        <Award className="w-4 h-4 text-blue-600" />
        <span>Tích điểm hộp sữa này</span>
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs"
        >
          <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] shadow-xl max-w-sm w-full p-5 space-y-4">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
                aria-label="Đóng hộp thoại"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-base font-bold text-slate-900">
                Tính năng đề xuất: liên kết tài khoản Lothashop
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Trong mô hình thực tế, mỗi lượt quét QR hợp lệ có thể tự động cộng 50 điểm thưởng thành viên vào ứng dụng Lothashop hoặc ví ưu đãi của khách hàng.
              </p>
            </div>

            <div className="bg-[#fcfaf5] p-3 rounded-xl border border-[#ede9df] text-xs text-slate-500 space-y-1">
              <p className="font-semibold text-slate-700 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-blue-600" />
                Mô phỏng tích lũy: +50 Điểm Lotha
              </p>
              <p className="text-[11px] text-slate-400">
                (Đây là tính năng ý tưởng trong đề tài sinh viên, chưa có cổng đăng nhập thật).
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="w-full h-10 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
};
