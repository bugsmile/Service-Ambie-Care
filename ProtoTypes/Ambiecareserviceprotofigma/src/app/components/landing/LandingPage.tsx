import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Activity, 
  EyeOff, 
  BellRing, 
  ChevronRight, 
  CheckCircle2, 
  Smartphone,
  LayoutDashboard,
  Users
} from 'lucide-react';

interface LandingPageProps {
  onStart: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 font-sans selection:bg-blue-100">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200">
              <Activity className="text-white w-6 h-6" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">ROOTED</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-blue-600 transition-colors">주요 기능</a>
            <a href="#workflow" className="hover:text-blue-600 transition-colors">작동 원리</a>
            <a href="#trust" className="hover:text-blue-600 transition-colors">신뢰 데이터</a>
            <button 
              onClick={onStart}
              className="px-6 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-all shadow-md active:scale-95"
            >
              로그인하기
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-24 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-semibold mb-6">
              <ShieldCheck size={16} />
              <span>국내 최초 AI 비접촉 앰비언트 케어</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] mb-8 text-slate-900">
              어르신의 자존심을 지키는<br />
              <span className="text-blue-600 italic">Invisible</span> 세이프티
            </h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-xl">
              어떤 착용도, 충전도, 카메라도 필요 없습니다.<br />
              UWB 레이더와 AI가 부모님의 일상을 배경처럼 지켜보고,<br />
              오직 응급 상황에만 당신을 연결합니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={onStart}
                className="group px-8 py-5 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2"
              >
                지금 무료 상담 시작하기
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center gap-4 px-6 py-4 bg-white border border-slate-200 rounded-2xl">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                      <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="user" />
                    </div>
                  ))}
                </div>
                <div className="text-sm font-medium">
                  <span className="text-blue-600">750,000+</span> 자녀들의 선택
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-square bg-gradient-to-tr from-blue-100 to-indigo-50 rounded-[40px] overflow-hidden shadow-2xl relative border border-white">
              {/* Dummy Image Representation */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-4/5 h-4/5 bg-white rounded-3xl shadow-inner border border-slate-100 p-8 flex flex-col">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="text-green-600" />
                      </div>
                      <div>
                        <div className="text-sm font-bold">어머니 상태</div>
                        <div className="text-xs text-slate-500">정상 활동 중</div>
                      </div>
                    </div>
                    <div className="px-3 py-1 bg-slate-100 rounded-full text-[10px] font-bold">LIVE</div>
                  </div>
                  <div className="flex-1 bg-slate-50 rounded-2xl border border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-sm italic">
                    실시간 UWB 레이더 파형 분석 시각화 영역
                  </div>
                  <div className="mt-6 flex gap-3">
                    <div className="flex-1 bg-blue-50 p-4 rounded-xl">
                      <div className="text-[10px] text-blue-600 font-bold mb-1 uppercase tracking-wider">수면 품질</div>
                      <div className="text-xl font-bold">75점</div>
                    </div>
                    <div className="flex-1 bg-slate-50 p-4 rounded-xl">
                      <div className="text-[10px] text-slate-500 font-bold mb-1 uppercase tracking-wider">화장실 이용</div>
                      <div className="text-xl font-bold">2회</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Floating Badges */}
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-50 max-w-[200px]">
              <div className="text-xs text-slate-400 font-bold mb-2">오늘의 응급 알람</div>
              <div className="text-2xl font-bold text-slate-900">0건</div>
              <div className="h-1 w-full bg-slate-100 mt-3 rounded-full overflow-hidden">
                <div className="h-full w-full bg-green-500" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Value Propositions */}
      <section id="features" className="py-24 bg-slate-900 text-white overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-20">
            <h2 className="text-4xl font-bold mb-4">왜 경쟁사가 아닌 <span className="text-blue-400 italic underline decoration-2 underline-offset-8">ROOTED</span>인가?</h2>
            <p className="text-slate-400 text-lg">기능 나열이 아닌, 보호자의 삶이 어떻게 바뀌는지에 집중했습니다.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <BellRing className="text-blue-400" />,
                title: "오탐률 0.3건/월 미만",
                desc: "이불 뒤척임과 실제 낙상을 완벽히 구분합니다. 잦은 허위 알람으로 인한 '알람 피로'를 제거하여 진짜 응급에만 집중하세요.",
                badge: "AI 알고리즘 해자"
              },
              {
                icon: <EyeOff className="text-blue-400" />,
                title: "카메라 없는 프라이버시",
                desc: "어르신들이 가장 싫어하는 CCTV 감시. ROOTED는 형체 없는 레이더 파형만을 분석하여 사생활을 완벽히 보호합니다.",
                badge: "심리적 거부감 0"
              },
              {
                icon: <Smartphone className="text-blue-400" />,
                title: "제로-프릭션(Zero-Friction)",
                desc: "충전도, 착용도 필요 없습니다. 벽에 부착하는 순간 부모님은 기기의 존재조차 잊으실 겁니다. 데이터는 앱으로 자동 전송됩니다.",
                badge: "100% 지속 사용"
              }
            ].map((f, i) => (
              <div key={i} className="group bg-slate-800/50 border border-slate-700 p-8 rounded-[32px] hover:bg-slate-800 transition-all hover:border-blue-500/50">
                <div className="w-14 h-14 bg-slate-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <div className="text-xs font-bold text-blue-400 mb-2 uppercase tracking-widest">{f.badge}</div>
                <h3 className="text-2xl font-bold mb-4">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed italic">
                  "{f.desc}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Workflow Diagram (Selective Element C) */}
      <section id="workflow" className="py-24 px-6 bg-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">넣으면 나옵니다: 복잡함은 생략하세요</h2>
            <p className="text-slate-600">내부의 복잡한 로직은 ROOTED가 처리합니다. 당신은 결과만 확인하세요.</p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white shadow-lg rounded-2xl flex items-center justify-center">
                <LayoutDashboard className="text-blue-600" />
              </div>
              <div className="text-sm font-bold text-slate-500">1. 레이더 센싱</div>
            </div>
            <div className="h-0.5 flex-1 bg-blue-200 relative hidden md:block">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold">AI 분석</div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-24 h-24 bg-blue-600 shadow-xl shadow-blue-200 rounded-[2rem] flex items-center justify-center">
                <Activity className="text-white w-10 h-10 animate-pulse" />
              </div>
              <div className="text-sm font-bold text-blue-600">2. ROOTED 엔진</div>
            </div>
            <div className="h-0.5 flex-1 bg-blue-200 relative hidden md:block">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold">패턴 요약</div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <div className="w-20 h-20 bg-white shadow-lg rounded-2xl flex items-center justify-center">
                <CheckCircle2 className="text-green-600" />
              </div>
              <div className="text-sm font-bold text-slate-500">3. 안심 리포트</div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Authority (Core Essential) */}
      <section id="trust" className="py-24 px-6 border-y border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="md:max-w-md">
              <h2 className="text-3xl font-bold mb-6 italic">"알람 피로를 없애주는 AI 필터링 기술만이 소중한 생명을 지킵니다."</h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=doctor" alt="expert" />
                </div>
                <div>
                  <div className="font-bold text-lg">장영희 님</div>
                  <div className="text-sm text-slate-500 italic">요양원 실제 피해 가족 / ROOTED 초기 자문</div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 w-full md:w-auto">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">99%</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">낙상 감지 정확도</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-blue-600 mb-2">&lt; 0.3</div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">월평균 오탐 건수</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto bg-blue-600 rounded-[48px] p-12 text-center text-white relative overflow-hidden shadow-2xl shadow-blue-200">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
          <h2 className="text-4xl font-bold mb-6 relative z-10">부모님의 오늘 밤,<br />ROOTED가 함께 깨어있겠습니다.</h2>
          <p className="text-blue-100 mb-10 text-lg relative z-10">월 30,000원으로 얻는 온전한 심리적 평안(Peace of Mind)</p>
          <button 
            onClick={onStart}
            className="relative z-10 px-12 py-5 bg-white text-blue-600 rounded-2xl font-bold text-xl hover:bg-slate-50 transition-all shadow-xl active:scale-95"
          >
            기존 포털로 이동하기
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-600 w-5 h-5" />
            <span className="font-bold text-slate-900 tracking-tight">ROOTED</span>
          </div>
          <div className="text-slate-400 text-sm">
            © 2026 EVER CARE. All rights reserved. 앰비언트 홈 안전 솔루션.
          </div>
          <div className="flex gap-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-900">이용약관</a>
            <a href="#" className="hover:text-slate-900">개인정보처리방침</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
