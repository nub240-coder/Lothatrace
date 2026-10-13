import React from 'react';
import { ActionLog } from '../types';
import { ClipboardCheck, ShieldAlert, CheckCircle } from 'lucide-react';

interface ActionLogCardProps {
  logs: ActionLog[];
  hasAlert: boolean;
}

export const ActionLogCard: React.FC<ActionLogCardProps> = ({ logs, hasAlert }) => {
  return (
    <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-[#f0ece1]">
        <ClipboardCheck className="w-5 h-5 text-blue-600" />
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Nhật ký kiểm tra & xử lý sự cố
          </h3>
          <p className="text-xs text-slate-500">
            Biện pháp khắc phục khi có cảnh báo nhiệt độ
          </p>
        </div>
      </div>

      {logs.length > 0 ? (
        <div className="space-y-3">
          {logs.map((log) => (
            <div
              key={log.id}
              className="bg-amber-50/80 border border-amber-200/90 rounded-xl p-3.5 space-y-1.5"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
                  <h4 className="text-sm font-bold text-amber-950">
                    {log.title}
                  </h4>
                </div>
                <span className="text-[11px] font-mono tabular-nums text-amber-800">
                  {log.time}
                </span>
              </div>
              <p className="text-xs text-amber-900 leading-relaxed">
                {log.detail}
              </p>
              <div className="pt-1 border-t border-amber-200/60 flex items-center justify-between text-[11px] text-amber-800">
                <span>Người phụ trách: {log.operator}</span>
                <span className="font-semibold text-emerald-800 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Đã hoàn tất xử lý
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : hasAlert ? (
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
          Đang tổng hợp biên bản kiểm tra từ đội ngũ quản lý chất lượng.
        </div>
      ) : (
        <div className="p-4 bg-[#fcfaf5] rounded-xl border border-[#ede9df] text-xs text-slate-600 flex items-center gap-2.5">
          <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
          <span>
            Lô hàng duy trì liên tục trong điều kiện nhiệt độ chuẩn. Không phát sinh cảnh báo và không cần can thiệp kỹ thuật.
          </span>
        </div>
      )}
    </div>
  );
};
