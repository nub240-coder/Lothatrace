import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import { TempReading } from '../types';
import { ALERT_THRESHOLD_TEMP } from '../data/initialData';
import { AlertTriangle, CheckCircle2, Info } from 'lucide-react';

interface TemperatureChartProps {
  readings: TempReading[];
  batchId: string;
}

interface CustomDotProps {
  cx?: number;
  cy?: number;
  payload?: {
    temp: number;
    isAlert: boolean;
    stageName: string;
  };
}

const CustomDot: React.FC<CustomDotProps> = ({ cx, cy, payload }) => {
  if (cx === undefined || cy === undefined || !payload) return null;
  const isAlert = payload.isAlert || payload.temp >= ALERT_THRESHOLD_TEMP;

  if (isAlert) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={9} fill="#fef3c7" stroke="#d97706" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={5} fill="#d97706" />
      </g>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={5}
      fill="#2563eb"
      stroke="#ffffff"
      strokeWidth={2}
    />
  );
};

export const TemperatureChart: React.FC<TemperatureChartProps> = ({ readings }) => {
  const chartData = readings.map((r, idx) => ({
    index: idx + 1,
    time: r.time,
    stageName: r.stageName,
    location: r.location,
    temp: r.temperature,
    isAlert: r.isAlert || r.temperature >= ALERT_THRESHOLD_TEMP,
  }));

  const alertReadings = chartData.filter((d) => d.isAlert);
  const minTemp = readings.length > 0 ? Math.min(...readings.map((r) => r.temperature)) : 0;
  const maxTemp = readings.length > 0 ? Math.max(...readings.map((r) => r.temperature)) : 0;

  return (
    <div className="w-full">
      {/* Screen reader alt text for accessibility */}
      <div className="sr-only" aria-live="polite">
        Biểu đồ lịch sử nhiệt độ lô hàng gồm {readings.length} điểm đo. Nhiệt độ thấp nhất {minTemp}°C, cao nhất {maxTemp}°C.
        {alertReadings.length > 0
          ? `Có ${alertReadings.length} điểm đo vượt ngưỡng cảnh báo 8°C.`
          : 'Tất cả các điểm đo đều nằm trong ngưỡng an toàn dưới 8°C.'}
      </div>

      {/* Chart container */}
      <div className="h-64 sm:h-72 w-full pt-2 pr-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1ece1" vertical={false} />
            <XAxis
              dataKey="stageName"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
            />
            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={{ stroke: '#cbd5e1' }}
              domain={[0, (dataMax: number) => Math.max(10, Math.ceil(dataMax + 2))]}
              unit="°C"
              width={40}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload || !payload.length) return null;
                const data = payload[0].payload;
                const isOver = data.temp >= ALERT_THRESHOLD_TEMP;
                return (
                  <div className="bg-white p-3 rounded-xl shadow-md border border-[#ebe7dd] text-xs max-w-xs">
                    <p className="font-semibold text-slate-900 text-sm">{data.stageName}</p>
                    <p className="text-slate-500 mb-1.5">{data.time} · {data.location}</p>
                    <div className="flex items-center gap-2 pt-1 border-t border-[#f1ede3]">
                      <span className="text-slate-600 font-medium">Nhiệt độ:</span>
                      <span className={`text-sm font-bold tabular-nums ${isOver ? 'text-amber-700' : 'text-blue-600'}`}>
                        {data.temp}°C
                      </span>
                      {isOver && (
                        <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded-sm">
                          Cảnh báo
                        </span>
                      )}
                    </div>
                  </div>
                );
              }}
            />
            <ReferenceLine
              y={ALERT_THRESHOLD_TEMP}
              stroke="#d97706"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              label={{
                value: `Ngưỡng cảnh báo (${ALERT_THRESHOLD_TEMP}°C)`,
                fill: '#b45309',
                fontSize: 11,
                position: 'insideTopRight',
              }}
            />
            <Line
              type="monotone"
              dataKey="temp"
              stroke="#2563eb"
              strokeWidth={2.5}
              dot={<CustomDot />}
              activeDot={{ r: 8, stroke: '#2563eb', strokeWidth: 2, fill: '#fff' }}
              name="Nhiệt độ đo được"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 mt-2 px-2">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-blue-600 inline-block" />
          <span>Nhiệt độ thực đo (°C)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-amber-600 inline-block" />
          <span>Ngưỡng cảnh báo (giả định: {ALERT_THRESHOLD_TEMP}°C)</span>
        </div>
        {alertReadings.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-amber-700 inline-block" />
            <span className="text-amber-800 font-medium">Điểm đo cảnh báo</span>
          </div>
        )}
      </div>

      {/* Explanatory text under the chart */}
      <div className="mt-4 p-3.5 rounded-xl border text-sm">
        {alertReadings.length > 0 ? (
          <div className="flex items-start gap-2.5 text-amber-900 bg-amber-50/80 border-amber-200/80 -m-3.5 p-3.5 rounded-xl">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-amber-900">
                Phát hiện {alertReadings.length} số đo vượt ngưỡng an toàn (≥ {ALERT_THRESHOLD_TEMP}°C)
              </p>
              <p className="text-xs text-amber-800 leading-relaxed">
                Đỉnh nhiệt độ ghi nhận{' '}
                <span className="font-bold tabular-nums">
                  {Math.max(...alertReadings.map((r) => r.temp))}°C
                </span>{' '}
                tại chặng{' '}
                <span className="font-semibold">
                  {alertReadings.map((r) => r.stageName).join(', ')}
                </span>
                . Quy chuẩn thanh trùng khuyến nghị nhiệt độ sữa luôn dưới {ALERT_THRESHOLD_TEMP}°C. Đơn vị vận hành đã triển khai biện pháp xử lý khắc phục (xem nhật ký bên dưới).
              </p>
            </div>
          </div>
        ) : (
          <div className="flex items-start gap-2.5 text-blue-950 bg-blue-50/70 border-blue-200/80 -m-3.5 p-3.5 rounded-xl">
            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-semibold text-blue-950">
                Nhiệt độ ổn định, chuỗi lạnh bảo toàn
              </p>
              <p className="text-xs text-blue-800 leading-relaxed">
                Các số đo xuyên suốt lộ trình dao động từ{' '}
                <span className="font-semibold tabular-nums">{minTemp}°C</span> đến{' '}
                <span className="font-semibold tabular-nums">{maxTemp}°C</span>, nằm hoàn toàn trong ngưỡng bảo quản sữa tươi an toàn lý tưởng (dưới {ALERT_THRESHOLD_TEMP}°C).
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TemperatureChart;
