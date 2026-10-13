import React from 'react';
import { AlertCircle, GraduationCap } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-[#e9e5db] bg-[#fdfcf9]/80 py-6 px-4 mb-16 md:mb-0 no-print">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center text-center gap-2">
        <div className="flex items-center gap-2 text-xs font-medium text-amber-900 bg-[#fffbeb] border border-amber-300/80 px-3.5 py-1.5 rounded-lg max-w-xl">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>Dự án sinh viên – dữ liệu minh họa, không phải số liệu thật của Lothamilk.</span>
        </div>
        <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
          <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
          <span>Đề tài nghiên cứu ứng dụng IoT giám sát chuỗi lạnh thực phẩm tươi sống · Bản thử nghiệm học thuật</span>
        </p>
      </div>
    </footer>
  );
};
