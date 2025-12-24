import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginPage from "./pages/auth/LoginPage";
import DashboardPage from "./pages/dashboard/DashboardPage";
import StaffListPage from "./pages/staff/StaffListPage";
import StaffDetailPage from "./pages/staff/StaffDetailPage";
import StaffFormPage from "./pages/staff/StaffFormPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import "./App.css";

// 보호된 라우트 컴포넌트 (기획서 권한 제어 + AuthContext 적용)
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  console.log("[App] 보호된 라우트 접근 확인");

  // 로딩 중일 때는 아무것도 표시하지 않음
  if (loading) {
    return <div className="loading">인증 확인 중...</div>;
  }

  if (!isAuthenticated) {
    console.log("[App] 인증되지 않음, 로그인 페이지로 리다이렉트");
    return <Navigate to="/login" replace />;
  }

  return children;
};

// 레이아웃 컴포넌트 (기획서 UI 구조 + AuthContext 적용)
const Layout = ({ children }) => {
  const { logout, name, department, position, status } = useAuth();

  const handleLogout = () => {
    console.log("[App] 로그아웃 실행");
    logout();
  };

  return (
    <div className="app-layout">
      {/* 헤더 */}
      <header className="app-header">
        <div className="header-content">
          <div className="user-info">
            <span className="user-name">{name}</span>
            <span className="user-details">
              {department} {position} ({status})
            </span>
          </div>
          <h1 className="app-title">인사팀 CMS</h1>
          <nav className="main-nav">
            <a href="/dashboard" className="nav-link">
              대시보드
            </a>
            <a href="/staff" className="nav-link">
              직원 관리
            </a>
            <a href="/attendance" className="nav-link">
              근태 관리
            </a>
          </nav>
          <button className="logout-btn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="app-main">{children}</main>
    </div>
  );
};

// AppContent 컴포넌트 (AuthContext 내부에서 실행)
const AppContent = () => {
  console.log("[App] HRM CMS 애플리케이션 시작");

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* 로그인 페이지 (공개 라우트) */}
          <Route path="/login" element={<LoginPage />} />

          {/* 보호된 라우트들 */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout>
                  <Routes>
                    {/* 대시보드 (기본 리다이렉트) */}
                    <Route
                      path="/"
                      element={<Navigate to="/dashboard" replace />}
                    />
                    <Route path="/dashboard" element={<DashboardPage />} />

                    {/* 직원 관리 */}
                    <Route path="/staff" element={<StaffListPage />} />
                    <Route path="/staff/:id" element={<StaffDetailPage />} />
                    <Route path="/staff/form" element={<StaffFormPage />} />
                    <Route path="/staff/form/:id" element={<StaffFormPage />} />

                    {/* 근태 관리 */}
                    <Route path="/attendance" element={<AttendancePage />} />
                  </Routes>
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
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
