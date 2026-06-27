/**
 * app/(admin)/dashboard/page.tsx
 * Admin Real-time Dashboard
 */

import { DeviceStatusIndicator } from "@/components/shared/device-status-indicator";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">실시간 시설 대시보드</h1>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1 text-sm shadow-sm">
            <span className="font-medium">전체 기기:</span>
            <span className="font-bold text-primary">12</span>
          </div>
          <div className="flex items-center gap-2 rounded-lg border bg-white px-3 py-1 text-sm shadow-sm">
            <span className="font-medium">활성:</span>
            <span className="font-bold text-green-600">10</span>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">기기 상태 요약</h3>
          <div className="space-y-4">
            {[
              { id: "DEV-001", room: "101호", status: "ACTIVE" as const },
              { id: "DEV-002", room: "102호", status: "ACTIVE" as const },
              { id: "DEV-003", room: "103호", status: "MAINTENANCE" as const },
              { id: "DEV-004", room: "104호", status: "ACTIVE" as const },
              { id: "DEV-005", room: "105호", status: "INACTIVE" as const },
            ].map((dev) => (
              <div key={dev.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center gap-3">
                  <DeviceStatusIndicator status={dev.status} pulse={dev.status === "ACTIVE"} />
                  <span className="font-medium">{dev.room}</span>
                  <span className="text-xs text-muted-foreground">{dev.id}</span>
                </div>
                <button className="text-xs font-medium text-primary hover:underline">상세보기</button>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h3 className="mb-4 font-semibold text-slate-800">최근 이상 징후</h3>
          <div className="flex h-[240px] flex-col items-center justify-center text-center">
            <div className="mb-2 rounded-full bg-green-100 p-3 text-green-600">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="font-medium text-slate-900">현재 감지된 이상 징후가 없습니다</p>
            <p className="text-sm text-slate-500">모든 구역이 정상적으로 모니터링되고 있습니다</p>
          </div>
        </div>
      </div>
    </div>
  );
}
