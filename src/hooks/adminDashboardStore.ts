import { create } from "zustand"
import { Statistics } from "@/types/statistics"
import { Analytics } from "@/types/analytics"
import { PendingLogs } from "@/types/pending_logs"

type AdminDashboardStore = {
  statistics: Statistics | null
  analytics: Analytics | null
  pending_logs: PendingLogs | null

  setStatistics: (s: Statistics) => void
  setAnalytics: (a: Analytics) => void
  setPendingLogs: (pl: PendingLogs) => void
}

export const useAdminDashboardStore = create<AdminDashboardStore>((set) => ({
  statistics: null,
  analytics: null,
  pending_logs: null,

  setStatistics: (s) =>
    set(() => ({
      statistics: s,
    })),

  setAnalytics: (a) =>
    set(() => ({
      analytics: a,
    })),

  setPendingLogs: (pl) =>
    set(() => ({
      pending_logs: pl,
    })),
}))