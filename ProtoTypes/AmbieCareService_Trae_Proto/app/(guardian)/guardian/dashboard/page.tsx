/**
 * app/(guardian)/dashboard/page.tsx
 * Guardian Home Dashboard
 */

import { DeviceStatusIndicator } from "@/components/shared/device-status-indicator";

export default function GuardianDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">홈 대시보드</h1>
        <DeviceStatusIndicator status="ACTIVE" showLabel pulse size="lg" />
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">실시간 상태</h3>
          <p className="mt-2 text-3xl font-bold">정상</p>
          <p className="mt-1 text-sm text-muted-foreground">현재 거실에서 움직임 감지됨</p>
        </div>
        
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">오늘의 활동</h3>
          <p className="mt-2 text-3xl font-bold">85%</p>
          <p className="mt-1 text-sm text-muted-foreground">평소보다 활동적인 오전입니다</p>
        </div>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <h3 className="font-semibold">수면 분석</h3>
          <p className="mt-2 text-3xl font-bold">7h 20m</p>
          <p className="mt-1 text-sm text-muted-foreground">어제보다 30분 더 숙면하셨습니다</p>
        </div>
      </div>

      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <h3 className="mb-4 font-semibold">최근 이벤트</h3>
        <div className="space-y-4">
          {[
            { time: "오전 10:24", event: "거실 움직임 감지", status: "정상" },
            { time: "오전 08:15", event: "기상 확인", status: "정상" },
            { time: "오전 02:30", event: "야간 화장실 이동", status: "확인됨" },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
              <div>
                <p className="text-sm font-medium">{item.event}</p>
                <p className="text-xs text-muted-foreground">{item.time}</p>
              </div>
              <span className="text-xs font-semibold text-primary">{item.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
