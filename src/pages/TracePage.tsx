import React, { useEffect, useRef, Suspense } from 'react';
import { useBatch } from '../hooks/useBatch';
import { incrementScanCount } from '../data/storage';
import { StatusCard } from '../components/StatusCard';
import { ProductInfoCard } from '../components/ProductInfoCard';
import { JourneyTimeline } from '../components/JourneyTimeline';
import { ActionLogCard } from '../components/ActionLogCard';
import { FeedbackCard } from '../components/FeedbackCard';
import { LoyaltyPrompt } from '../components/LoyaltyPrompt';
import { NotFoundBatch } from '../components/NotFoundBatch';
import { Eye, Activity, Sparkles, RefreshCw } from 'lucide-react';

const TemperatureChart = React.lazy(() => import('../components/TemperatureChart'));

interface TracePageProps {
  batchId: string;
  onNavigate: (path: string) => void;
}

export const TracePage: React.FC<TracePageProps> = ({ batchId, onNavigate }) => {
  const { batch, refresh } = useBatch(batchId);
  const incrementedRef = useRef<string | null>(null);

  useEffect(() => {
    // Increase scan counter on initial mount of this batchId
    if (batchId && incrementedRef.current !== batchId) {
      incrementedRef.current = batchId;
      incrementScanCount(batchId);
    }
  }, [batchId]);

  if (!batch) {
    return <NotFoundBatch batchId={batchId} onNavigateHome={() => onNavigate('/')} />;
  }

  const hasAlert = batch.status === 'alert' || batch.readings.some((r) => r.isAlert || r.temperature >= 8);

  return (
    <div className="max-w-xl mx-auto px-4 py-5 space-y-5 pb-20">
      {/* 1.a STATUS CARD - First thing visible without scrolling */}
      <StatusCard status={batch.status} expiryDate={batch.expiryDate} />

      {/* Scan Counter Banner */}
      <div className="flex items-center justify-between px-4 py-2.5 rounded-xl bg-[#fefefe] border border-[#ebe7dd] text-xs text-slate-600 shadow-2xs">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <span>
            Lô này đã được quét{' '}
            <strong className="text-slate-900 font-bold tabular-nums">
              {batch.scanCount}
            </strong>{' '}
            lần
          </span>
        </div>

        {/* Quick simulator shortcut for evaluation check */}
        <button
          onClick={() => onNavigate('/admin/simulator')}
          className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
        >
          <Activity className="w-3.5 h-3.5" />
          <span>Thử gửi số đo IoT</span>
        </button>
      </div>

      {/* 1.b & 1.c PRODUCT INFO & ORIGIN */}
      <ProductInfoCard batch={batch} />

      {/* 1.d TEMPERATURE HISTORY (Lazy loaded line chart) */}
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Lịch sử nhiệt độ hành trình
            </h3>
            <p className="text-xs text-slate-500">
              Cảm biến IoT tự động ghi nhận tại các điểm chốt
            </p>
          </div>
          <button
            onClick={refresh}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-[#f6f3eb] transition-colors cursor-pointer"
            title="Làm mới số đo"
            aria-label="Làm mới số đo"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        <Suspense
          fallback={
            <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs gap-2">
              <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <span>Đang tải biểu đồ nhiệt độ...</span>
            </div>
          }
        >
          <TemperatureChart readings={batch.readings} batchId={batch.id} />
        </Suspense>
      </div>

      {/* 1.e JOURNEY TIMELINE with 5 stages */}
      <JourneyTimeline stages={batch.stages} />

      {/* 1.f CORRECTIVE ACTION LOG */}
      <ActionLogCard logs={batch.actionLogs} hasAlert={hasAlert} />

      {/* 1.h LOYALTY BUTTON */}
      <div className="bg-gradient-to-r from-amber-500/10 via-blue-500/10 to-blue-600/10 rounded-2xl border border-blue-200/80 p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="space-y-0.5 text-center sm:text-left">
          <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide flex items-center justify-center sm:justify-start gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>Chương trình khách hàng thân thiết</span>
          </h4>
          <p className="text-xs text-slate-600">
            Tích điểm nhận quà khi mua sữa thanh trùng chính hãng
          </p>
        </div>
        <LoyaltyPrompt />
      </div>

      {/* 1.g FEEDBACK FORM */}
      <FeedbackCard batchId={batch.id} />
    </div>
  );
};
