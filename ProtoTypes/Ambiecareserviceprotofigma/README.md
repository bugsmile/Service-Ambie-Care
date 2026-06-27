# AmbieCARE Service UI Prototype

본 프로젝트는 AmbieCARE 서비스의 UI 프로토타입을 위한 코드 번들입니다. Figma에서 디자인된 UI를 React 및 Vite 환경으로 내보내어 작성된 실행 가능한 프론트엔드 프로젝트입니다.

🔗 **[Figma 원본 프로젝트 링크](https://www.figma.com/design/kIflHlI8ILTtBSfEr71Uq3/UI-%ED%94%84%EB%A1%9C%ED%86%A0%ED%83%80%EC%9E%85-%EC%9E%91%EC%84%B1)**

## 🛠 기술 스택 (Tech Stack)

- **Framework:** React 18
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS 4, Emotion
- **UI Components:** Radix UI, Material UI (MUI)
- **Icons:** Lucide React, MUI Icons
- **Animation & Visuals:** Framer Motion, Canvas Confetti
- **Routing:** React Router 7
- **Charts:** Recharts
- **Package Manager:** pnpm / npm

## 📋 사전 요구사항 (Prerequisites)

프로젝트를 실행하기 전에 다음 환경이 구축되어 있어야 합니다.
- **Node.js** (v18 이상 권장)
- **npm** 또는 **pnpm** (pnpm workspace 설정이 존재하므로 pnpm 사용을 권장합니다)

## 🚀 로컬 실행 방법 (Getting Started)

프로젝트를 로컬 환경에서 실행하려면 아래 단계를 순서대로 진행해 주세요.

### 1. 패키지 설치

프로젝트 루트 디렉토리(이 `README.md` 파일이 있는 위치)에서 터미널을 열고 다음 명령어를 실행하여 필요한 패키지를 설치합니다.

```bash
# pnpm을 사용하는 경우 (권장)
pnpm install

# npm을 사용하는 경우
npm install
```

### 2. 개발 서버 실행

설치가 완료되면 다음 명령어로 로컬 개발 서버를 시작합니다.

```bash
# pnpm을 사용하는 경우
pnpm run dev

# npm을 사용하는 경우
npm run dev
```

### 3. 접속

터미널에 표시된 로컬 주소(기본값: `http://localhost:5173`)를 브라우저에 입력하여 프로토타입 화면을 확인합니다.

## 📦 사용 가능한 스크립트 (Available Scripts)

- `dev` (`npm run dev`): 로컬 개발 서버를 실행합니다. Hot Module Replacement(HMR)를 지원합니다.
- `build` (`npm run build`): 프로덕션 배포를 위한 최적화된 빌드를 수행합니다. 빌드 결과물은 `dist` 폴더에 생성됩니다.

## 📂 프로젝트 구조 (Project Structure)

- `/src`: 주요 소스 코드가 위치하는 디렉토리 (React 컴포넌트, 페이지 등)
- `/guidelines`: 프로젝트 개발 가이드라인 관련 문서
- `index.html`: 웹 애플리케이션의 메인 진입점
- `vite.config.ts`: Vite 빌드 도구 설정 파일
- `postcss.config.mjs`: PostCSS 설정 파일 (Tailwind CSS 등 연동)
- `default_shadcn_theme.css`: Shadcn UI 기본 테마 설정 파일
- `package.json`: 프로젝트 메타데이터, 스크립트 및 의존성 목록

---
*이 문서는 AmbieCARE 프로젝트의 UI/UX 사전 검증 및 프론트엔드 개발 연동을 위한 안내서로 작성되었습니다.*