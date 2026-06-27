---
name: Feature Task
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Security] SEC-003: 규제 키워드 Linter GitHub Actions CI"
labels: 'security, ci, priority:medium, phase:0'
assignees: ''
---

## :dart: Summary
- 기능명: [SEC-003] GitHub Actions CI — 보안/PII 규제 키워드 정적 분석 Linter
- 목적: PR 병합 전 GitHub Actions에서 하드코딩된 시크릿, PII 필드명, 위험 SQL 패턴 등을 자동 감지하여 보안 취약점이 코드베이스에 진입하는 것을 방지한다.

## :link: References (Spec & Context)
> :bulb: AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- 관련 인프라: [`/TASKs/TASK_INFRA-003.md`](./TASK_INFRA-003.md) — GitHub Actions CI 설정
- 선행 보안: [`/TASKs/TASK_SEC-002.md`](./TASK_SEC-002.md) — PII 키워드 목록
- SRS 섹션: §7.3 Security CI/CD, NFR-SEC-003
- 태스크 리스트: [`/TASKs/SRS_V1_TASKS_list_OPUS.md`](../SRS_V1_TASKS_list_OPUS.md) — SEC-003

## :white_check_mark: Task Breakdown (실행 계획)
- [ ] `.github/workflows/security-lint.yml` 워크플로우 생성
- [ ] 감지 규칙 정의:
  - 하드코딩 시크릿: `password\s*=\s*["']`, `api_key\s*=`, `SECRET\s*=`
  - PII 필드: `\.name\b`, `\.phone\b`, `\.address\b`, `\.birthDate\b`
  - 위험 패턴: `SELECT \*`, `eval(`, `dangerouslySetInnerHTML`
- [ ] `grep -rn --include="*.ts" --include="*.tsx"` 기반 스크립트 또는 ESLint 커스텀 규칙 사용
- [ ] PR 트리거: `on: [pull_request]` — 위반 시 워크플로우 실패
- [ ] ESLint 플러그인 추가 옵션: `eslint-plugin-security` 또는 `no-secrets`
- [ ] 예외 처리: `// sec-lint-disable` 주석으로 특정 라인 제외 허용

## :test_tube: Acceptance Criteria (BDD/GWT)
**Scenario 1: 하드코딩 시크릿 감지 → CI 실패**
- Given: `const SECRET = "abc123"` 포함 PR
- When: security-lint.yml 실행
- Then: 워크플로우 실패, 라인 번호 + 경고 메시지 출력

**Scenario 2: 클린 코드 → CI 통과**
- Given: 환경변수 사용 (`process.env.SECRET`)
- When: security-lint.yml 실행
- Then: 워크플로우 성공 (GREEN)

**Scenario 3: PII 필드명 감지**
- Given: Prisma 스키마에 `phone String` 추가된 PR
- When: security-lint.yml 실행
- Then: PII 키워드 감지, 워크플로우 실패

## :gear: Technical & Non-Functional Constraints
- **CI 도구:** GitHub Actions (무료 2,000분/월)
- **실행 시간:** 린터 단계 30초 이내
- **false positive 최소화:** 예외 처리 주석 메커니즘 필수

## :checkered_flag: Definition of Done (DoD)
- [ ] `security-lint.yml` 워크플로우 생성 및 PR 트리거 동작?
- [ ] 시크릿/PII/위험 패턴 3개 카테고리 규칙 적용?
- [ ] 클린 코드 PR → GREEN 확인?
- [ ] 품질 보강 기준의 추가 Edge Cases와 검증 증거가 작업 결과에 기록되었는가?

## :mag: Quality Supplement (보강 기준)
- **식별 사유:** 자동 품질 점검에서 본문 밀도, AC/DoD 수, 제약조건 중 하나 이상이 기준선에 미달하여 보강 대상으로 분류됨.
- **범위 명확화:** 보안 요구사항을 수동 확인에만 두지 않고 정적 검사, CI 게이트, 리뷰 체크리스트로 연결한다.
- **추가 Edge Cases:** 오탐/미탐 키워드, 마스킹 누락, 권한 없는 접근, secret 노출, 로그 내 민감정보를 포함한다.
- **검증 증거:** 검색 명령 결과, CI 로그, 보안 체크리스트 완료 여부를 PR 또는 작업 로그에 첨부한다.
- **완료 품질 기준:** 구현 산출물, 테스트 산출물, SRS traceability가 모두 남아야 하며, DoD 체크는 코드/문서/실행 로그 중 하나의 근거로 확인 가능해야 한다.
- **리뷰 체크포인트:**
  - 구현 파일 경로가 Task Breakdown과 일치하는지 확인한다.
  - 실패 케이스가 Acceptance Criteria 또는 테스트에 반영되었는지 확인한다.
  - SRS 금지어 및 PII 노출 규칙을 재확인한다.
  - 외부 서비스 의존성이 mock/fallback으로 검증 가능한지 확인한다.

## :construction: Dependencies & Blockers
- **Depends on:** TASK_INFRA-003, TASK_SEC-002
- **Blocks:** 없음
