import { KPIResult } from "@/lib/types";

export interface KPIRepository {
  getAll(): KPIResult[];
  getByKpi(kpiId: string): KPIResult[];
  save(result: KPIResult): void;
}
