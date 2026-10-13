import React from 'react';
import { StageInfo } from '../types';
import { CheckCircle2, AlertTriangle, Truck, Warehouse, Store, Droplet, Sprout } from 'lucide-react';

interface JourneyTimelineProps {
  stages: StageInfo[];
}

const stageIcons: Record<string, React.ReactNode> = {
  farm: <Sprout className="w-4 h-4" />,
  collection: <Droplet className="w-4 h-4" />,
  transport: <Truck className="w-4 h-4" />,
  warehouse: <Warehouse className="w-4 h-4" />,
  retail: <Store className="w-4 h-4" />,
};

export const JourneyTimeline: React.FC<JourneyTimelineProps> = ({ stages }) => {
  return (
    <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#f0ece1]">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Hành trình chuỗi lạnh (5 công đoạn)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Theo dõi liên tục từ trang trại đến kệ hàng
          </p>
        </div>
      </div>

      <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-3 before:bottom-3 before:w-0.5 before:bg-[#e4dfd3]">
        {stages.map((stage, idx) => {
          const isWarning = stage.hasAlert || stage.maxTemp >= 8;

          return (
            <div key={stage.id} className="relative group">
              {/* Timeline marker node */}
              <div
                className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center ring-4 ring-white ${
                  isWarning
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'bg-blue-600 text-white shadow-xs'
                }`}
              >
                {isWarning ? (
                  <AlertTriangle className="w-3 h-3 shrink-0" />
                ) : (
                  <CheckCircle2 className="w-3 h-3 shrink-0" />
                )}
              </div>

              {/* Stage content with milk surface */}
              <div className="bg-[#fcfaf5] rounded-xl p-3.5 border border-[#ede9df] transition-colors">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-blue-700">
                      {stageIcons[stage.id] || <Store className="w-4 h-4" />}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">
                      {idx + 1}. {stage.name}
                    </h4>
                  </div>

                  {/* Status Indicator */}
                  <div
                    className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-md ${
                      isWarning
                        ? 'bg-amber-100 text-amber-900 border border-amber-300'
                        : 'bg-blue-50 text-blue-900 border border-blue-200'
                    }`}
                  >
                    {isWarning ? (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        <span>Cảnh báo</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Đạt chuẩn</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <p className="font-medium text-slate-700">
                    <span className="text-slate-400">Địa điểm: </span>
                    {stage.location}
                  </p>
                  <p className="text-slate-500">
                    <span className="text-slate-400">Thời gian: </span>
                    {stage.timeRange}
                  </p>
                </div>

                {/* Min / Max Temperature Banner */}
                <div className="mt-2.5 pt-2 border-t border-[#e8e4d8] flex items-center justify-between text-xs">
                  <span className="text-slate-500">Dải nhiệt độ ghi nhận:</span>
                  <div className="font-mono tabular-nums font-bold">
                    <span className={isWarning ? 'text-amber-800' : 'text-blue-700'}>
                      {stage.minTemp.toFixed(1)}°C – {stage.maxTemp.toFixed(1)}°C
                    </span>
                  </div>
                </div>

                {stage.notes && (
                  <p className="mt-1.5 text-[11px] text-slate-500 italic">
                    {stage.notes}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
