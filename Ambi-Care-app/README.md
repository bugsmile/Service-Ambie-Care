# AI-ruleset-sample

본 리포지토리는 최신 AI 코딩 어시스턴트들의 통합 환경(Harness) 설정과 운영을 위한 모범 사례(Best Practices) 및 스킬(Skills) 구성을 제공합니다.
각 도구의 특성에 맞춘 통합 하네스(Harness) 가이드 문서를 아래에서 확인할 수 있습니다.

- 🪄 **Cursor**: [README-cursor-harness.md](README-cursor-harness.md)
- 🌌 **Google Antigravity & Gemini CLI**: [README-gemini-harness.md](README-gemini-harness.md)
- 🤖 **Claude Code**: [README-claude-harness.md](README-claude-harness.md)
- 🌐 **공통 환경 (Cross-Tool Harness)**: 여러 도구에서 공유 및 적용 가능한 설정 및 한계점은 [README-common-harness.md](README-common-harness.md)를 참고하세요.

## 🚀 AI 에이전트 하네스 타입 (자율성 증가 순)

| 자율성 수준 | 하네스 타입 (Harness Type) | 정의 (Definition) | 사용 방법 (How to Use) |
| :---: | :--- | :--- | :--- |
| **Level 1**<br>(수동적/정적) | **Rules (룰)** | AI가 코드를 작성하거나 답변할 때 **항상 준수해야 하는 정적인 가이드라인 및 컨텍스트**입니다. 코딩 컨벤션, 아키텍처 원칙, 기술 스택 등을 정의합니다. | `.cursorrules`, `.cursor/rules/*.mdc`, `CLAUDE.md`, `AGENTS.md` 등의 파일에 마크다운으로 작성합니다. AI가 프롬프트를 처리할 때 배경 지식으로 **자동으로 읽고 적용**합니다. |
| **Level 2**<br>(온디맨드) | **Skills (스킬)** | 특정 작업(예: 에러 해결, Git 커밋, API 설계)을 수행하기 위한 **구체적인 절차, 노하우, 도구 사용법이 담긴 행동 지침서**입니다. | `.cursor/skills/` 폴더 등에 저장합니다. 사용자가 특정 작업을 요청하거나 AI가 필요하다고 판단할 때, **해당 스킬 문서를 먼저 읽고 그 안의 절차대로 작업을 수행**합니다. |
| **Level 3**<br>(이벤트 기반) | **Hooks / Plugins (훅/플러그인)** | 특정 이벤트(예: 커밋, 파일 저장)에 **자동 트리거**되거나(Hooks), 특정 기능 셋을 **패키징하여 확장**하는(Plugins) 단계입니다. | **[도구 종속적]** Cursor는 `hooks.json`으로 백그라운드 이벤트를 매핑하며, Claude Code는 `Plugins`를 통해 스킬/에이전트를 패키징 및 확장합니다. 명시적 프롬프트 없이도 정해진 라이프사이클이나 환경에 맞춰 동작합니다. |
| **Level 4**<br>(위임형/독립적) | **Subagents (서브에이전트)** | 특정 도메인(예: 코드 리뷰, DB 분석, 프론트엔드 구현)에 특화된 프롬프트와 컨텍스트를 가지고 **독립적으로 실행되는 전문 AI 어시스턴트**입니다. | `.cursor/agents/*.md` 등에 이름과 역할을 정의합니다. 사용자가 `@서브에이전트`로 직접 호출하거나, 메인 AI가 작업 성격을 분석해 **자율적으로 적합한 서브에이전트를 백그라운드(Task)로 실행시켜 작업을 위임**합니다. |
| **Level 5**<br>(완전 자율형) | **Workflows (워크플로우)** | 여러 룰, 스킬, 서브에이전트가 결합되어 **다단계 프로세스와 조건부 로직을 스스로 오케스트레이션하는 엔드투엔드 파이프라인**입니다. | `.agents/workflows/` 등에 단계별 목표와 조건을 정의합니다. 사용자로부터 큰 목표(예: "새 기능 개발 후 테스트 및 PR 생성")가 주어지면, **AI가 스스로 계획을 세우고 필요한 도구와 에이전트들을 순차적/병렬적으로 호출하며 최종 목표를 완수**합니다. |