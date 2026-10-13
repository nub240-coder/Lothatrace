import { Batch, Feedback, StageId, TempReading, ActionLog } from '../types';
import { ALERT_THRESHOLD_TEMP, DEFAULT_STAGES, INITIAL_BATCHES } from './initialData';

const BATCHES_KEY = 'lothatrace_batches_v1';
const FEEDBACK_KEY = 'lothatrace_feedbacks_v1';
export const EVENT_DATA_UPDATED = 'lothatrace:data-updated';

function notifyChange(batchId?: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_DATA_UPDATED, { detail: { batchId } }));
  }
}

export function initializeStorage(): Batch[] {
  if (typeof window === 'undefined') return INITIAL_BATCHES;
  const raw = localStorage.getItem(BATCHES_KEY);
  if (!raw) {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
      return INITIAL_BATCHES;
    }
    return parsed;
  } catch {
    localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
    return INITIAL_BATCHES;
  }
}

export function getBatches(): Batch[] {
  return initializeStorage();
}

export function getBatch(batchId: string): Batch | null {
  const batches = getBatches();
  const found = batches.find((b) => b.id.toLowerCase() === batchId.toLowerCase());
  return found || null;
}

export function incrementScanCount(batchId: string): number {
  const batches = getBatches();
  const index = batches.findIndex((b) => b.id.toLowerCase() === batchId.toLowerCase());
  if (index === -1) return 0;

  batches[index].scanCount = (batches[index].scanCount || 0) + 1;
  localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  notifyChange(batchId);
  return batches[index].scanCount;
}

export function addReading(
  batchId: string,
  data: {
    stageId: StageId;
    temperature: number;
    location?: string;
    customTime?: string;
  }
): Batch | null {
  const batches = getBatches();
  const index = batches.findIndex((b) => b.id.toLowerCase() === batchId.toLowerCase());
  if (index === -1) return null;

  const batch = batches[index];
  const now = new Date();
  const timeStr = data.customTime || `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  const stageMeta = DEFAULT_STAGES.find((s) => s.id === data.stageId) || { id: data.stageId, name: 'Công đoạn vận chuyển' };
  
  const isAlert = data.temperature >= ALERT_THRESHOLD_TEMP;

  const newReading: TempReading = {
    id: `rd-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    stageId: data.stageId,
    stageName: stageMeta.name,
    time: timeStr,
    timestamp: now.getTime(),
    temperature: Number(data.temperature.toFixed(1)),
    location: data.location || `Cảm biến IoT tại ${stageMeta.name}`,
    isAlert,
  };

  batch.readings.push(newReading);

  // Update stage summary
  const stageIndex = batch.stages.findIndex((s) => s.id === data.stageId);
  if (stageIndex !== -1) {
    const stage = batch.stages[stageIndex];
    stage.minTemp = Math.min(stage.minTemp, newReading.temperature);
    stage.maxTemp = Math.max(stage.maxTemp, newReading.temperature);
    if (isAlert) {
      stage.hasAlert = true;
    }
  }

  // If temperature is alert (>= 8°C), update batch status to alert (unless already expired) and add action log
  if (isAlert) {
    if (batch.status !== 'expired') {
      batch.status = 'alert';
    }
    const logTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const newLog: ActionLog = {
      id: `log-${Date.now()}`,
      timestamp: now.getTime(),
      time: `${timeStr}`,
      title: `Đã kiểm tra lô hàng lúc ${logTime}`,
      detail: `Cảnh báo nhiệt độ đo được ${newReading.temperature}°C vượt ngưỡng bảo quản (≥ ${ALERT_THRESHOLD_TEMP}°C) tại công đoạn ${stageMeta.name}. Đã kích hoạt rà soát thiết bị làm lạnh và kiểm tra chất lượng sữa.`,
      operator: 'Hệ thống giám sát chuỗi lạnh & Quản lý chất lượng',
    };
    batch.actionLogs.unshift(newLog);
  }

  batches[index] = batch;
  localStorage.setItem(BATCHES_KEY, JSON.stringify(batches));
  notifyChange(batchId);
  return batch;
}

export function addFeedback(batchId: string, rating: number, comment: string): Feedback {
  const feedbacks = getFeedbacks();
  const newFeedback: Feedback = {
    id: `fb-${Date.now()}`,
    batchId,
    rating,
    comment,
    createdAt: new Date().toISOString(),
  };
  feedbacks.unshift(newFeedback);
  localStorage.setItem(FEEDBACK_KEY, JSON.stringify(feedbacks));
  notifyChange(batchId);
  return newFeedback;
}

export function getFeedbacks(batchId?: string): Feedback[] {
  if (typeof window === 'undefined') return [];
  const raw = localStorage.getItem(FEEDBACK_KEY);
  if (!raw) return [];
  try {
    const list: Feedback[] = JSON.parse(raw);
    if (!batchId) return list;
    return list.filter((f) => f.batchId.toLowerCase() === batchId.toLowerCase());
  } catch {
    return [];
  }
}

export function resetToDemo(): void {
  localStorage.setItem(BATCHES_KEY, JSON.stringify(INITIAL_BATCHES));
  localStorage.removeItem(FEEDBACK_KEY);
  notifyChange();
}
