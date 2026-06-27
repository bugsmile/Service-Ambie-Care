---
title: EMR 연동 — B2B Lock-in 전략
type: concept
tags: [EMR, B2B, Webhook, Lock-in, 관제, 대시보드]
source_count: 3
last_updated: 2026-04-25
---

# EMR 연동

> **KSF #4 / AOS 4.0 / DOS 3.4 — B2B 점유율 확산의 축**  
> 출처: [KSF 보고서](../sources/04-ksfs.md), [PRD FR-04](../sources/12-prd.md), [가치사슬 분석](../sources/03-value-chain.md)

---

## 정의

요양시설 전자의무기록(EMR) 시스템에 Rooted의 센서 이벤트 데이터를 **자동으로 연동**하여, 간호사의 이중 수기 기록을 완전 제거하는 기능.

---

## 문제 (As-Is)

B2B 요양시설의 구조적 고통:
- 센서 관제 시스템과 EMR 전산망이 **완전 단절**
- 간호사가 센서 이벤트를 보고 EMR에 **수동으로 다시 입력** (이중 기록)
- 낙후된 전산망 + 새 시스템 = 관리 혼란

---

## 솔루션 (To-Be)

### EMR Webhook 자동 연동 (FR-04)
- HTTP POST, JSON payload (`event_type`, `timestamp`, `confidence_score`, `zone`)
- 인증: API Key + HMAC 서명
- Rate limit: 100 req/min/facility
- MVP: 점유율 1위 벤더(케어포 등)와 '표준 플러그인' 형태로만 연동 제한 (SI 전락 방지)

### 관제 대시보드
- **신호등 방식 (적/황/녹)** 직관 UI
- 동시 다발 응급 시 위험도 순위(Triage) 자동 산정 (AC-3.5)
- B2B 관제 커스텀 필터링: 병상 구역별/이벤트 유형별/시간대별 (FR-08)

---

## 비즈니스 임팩트

### 이중 기록 제거
- As-Is: 수기 + 시스템 이중 입력
- To-Be: **EMR 자동 연동으로 이중 기록 0건** (AC-3.2)

> ⚠️ 모순: PRD와 AOS/DOS에서는 EMR 연동이 Must/Q1 핵심 성장 동력이다. 그러나 SRS v3.0은 벤더 제휴 미체결과 HMAC 구현 난이도 때문에 MVP에서 Wave 2로 연기했다. 현재 실행 기준은 "Phase 1 독립형 B2B 대시보드, EMR은 Wave 2"이다.

### Lock-in 효과
케어벨 벤치마킹: 한번 병원 전산망과 결합되면 **교체하기가 거의 불가능**  
→ 계약 유지율 극대화 + 초기 도입이 곧 영구 수주

---

## 리스크 및 대응

| 리스크 | 대응 |
|-------|------|
| R-04 SI 전락 위험 | 표준 플러그인 SaaS 모델 고수, 개별 SI 거절 |
| EMR 서버 다운 | 지수 백오프 최대 3회 재시도 + 자체 대시보드 긴급 알람 (AC-3.4) |
| 데이터 무결성 | 90일 클라우드 이중화 + 해시체인 (NFR-10) |

---

## 법적 해자 (90일 데이터 로그)

**AC-3.3:** 90일간의 이벤트 로그 클라우드 보존 → 법적 분쟁 시 데이터 무결성 증명  
→ 장영희 사례: 소송에서 새벽 2:30~5:00 데이터 공백 → 소송 불리

---

## SRS v3.0 결정: Wave 2 연기

> **SRS-001 v3.0 결정:** EMR 연동은 MVP에서 **Wave 2로 전면 연기**.
> - 이유 1: EMR 벤더(케어포 등)와 제휴(DEP-01) 미체결
> - 이유 2: HMAC-SHA256 보안 로직은 전문 엔지니어 필요 (바이브 코딩 범위 초과)
> - MVP는 독립형 SaaS 대시보드로만 운영

---

## 연관 소스
- [PRD FR-04, AC-3.x](../sources/12-prd.md)
- [SRS v3.0 §1.2 Wave 2 이관](../sources/13-srs-v03.md)
- [KSF 보고서](../sources/04-ksfs.md)
- [가치사슬 분석 (케어벨)](../sources/03-value-chain.md)
- [MVP v3.0 범위](mvp-v3-scope.md)

## 연관 엔티티
- [케어벨 (Lock-in 전략 벤치마킹)](../entities/company-carebell.md)
- [장영희 (데이터 보존 필요성)](../entities/persona-jang-younghee.md)
