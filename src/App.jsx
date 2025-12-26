import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import StaffListPage from "./pages/staff/StaffListPage";
import StaffDetailPage from "./pages/staff/StaffDetailPage";
import StaffFormPage from "./pages/staff/StaffFormPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import "./App.css";

// 404 Not Found 페이지 (기획서 구조 참고)
const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <a href="/dashboard" className="back-link">대시보드로 돌아가기</a>
    </div>
  );
};

// 프로필 페이지 (추가 예정)
const ProfilePage = () => {
  return (
    <div className="profile-container">
      <h1>프로필 관리</h1>
      <p>프로필 관리 기능이 곧 추가될 예정입니다.</p>
    </div>
  );
};

// 기본 인증 가드 (기획서 구조 기반)
const AuthGuard = ({ children, requiredRole = null }) => {
  const { isAuthenticated, loading, hasPermission, role } = useAuth();
  const location = useLocation();

  console.log("[AuthGuard] 라우트 접근 확인:", location.pathname);

  // 로딩 중
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>인증 확인 중...</p>
      </div>
    );
  }

  // 인증되지 않은 경우 로그인 페이지로 리다이렉트
  if (!isAuthenticated) {
    console.log("[AuthGuard] 인증되지 않음, 로그인 페이지로 리다이렉트");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 권한 체크 (필요한 경우)
  if (requiredRole && !hasPermission(requiredRole)) {
    console.log("[AuthGuard] 권한 부족:", requiredRole);
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

// 관리자 전용 가드 (확장성 고려)
const AdminGuard = ({ children }) => {
  return <AuthGuard requiredRole="admin">{children}</AuthGuard>;
};

// 사용자 전용 가드
const UserGuard = ({ children }) => {
  return <AuthGuard requiredRole="user">{children}</AuthGuard>;
};

// 메인 레이아웃 컴포넌트 (기획서 UI 구조 기반)
const MainLayout = ({ children }) => {
  const { logout, name, department, position, status, role } = useAuth();
  const location = useLocation();

  const handleLogout = () => {
    console.log("[MainLayout] 로그아웃 실행");
    logout();
  };

  // 현재 경로에 따른 네비게이션 활성화
  const getNavClass = (path) => {
    return location.pathname.startsWith(path) ? 'nav-link active' : 'nav-link';
  };

  return (
    <div className="app-layout">
      {/* 헤더 (기획서 구조 기반) */}
      <header className="app-header">
        <div className="header-content">
          {/* 사용자 정보 */}
          <div className="user-info">
            <span className="user-name">{name}</span>
            <span className="user-details">
              {department} {position} ({status})
            </span>
            {role === 'admin' && <span className="admin-badge">관리자</span>}
          </div>

          {/* 앱 타이틀 */}
          <h1 className="app-title">인사팀 CMS</h1>

          {/* 메인 네비게이션 (기획서 구조 기반) */}
          <nav className="main-nav">
            <a href="/dashboard" className={getNavClass('/dashboard')}>
              대시보드
            </a>
            <a href="/staff" className={getNavClass('/staff')}>
              직원 관리
            </a>
            <a href="/attendance" className={getNavClass('/attendance')}>
              근태 관리
            </a>
            <a href="/profile" className={getNavClass('/profile')}>
              프로필
            </a>
          </nav>

          {/* 로그아웃 버튼 */}
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="app-main">
        {children}
      </main>
    </div>
  );
};

// 라우팅 설정 컴포넌트 (기획서 6페이지 구조 기반)
const AppRoutes = () => {
  console.log("[AppRoutes] HRM CMS 라우팅 초기화");

  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />

      {/* 보호된 라우트들 - 메인 레이아웃으로 감싸기 */}
      <Route path="/" element={
        <AuthGuard>
          <MainLayout>
            <Routes>
              {/* 기본 리다이렉트 */}
              <Route index element={<Navigate to="/dashboard" replace />} />

              {/* 대시보드 */}
              <Route path="dashboard" element={<DashboardPage />} />

              {/* 직원 관리 (사용자 권한 필요) */}
              <Route path="staff" element={
                <UserGuard>
                  <Routes>
                    <Route index element={<StaffListPage />} />
                    <Route path=":id" element={<StaffDetailPage />} />
                    <Route path="form" element={<StaffFormPage />} />
                    <Route path="form/:id" element={<StaffFormPage />} />
                  </Routes>
                </UserGuard>
              } />

              {/* 근태 관리 (사용자 권한 필요) */}
              <Route path="attendance" element={
                <UserGuard>
                  <AttendancePage />
                </UserGuard>
              } />

              {/* 프로필 관리 (사용자 권한 필요) */}
              <Route path="profile" element={
                <UserGuard>
                  <ProfilePage />
                </UserGuard>
              } />

              {/* 404 페이지 */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </MainLayout>
        </AuthGuard>
      } />
    </Routes>
  );
};

// 메인 App 컴포넌트
const AppContent = () => {
  console.log("[App] HRM CMS 애플리케이션 시작");

  return (
    <Router>
      <div className="App">
        <AppRoutes />
      </div>
    </Router>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
