// Rooted — AI-based Ambient Care Platform
// Main application with role-based routing and authentication simulation
import { useState, useEffect } from 'react';
import { User, UserRole } from '../types/device';
import { NavigationLinks } from './components/shared/navigation-links';
import { LogoutButton } from './components/shared/logout-button';
import { DeviceStatusIndicator } from './components/shared/device-status-indicator';

import { LandingPage } from './components/landing/LandingPage';

type Route =
  | '/'
  | '/portal-select'
  | '/login'
  | '/guardian/dashboard'
  | '/guardian/reports'
  | '/guardian/devices'
  | '/admin/dashboard'
  | '/admin/events'
  | '/admin/devices'
  | '/404';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<Route>('/');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Set page title
  useEffect(() => {
    document.title = 'ROOTED — Ambient Home Safety';
  }, []);

  const navigate = (route: Route) => {
    setCurrentRoute(route);
  };

  const handleLogin = (role: UserRole) => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: '1',
        name: role === 'GUARDIAN' ? '김보호' : '이관리',
        email: role === 'GUARDIAN' ? 'guardian@example.com' : 'admin@example.com',
        role,
      };
      setUser(mockUser);
      setIsLoading(false);

      // Redirect based on role
      if (role === 'GUARDIAN') {
        navigate('/guardian/dashboard');
      } else {
        navigate('/admin/dashboard');
      }
    }, 800);
  };

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  // Auth guard - redirect if not authenticated
  useEffect(() => {
    const protectedRoutes: Route[] = [
      '/guardian/dashboard',
      '/guardian/reports',
      '/guardian/devices',
      '/admin/dashboard',
      '/admin/events',
      '/admin/devices',
    ];

    if (protectedRoutes.includes(currentRoute) && !user) {
      // Allow access to landing and portal select without login
      if (currentRoute !== '/' && currentRoute !== '/portal-select') {
        navigate('/login');
      }
    }

    // Role-based redirect
    if (user) {
      const guardianRoutes = ['/guardian/dashboard', '/guardian/reports', '/guardian/devices'];
      const adminRoutes = ['/admin/dashboard', '/admin/events', '/admin/devices'];

      if (user.role === 'GUARDIAN' && adminRoutes.includes(currentRoute)) {
        navigate('/guardian/dashboard');
      }

      if (user.role === 'FACILITY_ADMIN' && guardianRoutes.includes(currentRoute)) {
        navigate('/admin/dashboard');
      }
    }
  }, [currentRoute, user]);

  // Loading state
  if (isLoading) {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  // Landing Page
  if (currentRoute === '/') {
    return <LandingPage onStart={() => navigate('/portal-select')} />;
  }

  // Portal Selection Page (Original Landing Page)
  if (currentRoute === '/portal-select') {
    return (
      <div className="size-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-2xl w-full mx-auto px-6 text-center">
          <h1 className="text-6xl font-bold text-gray-900 mb-4 tracking-tight">ROOTED</h1>
          <p className="text-2xl text-blue-600 font-medium mb-6">
            포털 선택
          </p>
          <p className="text-gray-700 mb-12 max-w-xl mx-auto leading-relaxed">
            AI 기반 비접촉 앰비언트 케어 솔루션으로 소중한 가족의 일상 안전을 지킵니다.
            접속하실 포털 유형을 선택해주세요.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
            >
              보호자 포털 진입
            </button>
            <button
              onClick={() => navigate('/login')}
              className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl"
            >
              시설 관리자 포털 진입
            </button>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="mt-8 text-slate-500 hover:text-slate-700 text-sm font-medium transition-colors"
          >
            ← 렌딩 페이지로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // Login Page
  if (currentRoute === '/login') {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-auto px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">로그인</h2>
            <p className="text-gray-600 mb-8 text-center">역할을 선택해주세요</p>

            <div className="flex flex-col gap-4">
              <button
                onClick={() => handleLogin('GUARDIAN')}
                className="w-full px-6 py-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                보호자로 로그인
              </button>
              <button
                onClick={() => handleLogin('FACILITY_ADMIN')}
                className="w-full px-6 py-4 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors"
              >
                시설 관리자로 로그인
              </button>
              <button
                onClick={() => navigate('/')}
                className="w-full px-6 py-4 text-gray-600 hover:text-gray-900 transition-colors"
              >
                돌아가기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 404 Page
  if (currentRoute === '/404') {
    return (
      <div className="size-full flex items-center justify-center bg-gray-50">
        <div className="text-center px-6">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">페이지를 찾을 수 없습니다</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  // Guardian Portal Layout
  if (user?.role === 'GUARDIAN' && currentRoute.startsWith('/guardian')) {
    const guardianLinks = [
      { label: '홈 대시보드', path: '/guardian/dashboard' },
      { label: '일간 보고서', path: '/guardian/reports' },
      { label: '디바이스 설정', path: '/guardian/devices' },
    ];

    return (
      <div className="size-full flex bg-gray-50">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 onClick={handleLogout} className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">EVER CARE</h1>
            <div className="mt-4">
              <p className="text-sm text-gray-600">보호자</p>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex-1 p-4">
            <NavigationLinks
              links={guardianLinks}
              currentPath={currentRoute}
              onNavigate={(path) => navigate(path as Route)}
            />
          </div>

          <div className="p-4 border-t border-gray-200">
            <LogoutButton onLogout={handleLogout} />
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
          <h1 onClick={handleLogout} className="text-xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors">EVER CARE</h1>
          <p className="text-sm text-gray-600">{user.name}</p>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto md:pt-0 pt-20 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto p-6">
            {currentRoute === '/guardian/dashboard' && <GuardianDashboard />}
            {currentRoute === '/guardian/reports' && <GuardianReports />}
            {currentRoute === '/guardian/devices' && <GuardianDevices />}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <div className="flex justify-around">
            {guardianLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path as Route)}
                className={`flex-1 py-2 text-sm ${
                  currentRoute === link.path
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {link.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  // Admin Portal Layout
  if (user?.role === 'FACILITY_ADMIN' && currentRoute.startsWith('/admin')) {
    const adminLinks = [
      { label: '실시간 대시보드', path: '/admin/dashboard' },
      { label: '이벤트 로그', path: '/admin/events' },
      { label: '디바이스 관리', path: '/admin/devices' },
    ];

    return (
      <div className="size-full flex bg-gray-50">
        {/* Sidebar - Desktop */}
        <aside className="hidden md:flex md:w-64 bg-white border-r border-gray-200 flex-col">
          <div className="p-6 border-b border-gray-200">
            <h1 onClick={handleLogout} className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors">EVER CARE</h1>
            <div className="mt-4">
              <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded mb-2">
                시설 관리자
              </span>
              <p className="font-medium text-gray-900">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>

          <div className="flex-1 p-4">
            <NavigationLinks
              links={adminLinks}
              currentPath={currentRoute}
              onNavigate={(path) => navigate(path as Route)}
            />
          </div>

          <div className="p-4 border-t border-gray-200">
            <LogoutButton onLogout={handleLogout} />
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
          <h1 onClick={handleLogout} className="text-xl font-bold text-gray-900 cursor-pointer hover:text-indigo-600 transition-colors">EVER CARE</h1>
          <span className="inline-block px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-700 rounded">
            시설 관리자
          </span>
          <p className="text-sm text-gray-600 mt-1">{user.name}</p>
        </div>

        {/* Main Content */}
        <main className="flex-1 overflow-auto md:pt-0 pt-24 pb-20 md:pb-0">
          <div className="max-w-7xl mx-auto p-6">
            {currentRoute === '/admin/dashboard' && <AdminDashboard />}
            {currentRoute === '/admin/events' && <AdminEvents />}
            {currentRoute === '/admin/devices' && <AdminDevices />}
          </div>
        </main>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-2 z-10">
          <div className="flex justify-around">
            {adminLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path as Route)}
                className={`flex-1 py-2 text-sm ${
                  currentRoute === link.path
                    ? 'text-indigo-600 font-medium'
                    : 'text-gray-600'
                }`}
              >
                {link.label.split(' ')[0]}
              </button>
            ))}
          </div>
        </nav>
      </div>
    );
  }

  return null;
}

// Guardian Dashboard Page
function GuardianDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">홈 대시보드</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">연결된 디바이스</h3>
          <p className="text-3xl font-bold text-gray-900 mb-4">3</p>
          <div className="flex items-center gap-2">
            <DeviceStatusIndicator status="ACTIVE" size="sm" pulse />
            <span className="text-sm text-gray-600">모두 정상 작동 중</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">오늘의 알림</h3>
          <p className="text-3xl font-bold text-gray-900">12</p>
          <p className="text-sm text-green-600 mt-2">모두 확인됨</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">안전 점수</h3>
          <p className="text-3xl font-bold text-green-600">98</p>
          <p className="text-sm text-gray-600 mt-2">매우 안전</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 활동</h3>
        <div className="space-y-4">
          {[
            { time: '10:32', event: '거실 센서 정상 작동 확인', status: 'ACTIVE' as const },
            { time: '09:15', event: '침실 센서 점검 완료', status: 'MAINTENANCE' as const },
            { time: '08:45', event: '주방 센서 활성화', status: 'ACTIVE' as const },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500 font-mono">{item.time}</span>
                <span className="text-gray-900">{item.event}</span>
              </div>
              <DeviceStatusIndicator status={item.status} size="sm" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Guardian Reports Page
function GuardianReports() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">일간 보고서</h2>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">2026년 5월 2일 보고서</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">활동 요약</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 총 활동 시간: 14시간 32분</li>
              <li>• 평균 활동 강도: 보통</li>
              <li>• 수면 시간: 7시간 15분</li>
            </ul>
          </div>
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3">알림 내역</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 정상 알림: 12건</li>
              <li>• 주의 알림: 0건</li>
              <li>• 긴급 알림: 0건</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-800">
          📊 상세 분석 보고서는 프리미엄 플랜에서 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  );
}

// Guardian Devices Page
function GuardianDevices() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">디바이스 설정</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { name: '거실 센서', location: '1층 거실', status: 'ACTIVE' as const },
          { name: '침실 센서', location: '2층 안방', status: 'MAINTENANCE' as const },
          { name: '주방 센서', location: '1층 주방', status: 'ACTIVE' as const },
        ].map((device, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{device.name}</h3>
                <p className="text-sm text-gray-600">{device.location}</p>
              </div>
              <DeviceStatusIndicator status={device.status} size="md" pulse={device.status === 'ACTIVE'} />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">배터리</span>
                <span className="font-medium">87%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">신호 강도</span>
                <span className="font-medium">강함</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              설정 변경
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Admin Dashboard Page
function AdminDashboard() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">실시간 대시보드</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">전체 사용자</h3>
          <p className="text-3xl font-bold text-gray-900">247</p>
          <p className="text-sm text-green-600 mt-2">↑ 12% 지난주 대비</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">활성 디바이스</h3>
          <p className="text-3xl font-bold text-gray-900">682</p>
          <div className="flex items-center gap-2 mt-2">
            <DeviceStatusIndicator status="ACTIVE" size="sm" pulse />
            <span className="text-sm text-gray-600">정상 작동</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">오늘의 이벤트</h3>
          <p className="text-3xl font-bold text-gray-900">1,234</p>
          <p className="text-sm text-gray-600 mt-2">평균 수준</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm text-gray-600 mb-2">긴급 알림</h3>
          <p className="text-3xl font-bold text-red-600">3</p>
          <p className="text-sm text-gray-600 mt-2">즉시 확인 필요</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">시설별 현황</h3>
        <div className="space-y-4">
          {[
            { name: '해피 실버홈', users: 45, devices: 98, alerts: 0 },
            { name: '그린 케어센터', users: 62, devices: 134, alerts: 1 },
            { name: '선샤인 요양원', users: 38, devices: 89, alerts: 2 },
          ].map((facility, idx) => (
            <div key={idx} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-0">
              <div>
                <h4 className="font-medium text-gray-900">{facility.name}</h4>
                <p className="text-sm text-gray-600">
                  사용자 {facility.users}명 · 디바이스 {facility.devices}개
                </p>
              </div>
              <div className="flex items-center gap-4">
                {facility.alerts > 0 ? (
                  <span className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded-full">
                    알림 {facility.alerts}건
                  </span>
                ) : (
                  <DeviceStatusIndicator status="ACTIVE" size="md" showLabel />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Admin Events Page
function AdminEvents() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">이벤트 로그</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시간
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  시설
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  이벤트
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  심각도
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {[
                { time: '14:23:45', facility: '해피 실버홈', event: '디바이스 연결 복구', severity: 'info' },
                { time: '13:45:12', facility: '그린 케어센터', event: '비정상 패턴 감지', severity: 'warning' },
                { time: '12:30:00', facility: '선샤인 요양원', event: '긴급 알림 발생', severity: 'critical' },
                { time: '11:15:33', facility: '해피 실버홈', event: '정기 점검 완료', severity: 'info' },
              ].map((log, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                    {log.time}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {log.facility}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {log.event}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      log.severity === 'critical' ? 'bg-red-100 text-red-700' :
                      log.severity === 'warning' ? 'bg-yellow-100 text-yellow-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {log.severity === 'critical' ? '긴급' :
                       log.severity === 'warning' ? '주의' : '정보'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Admin Devices Page
function AdminDevices() {
  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-900 mb-6">디바이스 관리</h2>

      <div className="bg-white rounded-lg shadow mb-6 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">전체 디바이스 현황</h3>
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
            새 디바이스 등록
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center gap-4">
            <DeviceStatusIndicator status="ACTIVE" size="lg" pulse />
            <div>
              <p className="text-2xl font-bold text-gray-900">645</p>
              <p className="text-sm text-gray-600">활성</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DeviceStatusIndicator status="INACTIVE" size="lg" />
            <div>
              <p className="text-2xl font-bold text-gray-900">23</p>
              <p className="text-sm text-gray-600">오프라인</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <DeviceStatusIndicator status="MAINTENANCE" size="lg" />
            <div>
              <p className="text-2xl font-bold text-gray-900">14</p>
              <p className="text-sm text-gray-600">점검 중</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div key={idx} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">디바이스 #{1000 + idx}</h3>
                <p className="text-sm text-gray-600">해피 실버홈</p>
              </div>
              <DeviceStatusIndicator
                status={idx % 3 === 0 ? 'ACTIVE' : idx % 3 === 1 ? 'MAINTENANCE' : 'INACTIVE'}
                size="md"
                pulse={idx % 3 === 0}
              />
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">펌웨어</span>
                <span className="font-medium">v2.1.{idx}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">마지막 동기화</span>
                <span className="font-medium">{idx + 1}분 전</span>
              </div>
            </div>

            <button className="w-full mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm">
              상세 정보
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
