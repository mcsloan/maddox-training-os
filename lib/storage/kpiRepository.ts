import { KPIResult } from "@/lib/types";

export interface KPIRepository {
  getAll(): KPIResult[];
  getByKpi(kpiId: string): KPIResult[];
  getById(resultId: string): KPIResult | null;
  save(result: KPIResult): void;
  delete(resultId: string): void;
  clearAll(): void;
}
