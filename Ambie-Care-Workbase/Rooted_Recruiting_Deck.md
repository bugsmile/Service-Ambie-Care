---
marp: true
theme: default
paginate: true
backgroundColor: #0a0a1a
color: #e0e0f0
style: |
  @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
  :root {
    --color-primary: #6366f1;
    --color-accent: #22d3ee;
    --color-danger: #f43f5e;
    --color-success: #10b981;
    --color-warning: #f59e0b;
    --color-bg-dark: #0a0a1a;
    --color-bg-card: rgba(255,255,255,0.05);
    --color-text-muted: #94a3b8;
  }
  section {
    font-family: 'Noto Sans KR', sans-serif;
    background: linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%);
    padding: 50px 70px;
  }
  section::after {
    color: var(--color-text-muted);
    font-size: 14px;
  }
  h1 {
    color: var(--color-accent);
    font-weight: 900;
    font-size: 2.4em;
    margin-bottom: 0.3em;
    text-shadow: 0 0 30px rgba(34,211,238,0.3);
  }
  h2 {
    color: var(--color-primary);
    font-weight: 700;
    font-size: 1.6em;
    border-bottom: 2px solid var(--color-primary);
    padding-bottom: 8px;
    margin-bottom: 20px;
  }
  h3 {
    color: #a5b4fc;
    font-weight: 500;
    font-size: 1.15em;
  }
  strong {
    color: var(--color-accent);
  }
  em {
    color: var(--color-warning);
    font-style: normal;
  }
  table {
    font-size: 0.75em;
    border-collapse: collapse;
    width: 100%;
  }
  th {
    background: var(--color-primary);
    color: #fff;
    padding: 8px 12px;
    text-align: left;
  }
  td {
    padding: 6px 12px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  tr:nth-child(even) {
    background: var(--color-bg-card);
  }
  blockquote {
    border-left: 4px solid var(--color-accent);
    background: var(--color-bg-card);
    padding: 12px 20px;
    margin: 16px 0;
    border-radius: 0 8px 8px 0;
    font-size: 0.9em;
  }
  .tag {
    display: inline-block;
    background: var(--color-primary);
    color: #fff;
    padding: 2px 10px;
    border-radius: 12px;
    font-size: 0.7em;
    margin: 2px 4px;
  }
  ul {
    line-height: 1.7;
  }
  a {
    color: var(--color-accent);
  }
  footer {
    color: var(--color-text-muted);
    font-size: 12px;
  }
---

<!-- _class: lead -->
<!-- _paginate: false -->
<!-- _backgroundColor: #0a0a1a -->

<br>

# 🏠 Rooted

## 비접촉 AI 앰비언트 홈 안전 솔루션

**공간이 사람을 돌보는 시대를 함께 만들 팀원을 찾습니다**

<br>

📍 비접촉 · 비영상 · Zero-Friction
🎯 B2B SaaS + B2C 구독 플랫폼
🚀 2026 MVP → 사업화 목표

<br>

*Co-Founding 팀 리크루팅 덱 | 2026.04*

---

## 📌 Slide 1 — 우리가 해결하는 문제

### 360건. 매달 울리는 거짓 알람이 사람을 죽입니다.

<br>

| 관점 | 현재 문제 (As-Is) | 결과 |
|:---:|:---|:---|
| **B2B** 요양시설 | 하루 12건 오탐 → 알람 피로 | 당직자 알람 무시 → **야간 낙상 사망** |
| **B2G** 지자체 | 연 847건 허위 출동 중 189건 기기 오탐 | **예산 낭비 → 조달 기피** |
| **B2C** 보호자 | CCTV 거부 + 웨어러블 방치 | **데이터 공백 → 극도의 불안** |

<br>

> *"오탐 11건이 누적된 그날 새벽, 당직자는 알람을 무시했습니다.*
> *결국 낙상 후 3시간 만에 발견, 이틀 후 사망."* — 장영희 사례

---

## 🔬 Slide 2 — 솔루션: 앰비언트 케어

### 착용도, 충전도, 조작도 필요 없는 — 공간이 돌봅니다

<br>

| | 🏥 웨어러블 (Apple Watch) | 🏠 Rooted (앰비언트) |
|:---:|:---:|:---:|
| 착용 | 매일 필수 | **불필요** |
| 충전 | 매일 필수 | **불필요** |
| 화장실 체류 분석 | ❌ 불가 | ✅ **가능** |
| 낙상 위치 추적 | ❌ 불가 | ✅ **가능** |
| 야간 동선 패턴 | ❌ 불가 | ✅ **가능** |
| 프라이버시 | 개인 데이터 수집 | **비영상 — 침해 제로** |

<br>

**핵심 기술:** UWB 레이더 비접촉 센서 + AI 딥러닝 필터링 엔진
**어르신 조작 횟수:** 0회 (Zero-Friction)

---

## 🏰 Slide 3 — 기술 Moat: 공간 맥락 지표

### 손목에서는 절대 알 수 없는 것을 공간은 압니다

<br>

| 공간 맥락 지표 | 의미 | 웨어러블 |
|:---|:---|:---:|
| **화장실 체류 시간** | 배뇨 장애, 낙상 전조 징후 | ❌ |
| **야간 동선 패턴** | 수면 품질, 치매 전조 (야간 배회) | ❌ |
| **구역별 장기 체류** | 낙상 후 비활동 감지 (5분+) | ❌ |
| **실내 이동 빈도** | 활동량 저하, 건강 상태 변화 | ❌ |
| **화장실 야간 방문** | 빈뇨 → 수면 저하 → 우울증 전조 | ❌ |

<br>

> *"밤에 화장실 자주 가시느라 선잠을 주무셔서 우울해하시는 게 더 걱정이에요.*
> *그 패턴만 알 수 있어도 병원에 일찍 모시고 갈 텐데요."* — 실 사용자 VoC

---

## 📊 Slide 4 — 시장 기회

### 글로벌 $3,294억 시장, 국내 SOM 63억 — 지금이 타이밍

<br>

| 구분 | 규모 |
|:---|---:|
| 글로벌 AI 고령자 돌봄 (2034) | **$3,294억** (CAGR 21.3%) |
| 한국 시니어케어 (2030) | **168조원** |
| **SAM** (AI+비접촉 4개 세그먼트) | **약 0.99조원** |
| **SOM** (보수적 초기 침투) | **약 63.0억원** |

<br>

### SOM 세그먼트 브레이크다운

| 세그먼트 | 규모 | 비중 | GTM |
|:---|---:|---:|:---|
| S1 공공 고위험 재가 안전망 | 26.0억 | 41.3% | Wave 3 |
| S4 장기요양 복지용구 | 19.6억 | 31.1% | Wave 3 |
| S2 가족 지불 홈케어 | 11.5억 | 18.2% | *Wave 2* |
| S3 요양시설 안전·운영 | 5.9억 | 9.3% | *Wave 1* 🎯 |

---

## 🎯 Slide 5 — 제품 로드맵 & MVP

### Phase 0~3 (5-7주): $0 인프라 비용 MVP → 즉시 검증

<br>

| Phase | 기간 | 핵심 딜리버리 |
|:---:|:---:|:---|
| **Phase 0** | 1주 | 인프라 셋업 · Prisma 모델 · Mock 데이터 |
| **Phase 1** | 2주 | 보호자 포털 UI · B2B 대시보드 · 인증 |
| **Phase 2** | 2주 | 데일리 리포트 · Gemini AI 요약 · 이메일 알림 |
| **Phase 3** | 1-2주 | 트렌드 차트 · PWA · 필터 · Analytics |

<br>

**기술 스택:** Next.js App Router + Prisma + Supabase Free + Vercel + Gemini Flash

### 북극성 지표
🎯 월간 사용자 체감 오탐 **≤ 2회/가구** | 리포트 열람률 **≥ 60%** | 조작 불만 이탈 **0건**

---

## 💰 Slide 6 — 비즈니스 모델 & GTM

### Two-Track 전략: B2B 레퍼런스 확보 → B2C 확장 → B2G 스케일

<br>

| | Wave 1 클로즈드 베타 | Wave 2 오픈 베타 | Wave 3 스케일 |
|:---|:---:|:---:|:---:|
| **타겟** | 소형 요양원 5-10곳 | 원격 보호자 100-200가구 | 전국 확산 + 공공 |
| **가격** | 설치비 0원 + **월 10만원** | **월 3만원** + 설치비 4.9만원 | 공공 조달 가격 |
| **목표** | 사용성 검증 + 레퍼런스 | 가격 민감도 + 입소문 | 매출 스케일 |
| **채널** | 직접 영업 | 디지털 마케팅 | 조달 + 복지용구 |

<br>

### Lock-in 전략 (케어벨 벤치마킹)
EMR 시스템 통합 → 병원 전산망 Lock-in → **교체 불가 = 영구 수주 → LTV 극대화**

> 규제 포지셔닝: **웰니스/홈 안전** (진단·의료 표현 회피 — R-01 대응)

---

## 🛡️ Slide 7 — 경쟁 우위 & 리스크 관리

### 5개 경쟁사 대비 Rooted의 차별화

<br>

| 경쟁사 | 포지션 | Rooted 차별화 |
|:---|:---|:---|
| **케어벨** | B2B 프리미엄 선두 | AI 오탐 제로 엔진 + SaaS 확장성 |
| **오파스넷** | B2G 공공 선두 | Two-Track 동시 공략 |
| **아카라라이프** | AIoT 스마트홈 | 안전 특화 집중 전략 |
| **유메인** | UWB 칩셋 원천 | 소프트웨어 + 서비스 레이어 |
| **비알랩** | 수면 분석 특화 | **공간 동선 분석** (화장실 체류 등) |

<br>

### 6대 리스크 & 대응 완료

| 리스크 | 대응 |
|:---|:---|
| R-01 의료기기법 | 웰니스 포지셔닝 + 금지어 CI Linter |
| R-05 웨어러블 위협 | **공간 맥락 Moat** + 특허 전략 |
| R-04 SI 전락 | SaaS 우선 + 표준 플러그인 모델 |

---

## 🤝 Slide 8 — 찾는 팀원

### 함께 만들고, 함께 성장할 Co-Founder급 동료를 찾습니다

<br>

| 역할 | 핵심 역량 | 우대 |
|:---|:---|:---|
| 🎨 **프론트엔드/UX** | React · Next.js · Tailwind · 반응형 UI | shadcn/ui · Vercel 경험 |
| ⚙️ **백엔드/인프라** | Node.js · Prisma · PostgreSQL · REST API | Supabase · 서버리스 경험 |
| 🤖 **AI/ML 엔지니어** | 신호 처리 · 딥러닝 · 시계열 분석 | UWB/레이더 · Edge AI 경험 |
| 🏥 **도메인 전문가** | 요양/돌봄 산업 이해 · B2B 영업 경험 | EMR · 공공 조달 경험 |
| 📈 **사업 개발/PM** | GTM 전략 · 투자 유치 · 사업계획서 | 헬스케어/시니어테크 경험 |
| 🔧 **HW/임베디드** | UWB 센서 · 펌웨어 · PCB 설계 | IoT 제품 양산 경험 |

<br>

> 🎯 **공통 자격:** *사업화에 대한 강한 의지 + 주 10시간 이상 헌신 가능*

---

## 🌟 Slide 9 — 우리가 제공하는 것

### 팀원으로 합류하면 얻게 되는 것

<br>

### 💎 지분 & 보상
- 초기 팀원 **스톡옵션** 부여 (기여도 기반 Vesting)
- MVP 성공 시 **창업팀 Co-Founder** 지위

### 🧠 성장 기회
- 시니어테크 시장 **글로벌 $3,294억** 성장 산업 진입
- AI + IoT + SaaS 풀스택 경험
- **13개 리서치 문서 기반** 체계적 기획 — 검증된 시장 기회

### 🏗️ 현재 준비 상태
- ✅ 시장 분석 (Porter's · TAM/SAM/SOM · 경쟁사) 완료
- ✅ 페르소나 12명 + CJM + JTBD 인터뷰 완료
- ✅ PRD v0.3 + SRS v3.0 (ISO/IEC/IEEE 29148:2018 준수)
- ✅ 개발 태스크 세분화 완료 — **바로 개발 시작 가능**

---

<!-- _class: lead -->

# 🚀 함께 시작합시다

<br>

## *"공간이 사람을 돌보는 시대"*를 만들 동료를 기다립니다

<br>

### 📧 연락처

지원 또는 문의는 아래로 연락해 주세요

<br>

**이메일:** [이메일 주소를 입력하세요]
**GitHub:** [GitHub 링크를 입력하세요]
**LinkedIn:** [LinkedIn 링크를 입력하세요]

<br>

*Rooted — 비접촉 AI 앰비언트 홈 안전 솔루션*
*© 2026. 함께하면 더 멀리 갑니다.* 🌱
