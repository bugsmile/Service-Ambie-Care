---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] ENH-004: PWA 전환 — manifest.json + Service Worker 기본 설정"
labels: 'feature, infra, priority:medium, phase:3'
assignees: ''
---

## :dart: Summary
- 기능명: [ENH-004] PWA(Progressive Web App) 전환 설정
- 목적: Rooted 앱을 PWA로 전환하여 Guardian 및 시설 관리자가 모바일 홈 화면에 앱을 추가(Add to Home Screen)하고, 네이티브 앱에 가까운 UX를 경험할 수 있도록 `manifest.json`과 기본 Service Worker를 설정한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 문서: [`/SRS-Draft/SRS_V03(ENG_OPUS).md#§13.5`](../../SRS-Draft/SRS_V03(ENG_OPUS).md) — Phase 3 Enhancements
- GAP 분석: GAP-02 — PWA 전환 (모바일 네이티브 경험)
- 의존 태스크: [`/TASKs/TASK_INFRA-001.md`](./TASK_INFRA-001.md) — Next.js 초기 설정
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — ENH-004

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `public/manifest.json` 파일 생성:
  ```json
  {
    "name": "Rooted — Ambient Home Safety",
    "short_name": "Rooted",
    "description": "AI 기반 앰비언트 홈 케어 솔루션",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#ffffff",
    "theme_color": "#0f172a",
    "icons": [
      { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
      { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
    ]
  }
  ```
- [ ] 앱 아이콘 생성 — `public/icon-192.png`, `public/icon-512.png` (Rooted 로고 또는 플레이스홀더)
- [ ] `app/layout.tsx` `<head>` — manifest 링크 메타태그 추가:
  ```html
  <link rel="manifest" href="/manifest.json" />
  <meta name="theme-color" content="#0f172a" />
  <meta name="apple-mobile-web-app-capable" content="yes" />
  <meta name="apple-mobile-web-app-status-bar-style" content="default" />
  ```
- [ ] Next.js 내장 PWA 지원 활용 — `next-pwa` 패키지 또는 Next.js 14+ `metadata` API의 `manifest` 속성 사용
- [ ] Service Worker 기본 설정 (캐싱 전략):
  - Static assets (JS/CSS): Cache First
  - API 요청: Network First (실시간 데이터 캐싱 비활성)
- [ ] PWA 설치 프롬프트 테스트 — Chrome DevTools > Application > Manifest 패널 검증

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: manifest.json 정상 로드**
- Given: 앱이 배포됨
- When: Chrome DevTools Application > Manifest 패널 확인
- Then: name, icons, start_url, display 등이 올바르게 파싱되고 "Installable" 상태가 표시된다.

**Scenario 2: 모바일 홈 화면 추가**
- Given: 모바일 Chrome에서 앱 접속
- When: "홈 화면에 추가" 프롬프트 수락
- Then: Rooted 아이콘이 홈 화면에 추가되고, 앱 실행 시 standalone 모드로 열린다.

**Scenario 3: iOS Safari 지원**
- Given: iOS Safari에서 앱 접속
- When: 공유 버튼 → "홈 화면에 추가"
- Then: Apple touch icon과 앱 이름이 정상 표시된다.

**Scenario 4: 오프라인 접근 (캐시된 정적 자산)**
- Given: Service Worker가 등록되고 앱이 한 번 방문됨
- When: 네트워크 연결 해제 후 앱 재방문
- Then: 정적 자산(레이아웃, CSS)이 캐시에서 로드되어 앱 셸이 표시된다 (API 데이터는 미캐싱).

## :gear: Technical & Non-Functional Constraints
- **Next.js 호환:** `next-pwa` 패키지 또는 Next.js 14+ 내장 기능 활용
- **Service Worker 범위:** 정적 자산만 캐싱 — API 응답 캐싱 시 실시간 알림 누락 위험
- **HTTPS 필수:** Service Worker는 HTTPS 환경에서만 동작 — Vercel 배포 환경 기본 충족

## :checkered_flag: Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] Chrome DevTools에서 Installable 상태가 확인되는가?
- [ ] iOS Safari에서 홈 화면 추가가 동작하는가?
- [ ] Service Worker가 정적 자산을 캐싱하는가?
- [ ] `npm run build`가 에러 없이 완료되는가?
- [ ] TypeScript 타입 오류 0건, ESLint 경고 0건인가?

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-001 (Next.js 설정), TASK_INFRA-002 (Vercel 배포 — HTTPS)
- **Blocks:** 없음 (독립 Enhancement)
