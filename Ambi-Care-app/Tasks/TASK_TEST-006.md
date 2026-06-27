---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Test] TEST-006: [Unit] Heartbeat API 테스트"
labels: 'test, backend, priority:high, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [TEST-006] POST `/api/devices/[deviceId]/heartbeat` Heartbeat API 단위 테스트
- 목적: HB-001에서 구현한 Heartbeat API가 API Key 인증, deviceId 유효성, 타임스탬프 업데이트를 올바르게 처리하는지 검증한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 테스트 대상: [`/TASKs/all/TASK_HB-001.md`](./TASK_HB-001.md) — POST `/api/devices/[deviceId]/heartbeat`
- API 계약: [`/TASKs/all/TASK_API-004.md`](./TASK_API-004.md) — Heartbeat API 규격
- SRS 섹션: §5.4 Device Heartbeat, AC of API-004
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — TEST-006

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] 테스트 파일: `__tests__/api/devices/heartbeat.test.ts`
- [ ] `updateDeviceStatus` Server Action Mock 또는 Prisma Client Mock 설정
- [ ] 테스트 케이스:
  - API Key 미전송 → 401
  - 잘못된 API Key → 401
  - 존재하지 않는 `deviceId` → 404
  - 유효한 요청 → 200 + `{ lastHeartbeatAt }` 업데이트 확인
  - `deviceId` 경로 파라미터 공백/형식 오류 → 400
  - `healthStatus` 허용값 외 입력 → 400
  - `INACTIVE` 디바이스 하트비트 → `ACTIVE` 복구 확인
  - Prisma update 실패 시 → 500

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: API Key 미전송 → 401**
- Given: Authorization 헤더 없음
- When: POST `/api/devices/dev-001/heartbeat`
- Then: 401 Unauthorized

**Scenario 2: 유효한 요청 → 200**
- Given: 유효한 API Key + 존재하는 deviceId
- When: POST `/api/devices/dev-001/heartbeat` with `{ healthStatus: "OK" }`
- Then: 200 OK + `{ lastHeartbeatAt: <ISO timestamp>, status: "ACTIVE" }`

**Scenario 3: 존재하지 않는 deviceId → 404**
- Given: 유효한 API Key, 미등록 deviceId
- When: POST `/api/devices/unknown/heartbeat`
- Then: 404 Not Found

**Scenario 4: INACTIVE 디바이스 복구**
- Given: 유효한 API Key, `status: "INACTIVE"`인 deviceId
- When: POST `/api/devices/dev-001/heartbeat`
- Then: `updateDeviceStatus`가 `status: "ACTIVE"`와 현재 `lastHeartbeatAt`으로 호출된다.

## :gear: Technical & Non-Functional Constraints
- **테스트 격리:** Prisma Mock 사용
- **타임스탬프:** `lastHeartbeatAt` 업데이트 여부 mock 반환값으로 확인
- **경로 규격:** `/api/heartbeat` 단축 경로 사용 금지
- **실행 속도:** 단위 테스트 5초 이내 완료

## :checkered_flag: Definition of Done (DoD)
- [ ] 인증/유효성/정상 케이스 6개 모두 구현?
- [ ] 모든 테스트 GREEN?
- [ ] `updateDeviceStatus` 또는 Prisma `sensorDevice.update` mock 호출 인수 검증?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 테스트 대상 함수/API, fixture, mock 범위, 성공/실패 판정 기준을 Given-When-Then과 1:1로 맞춘다.
- **추가 Edge Cases:** 경계값, 빈 데이터, 권한 실패, 외부 API 실패, 시간 의존 로직의 deterministic clock을 포함한다.
- **검증 증거:** 테스트 파일 경로, 실행 명령, 실패 시 재현 조건, coverage가 필요한 핵심 분기를 기록한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_HB-001, TASK_API-004
- **Blocks:** 없음
