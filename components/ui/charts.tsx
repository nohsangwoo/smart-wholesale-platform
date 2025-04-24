"use client"

export function BarChart() {
  // 실제로는 Chart.js 또는 다른 차트 라이브러리를 사용해야 합니다.
  // 이 예제에서는 간단한 시각적 표현만 제공합니다.
  return (
    <div className="flex h-full w-full items-end gap-2 pt-4">
      {[65, 40, 80, 55, 95, 30, 70].map((height, i) => (
        <div key={i} className="flex-1">
          <div className="rounded-t bg-primary" style={{ height: `${height}%` }}></div>
          <div className="mt-2 text-center text-xs">{["월", "화", "수", "목", "금", "토", "일"][i]}</div>
        </div>
      ))}
    </div>
  )
}

export function LineChart() {
  // 실제로는 Chart.js 또는 다른 차트 라이브러리를 사용해야 합니다.
  // 이 예제에서는 간단한 시각적 표현만 제공합니다.
  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 flex items-center">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className="w-full border-t border-gray-200" style={{ top: `${20 * i}%` }}></div>
        ))}
      </div>
      <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <path
          d="M0,50 L10,45 L20,60 L30,40 L40,45 L50,30 L60,35 L70,20 L80,30 L90,25 L100,15"
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth="2"
        />
      </svg>
      <div className="absolute bottom-0 flex w-full justify-between text-xs">
        {["1월", "2월", "3월", "4월", "5월", "6월"].map((month, i) => (
          <div key={i} className="text-center">
            {month}
          </div>
        ))}
      </div>
    </div>
  )
}
