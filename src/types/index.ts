export type BatchStatus = 'intact' | 'alert' | 'expired';

export type StageId = 'farm' | 'collection' | 'transport' | 'warehouse' | 'retail';

export interface StageInfo {
  id: StageId;
  name: string;
  location: string;
  timeRange: string;
  minTemp: number;
  maxTemp: number;
  hasAlert: boolean;
  notes?: string;
}

export interface TempReading {
  id: string;
  stageId: StageId;
  stageName: string;
  time: string;
  timestamp: number;
  temperature: number;
  location: string;
  isAlert: boolean;
}

export interface ActionLog {
  id: string;
  timestamp: number;
  time: string;
  title: string;
  detail: string;
  operator: string;
}

export interface Feedback {
  id: string;
  batchId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Batch {
  id: string;
  productName: string;
  volume: string;
  productionDate: string;
  expiryDate: string;
  expiryTimestamp: number;
  origin: {
    farmName: string;
    district: string;
    province: string;
  };
  stages: StageInfo[];
  readings: TempReading[];
  actionLogs: ActionLog[];
  scanCount: number;
  status: BatchStatus;
}
