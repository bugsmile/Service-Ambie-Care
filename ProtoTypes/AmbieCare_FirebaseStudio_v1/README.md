# AmbieCare Firebase Studio v1

> [!NOTE]
> 본 프로젝트는 [fs_prompt_opus.md](../../Ambi-Care-app/fs_prompt_opus.md)의 Firebase Studio 프롬프트를 바탕으로 작성되었습니다.

AmbieCare 프로젝트의 프론트엔드 및 AI 연동 기능을 개발하기 위한 Next.js 기반의 스타터 프로젝트입니다. Firebase와 Google Genkit이 통합되어 있습니다.

## 🛠 기술 스택 (Tech Stack)

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **UI & Styling**: [Tailwind CSS](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) (Radix UI)
- **Database / Backend**: [Firebase](https://firebase.google.com/)
- **AI Integration**: [Google Genkit](https://firebase.google.com/docs/genkit)
- **Language**: TypeScript

## 🚀 시작하기 (Getting Started)

### 1. 사전 요구사항 (Prerequisites)
- Node.js (v20 이상 권장)
- npm (Node.js 설치 시 기본 포함)

### 2. 패키지 설치 (Installation)
프로젝트 루트 디렉토리에서 다음 명령어를 실행하여 필요한 패키지를 설치합니다.
```bash
npm install
```

### 3. 환경 변수 설정 (Environment Variables)
Firebase 및 Genkit 사용을 위해 `.env.local` 파일을 프로젝트 루트에 생성하고 필요한 환경 변수를 설정해야 합니다. (필요한 경우 개발팀의 가이드를 참조하세요.)
```env
# 예시 (실제 필요한 키는 다를 수 있습니다)
# NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
# GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

### 4. 개발 서버 실행 (Running the Development Server)
Next.js 개발 서버를 실행합니다. (기본적으로 **9002번 포트**에서 실행되도록 설정되어 있습니다.)
```bash
npm run dev
```
브라우저에서 [http://localhost:9002](http://localhost:9002) 에 접속하여 애플리케이션을 확인합니다.
- 메인 페이지의 진입점은 `src/app/page.tsx` 입니다.

### 5. Genkit 개발 환경 실행 (Running Genkit)
AI 기능 개발 및 테스트를 위해 Genkit 서버를 실행할 수 있습니다.
```bash
npm run genkit:dev
# 또는 변경 사항을 실시간으로 반영하려면
npm run genkit:watch
```

## 📦 빌드 및 배포 (Build and Production)

프로덕션 환경을 위한 최적화된 빌드를 생성하려면 다음 명령어를 사용합니다.
```bash
npm run build
```

빌드 후 프로덕션 서버를 시작하려면 다음 명령어를 실행합니다.
```bash
npm start
```

## 📁 주요 디렉토리 구조 (Project Structure)
- `src/app/`: Next.js App Router 기반의 페이지 및 라우팅 로직
- `src/components/`: 재사용 가능한 UI 컴포넌트 (shadcn/ui 포함)
- `src/ai/`: Google Genkit 관련 AI 로직 및 설정 (예: `src/ai/dev.ts`)
- `docs/`: 프로젝트 관련 문서
