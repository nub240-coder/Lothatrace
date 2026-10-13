import React from 'react';
import { SearchX, Home } from 'lucide-react';

interface NotFoundBatchProps {
  batchId?: string;
  onNavigateHome: () => void;
}

export const NotFoundBatch: React.FC<NotFoundBatchProps> = ({ batchId, onNavigateHome }) => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4 py-12 max-w-md mx-auto space-y-5">
      <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center">
        <SearchX className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-bold text-slate-900">
          Không tìm thấy lô hàng
        </h2>
        <p className="text-sm text-slate-600 leading-relaxed">
          {batchId ? (
            <>
              Mã lô <span className="font-mono font-semibold text-slate-900">"{batchId}"</span> không tồn tại trong hệ thống demo. Vui lòng kiểm tra lại mã trên bao bì hoặc thử một trong các mã mẫu.
            </>
          ) : (
            'Mã lô hàng không hợp lệ hoặc đã bị xóa.'
          )}
        </p>
      </div>

      <div className="pt-2 flex flex-col w-full gap-2.5">
        <button
          onClick={onNavigateHome}
          className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>Về trang chủ chọn lô demo</span>
        </button>
      </div>
    </div>
  );
};
