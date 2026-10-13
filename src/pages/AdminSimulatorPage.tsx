import React, { useState, useEffect } from 'react';
import { getBatches, addReading, EVENT_DATA_UPDATED } from '../data/storage';
import { Batch, StageId } from '../types';
import { DEFAULT_STAGES, ALERT_THRESHOLD_TEMP } from '../data/initialData';
import {
  Cpu,
  Send,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface AdminSimulatorPageProps {
  onNavigate: (path: string) => void;
}

export const AdminSimulatorPage: React.FC<AdminSimulatorPageProps> = ({ onNavigate }) => {
  const [batches, setBatches] = useState<Batch[]>(getBatches);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('LT-2610-001');
  const [stageId, setStageId] = useState<StageId>('transport');
  const [temperature, setTemperature] = useState<string>('9.0');
  const [customLocation, setCustomLocation] = useState<string>('');
  const [lastEmitted, setLastEmitted] = useState<{
    batchId: string;
    temperature: number;
    stageName: string;
    isAlert: boolean;
    time: string;
  } | null>(null);

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

  const selectedBatch = batches.find((b) => b.id === selectedBatchId) || batches[0];

  const handleSendReading = (e: React.FormEvent) => {
    e.preventDefault();
    const tempNum = parseFloat(temperature);
    if (isNaN(tempNum)) return;

    const stageMeta = DEFAULT_STAGES.find((s) => s.id === stageId) || DEFAULT_STAGES[2];
    const loc = customLocation.trim() || `Cảm biến IoT tại ${stageMeta.name}`;

    const updated = addReading(selectedBatchId, {
      stageId,
      temperature: tempNum,
      location: loc,
    });

    if (updated) {
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastEmitted({
        batchId: selectedBatchId,
        temperature: tempNum,
        stageName: stageMeta.name,
        isAlert: tempNum >= ALERT_THRESHOLD_TEMP,
        time: timeStr,
      });
      refresh();
    }
  };

  const handlePresetTemp = (val: number) => {
    setTemperature(val.toFixed(1));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Page Title & Context */}
      <div className="pb-4 border-b border-[#e9e5db]">
        <div className="flex flex-wrap items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Cpu className="w-4 h-4" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            Giả lập Cảm biến IoT Chuỗi Lạnh
          </h1>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
            Chỉ dùng để demo
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
          Gửi số đo nhiệt độ giả lập từ cảm biến IoT theo thời gian thực. Nhiệt độ từ {ALERT_THRESHOLD_TEMP}°C trở lên sẽ tự động chuyển trạng thái lô hàng thành "Có cảnh báo nhiệt độ" và ghi nhật ký xử lý ngay lập tức mà không cần tải lại trang.
        </p>
      </div>

      {/* Acceptance Test Prompt Helper with Blue Tone */}
      <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
        <Sparkles className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-950">
            Mẹo kiểm tra yêu cầu nghiệm thu (Acceptance check):
          </p>
          <p className="text-blue-800 leading-relaxed">
            Chọn lô <strong className="font-mono">LT-2610-001</strong> (đang ở trạng thái Chuỗi lạnh nguyên vẹn), chọn nhiệt độ <strong className="font-mono">9.0°C</strong> tại công đoạn <strong>Xe vận chuyển</strong> và bấm <strong>"Gửi số đo"</strong>. Lô hàng sẽ chuyển sang cảnh báo màu hổ phách ngay lập tức!
          </p>
        </div>
      </div>

      {/* Main Simulator Form with Milky Surface */}
      <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 sm:p-6 shadow-xs space-y-5">
        <form onSubmit={handleSendReading} className="space-y-4">
          {/* Pick Batch */}
          <div>
            <label htmlFor="sim-batch" className="block text-xs font-bold text-slate-700 mb-1.5">
              1. Chọn lô hàng cần gửi số đo
            </label>
            <select
              id="sim-batch"
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full text-sm font-semibold p-2.5 rounded-xl border border-[#ebe7dd] bg-[#fcfaf5] focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.id} – {b.productName} ({b.status === 'intact' ? 'Nguyên vẹn' : b.status === 'alert' ? 'Cảnh báo' : 'Hết hạn'})
                </option>
              ))}
            </select>

            {/* Current Batch Status preview */}
            {selectedBatch && (
              <div className="mt-2 flex items-center justify-between text-xs text-slate-500 bg-[#fcfaf5] p-2.5 rounded-lg border border-[#ede9df]">
                <span>
                  Trạng thái hiện tại:{' '}
                  <strong className={`font-semibold ${
                    selectedBatch.status === 'alert'
                      ? 'text-amber-700'
                      : selectedBatch.status === 'expired'
                      ? 'text-slate-600'
                      : 'text-blue-700'
                  }`}>
                    {selectedBatch.status === 'alert'
                      ? 'Có cảnh báo nhiệt độ'
                      : selectedBatch.status === 'expired'
                      ? 'Hết hạn'
                      : 'Chuỗi lạnh nguyên vẹn'}
                  </strong>
                </span>
                <button
                  type="button"
                  onClick={() => onNavigate(`/t/${selectedBatch.id}`)}
                  className="text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1 font-medium cursor-pointer"
                >
                  <span>Xem trang tra cứu</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>

          {/* Pick Stage */}
          <div>
            <label htmlFor="sim-stage" className="block text-xs font-bold text-slate-700 mb-1.5">
              2. Chọn công đoạn phát số đo (5 chặng)
            </label>
            <select
              id="sim-stage"
              value={stageId}
              onChange={(e) => setStageId(e.target.value as StageId)}
              className="w-full text-sm p-2.5 rounded-xl border border-[#ebe7dd] bg-[#fcfaf5] focus:outline-none focus:ring-2 focus:ring-blue-600 font-medium"
            >
              {DEFAULT_STAGES.map((s, idx) => (
                <option key={s.id} value={s.id}>
                  Chặng {idx + 1}: {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Temperature Input & Presets */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="sim-temp" className="block text-xs font-bold text-slate-700">
                3. Nhập nhiệt độ đo được (°C)
              </label>
              <span className="text-[11px] text-amber-700 font-medium">
                Ngưỡng cảnh báo: ≥ {ALERT_THRESHOLD_TEMP}°C
              </span>
            </div>

            <div className="relative">
              <input
                id="sim-temp"
                type="number"
                step="0.1"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                placeholder="Ví dụ: 3.2 hoặc 9.0"
                required
                className="w-full text-lg font-bold font-mono tabular-nums p-3 pl-4 pr-12 rounded-xl border border-[#ebe7dd] bg-[#fcfaf5] focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
              <span className="absolute right-4 top-3.5 text-sm font-semibold text-slate-400">
                °C
              </span>
            </div>

            {/* Quick Presets */}
            <div className="mt-2.5">
              <span className="text-[11px] text-slate-400 block mb-1">
                Chọn nhanh nhiệt độ mẫu:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handlePresetTemp(2.5)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-[#f0ece2] hover:bg-[#e6e0d3] text-slate-700 transition-colors cursor-pointer"
                >
                  2.5°C (Lạnh sâu)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTemp(3.5)}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 transition-colors cursor-pointer"
                >
                  3.5°C (Chuẩn)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTemp(8.0)}
                  className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-colors cursor-pointer"
                >
                  8.0°C (Chạm ngưỡng)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTemp(9.0)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300 transition-colors cursor-pointer"
                >
                  9.0°C (Cảnh báo vượt)
                </button>
                <button
                  type="button"
                  onClick={() => handlePresetTemp(11.5)}
                  className="px-2.5 py-1 text-xs font-bold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 transition-colors cursor-pointer"
                >
                  11.5°C (Sự cố nghiêm trọng)
                </button>
              </div>
            </div>
          </div>

          {/* Optional Location */}
          <div>
            <label htmlFor="sim-loc" className="block text-xs font-medium text-slate-700 mb-1">
              Địa điểm / Ghi chú cảm biến (tùy chọn)
            </label>
            <input
              id="sim-loc"
              type="text"
              value={customLocation}
              onChange={(e) => setCustomLocation(e.target.value)}
              placeholder="Ví dụ: Xe lạnh 60C-882.14 qua trạm thu phí Long Thành"
              className="w-full text-xs p-2.5 rounded-xl border border-[#ebe7dd] bg-[#fcfaf5] focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer mt-2"
          >
            <Send className="w-4 h-4" />
            <span>Gửi số đo</span>
          </button>
        </form>

        {/* Emitted Result Notification */}
        {lastEmitted && (
          <div
            className={`p-4 rounded-xl border transition-all ${
              lastEmitted.isAlert
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-blue-50 border-blue-300 text-blue-950'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5">
                {lastEmitted.isAlert ? (
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                )}
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">
                    Đã gửi số đo: {lastEmitted.temperature}°C ({lastEmitted.stageName})
                  </p>
                  <p className="text-xs">
                    Lô hàng: <span className="font-mono font-bold">{lastEmitted.batchId}</span> lúc{' '}
                    <span className="font-mono">{lastEmitted.time}</span>.
                    {lastEmitted.isAlert ? (
                      <span className="block mt-1 font-semibold text-amber-900">
                        ⚠️ Đã kích hoạt cảnh báo vàng và tự động tạo 1 mục nhật ký kiểm tra xử lý!
                      </span>
                    ) : (
                      <span className="block mt-1 font-medium text-blue-800">
                        ✓ Nhiệt độ an toàn dưới ngưỡng {ALERT_THRESHOLD_TEMP}°C.
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate(`/t/${lastEmitted.batchId}`)}
                className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-[#dcd6c8] text-slate-800 hover:bg-[#f6f3eb] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>Xem lô này</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Recent Readings List on Selected Batch */}
      {selectedBatch && (
        <div className="bg-[#fefefe] rounded-2xl border border-[#ebe7dd] p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
            <h3 className="text-sm font-bold text-slate-900">
              Lịch sử các số đo của lô {selectedBatch.id} ({selectedBatch.readings.length} số đo)
            </h3>
            <span className="text-xs text-slate-400">Thời gian thực</span>
          </div>

          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {selectedBatch.readings.slice(-6).reverse().map((r) => (
              <div
                key={r.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center justify-between ${
                  r.isAlert || r.temperature >= ALERT_THRESHOLD_TEMP
                    ? 'bg-amber-50/80 border-amber-200 text-amber-900'
                    : 'bg-[#fcfaf5] border-[#ede9df] text-slate-700'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 font-semibold">
                    <span>{r.stageName}</span>
                    <span className="text-slate-400">·</span>
                    <span className="font-mono text-slate-500">{r.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-500">{r.location}</p>
                </div>

                <div className="text-right">
                  <span
                    className={`text-sm font-bold font-mono tabular-nums ${
                      r.isAlert || r.temperature >= ALERT_THRESHOLD_TEMP
                        ? 'text-amber-700'
                        : 'text-blue-600'
                    }`}
                  >
                    {r.temperature}°C
                  </span>
                  {(r.isAlert || r.temperature >= ALERT_THRESHOLD_TEMP) && (
                    <span className="block text-[10px] font-semibold text-amber-700">
                      Vượt ngưỡng
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
