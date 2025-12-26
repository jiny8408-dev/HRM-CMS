import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
  Link,
  Outlet,
} from "react-router-dom";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserButton,
  useUser,
  useAuth,
} from "@clerk/clerk-react";
import DashboardPage from "./pages/dashboard/DashboardPage";
import StaffListPage from "./pages/staff/StaffListPage";
import StaffDetailPage from "./pages/staff/StaffDetailPage";
import StaffFormPage from "./pages/staff/StaffFormPage";
import AttendancePage from "./pages/attendance/AttendancePage";
import "./App.css";

// Clerk 퍼블리시 키 (환경 변수에서 가져오거나 직접 설정)
const PUBLISHABLE_KEY =
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ||
  "pk_test_ZHJpdmluZy1nYXItMzYuY2xlcmsuYWNjb3VudHMuZGV2JA";

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Clerk Publishable Key");
}

// 404 Not Found 페이지 (기획서 구조 참고)
const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <h1>404 - 페이지를 찾을 수 없습니다</h1>
      <p>요청하신 페이지가 존재하지 않습니다.</p>
      <Link to="/dashboard" className="back-link">
        대시보드로 돌아가기
      </Link>
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

// Clerk 기반 인증 가드
const AuthGuard = ({ children }) => {
  const { isLoaded, isSignedIn } = useAuth();
  const location = useLocation();

  console.log("[AuthGuard] 라우트 접근 확인:", location.pathname);

  // 로딩 중
  if (!isLoaded) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>인증 확인 중...</p>
      </div>
    );
  }

  // 인증되지 않은 경우 Clerk SignIn으로 리다이렉트
  if (!isSignedIn) {
    console.log("[AuthGuard] 인증되지 않음, 로그인 페이지로 리다이렉트");
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  return children;
};

// 관리자 전용 가드 (향후 확장)
const AdminGuard = ({ children }) => {
  // 현재는 모든 인증된 사용자를 허용
  return <AuthGuard>{children}</AuthGuard>;
};

// 사용자 전용 가드
const UserGuard = ({ children }) => {
  return <AuthGuard>{children}</AuthGuard>;
};

// 메인 레이아웃 컴포넌트 (기획서 UI 구조 기반)
const MainLayout = () => {
  const { user } = useUser();
  const location = useLocation();

  // 현재 경로에 따른 네비게이션 활성화
  const getNavClass = (path) => {
    return location.pathname.startsWith(path) ? "nav-link active" : "nav-link";
  };

  // Clerk 사용자 정보에서 이름 추출
  const displayName = user?.firstName || user?.username || "사용자";

  return (
    <div className="app-layout">
      {/* 헤더 (Clerk 기반) */}
      <header className="app-header">
        <div className="header-content">
          {/* 사용자 정보 */}
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-details">인사팀 직원 (재직)</span>
          </div>

          {/* 앱 타이틀 */}
          <h1 className="app-title">인사팀 CMS</h1>

          {/* 메인 네비게이션 */}
          <nav className="main-nav">
            <Link to="/dashboard" className={getNavClass("/dashboard")}>
              대시보드
            </Link>
            <Link to="/staff" className={getNavClass("/staff")}>
              직원 관리
            </Link>
            <Link to="/attendance" className={getNavClass("/attendance")}>
              근태 관리
            </Link>
            <Link to="/profile" className={getNavClass("/profile")}>
              프로필
            </Link>
          </nav>

          {/* Clerk User Button (프로필 및 로그아웃) */}
          <UserButton afterSignOutUrl="/" />
        </div>
      </header>

      {/* 메인 컨텐츠 영역 */}
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  );
};

// 라우팅 설정 컴포넌트 (기획서 6페이지 구조 기반)
const AppRoutes = () => {
  console.log("[AppRoutes] HRM CMS 라우팅 초기화");

  return (
    <Routes>
      {/* 공개 라우트 - 로그인되지 않은 사용자만 접근 가능 */}
      <Route
        path="/sign-in/*"
        element={
          <div className="auth-container">
            <SignIn routing="path" path="/sign-in" />
          </div>
        }
      />

      {/* 보호된 라우트들 - 로그인된 사용자만 접근 가능 */}
      <Route
        path="/"
        element={
          <SignedIn>
            <MainLayout />
          </SignedIn>
        }
      >
        {/* 기본 리다이렉트 */}
        <Route index element={<Navigate to="/dashboard" replace />} />

        {/* 대시보드 */}
        <Route path="dashboard" element={<DashboardPage />} />

        {/* 직원 관리 */}
        <Route
          path="staff"
          element={
            <Routes>
              <Route index element={<StaffListPage />} />
              <Route path=":id" element={<StaffDetailPage />} />
              <Route path="form" element={<StaffFormPage />} />
              <Route path="form/:id" element={<StaffFormPage />} />
            </Routes>
          }
        />

        {/* 근태 관리 */}
        <Route path="attendance" element={<AttendancePage />} />

        {/* 프로필 관리 */}
        <Route path="profile" element={<ProfilePage />} />

        {/* 404 페이지 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>

      {/* 로그인되지 않은 사용자를 위한 리다이렉트 */}
      <Route
        path="*"
        element={
          <SignedOut>
            <Navigate to="/sign-in" replace />
          </SignedOut>
        }
      />
    </Routes>
  );
};

// 메인 App 컴포넌트
function App() {
  console.log("[App] HRM CMS 애플리케이션 시작 (Clerk 기반)");

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <Router>
        <div className="App">
          <AppRoutes />
        </div>
      </Router>
    </ClerkProvider>
  );
}

export default App;
