import React, { createContext, useContext, useState, useEffect } from 'react';
import hrmCrypto from '../utils/base44Crypto';

// 기획서 Staff 테이블 스키마 기반 Auth Context
// 사용자 정보: 사번, 이름, 부서, 직급, 상태 관리
const AuthContext = createContext();

// Auth Context Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  // 사용자 상태 관리 (기획서 Staff 테이블 스키마 기반)
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    console.log('[AuthContext] 앱 시작 시 인증 상태 확인');
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
          // 암호화된 사용자 정보 복호화 (Base44 + UTF-8 보정 적용)
          const decryptedUser = hrmCrypto.decode(savedUser);
          setUser(decryptedUser);
          console.log('[AuthContext] 저장된 사용자 정보 로드 완료:', decryptedUser.staff_id);
        } else {
          console.log('[AuthContext] 저장된 인증 정보 없음');
        }
      } catch (error) {
        console.error('[AuthContext] 사용자 정보 복호화 실패:', error);
        // 복호화 실패 시 로그아웃 처리
        logout();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // 로그인 함수 (기획서 Staff 테이블 필드 기반)
  const login = async (email, password) => {
    console.log('[AuthContext] 로그인 시도:', email);

    try {
      setLoading(true);

      // 실제 구현에서는 API 호출
      // 임시 로그인 로직 (기획서 기반 샘플 데이터)
      const mockUserData = {
        id: 1,
        staff_id: 'EMP001',
        name: '김철수',
        department: '개발팀',
        position: '대리',
        status: '재직',
        email: email,
        join_date: '2023-01-15',
        role: 'user' // Admin 또는 User (기획서 권한 분리)
      };

      // 간단한 패스워드 검증 (실제로는 서버 검증)
      if (password === 'password123') {
        // 사용자 정보 암호화하여 저장 (Base44 + UTF-8 보정)
        const encryptedUser = hrmCrypto.encode(mockUserData);

        localStorage.setItem('token', 'mock-jwt-token');
        localStorage.setItem('user', encryptedUser);

        setUser(mockUserData);
        console.log('[AuthContext] 로그인 성공:', mockUserData.staff_id);

        return { success: true };
      } else {
        throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
      }

    } catch (error) {
      console.error('[AuthContext] 로그인 실패:', error);
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  // 로그아웃 함수
  const logout = () => {
    console.log('[AuthContext] 로그아웃 실행');

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);

    console.log('[AuthContext] 로그아웃 완료');
  };

  // 사용자 정보 업데이트 함수 (Staff 테이블 필드 기반)
  const updateUser = async (updatedData) => {
    console.log('[AuthContext] 사용자 정보 업데이트:', updatedData);

    try {
      if (!user) {
        throw new Error('로그인이 필요합니다.');
      }

      // 업데이트된 사용자 정보 생성 (기획서 Staff 테이블 필드 유지)
      const updatedUser = {
        ...user,
        ...updatedData,
        // Staff 테이블 필수 필드 검증
        staff_id: updatedData.staff_id || user.staff_id,
        name: updatedData.name || user.name,
        department: updatedData.department || user.department,
        position: updatedData.position || user.position,
        status: updatedData.status || user.status
      };

      // 암호화하여 저장
      const encryptedUser = hrmCrypto.encode(updatedUser);
      localStorage.setItem('user', encryptedUser);

      setUser(updatedUser);
      console.log('[AuthContext] 사용자 정보 업데이트 완료');

      return { success: true };

    } catch (error) {
      console.error('[AuthContext] 사용자 정보 업데이트 실패:', error);
      return { success: false, error: error.message };
    }
  };

  // 권한 확인 함수 (기획서 Admin/User 권한 분리)
  const hasPermission = (requiredRole) => {
    if (!user) return false;

    // Admin은 모든 권한
    if (user.role === 'admin') return true;

    // User 권한 확인
    if (requiredRole === 'user' && user.role === 'user') return true;

    return false;
  };

  // Staff 테이블 기반 사용자 정보 검증
  const validateUserData = (userData) => {
    const requiredFields = ['staff_id', 'name', 'department', 'position', 'status'];
    const missingFields = requiredFields.filter(field => !userData[field]);

    if (missingFields.length > 0) {
      console.warn('[AuthContext] 필수 필드 누락:', missingFields);
      return { valid: false, missingFields };
    }

    // 상태 값 검증 (기획서 ENUM: 재직, 휴직, 퇴사)
    const validStatuses = ['재직', '휴직', '퇴사'];
    if (!validStatuses.includes(userData.status)) {
      console.warn('[AuthContext] 유효하지 않은 상태 값:', userData.status);
      return { valid: false, error: '유효하지 않은 상태 값입니다.' };
    }

    return { valid: true };
  };

  // Context 값
  const value = {
    // 사용자 상태
    user,
    loading,
    isAuthenticated: !!user,

    // 사용자 정보 (기획서 Staff 테이블 필드)
    staffId: user?.staff_id,
    name: user?.name,
    department: user?.department,
    position: user?.position,
    status: user?.status,
    role: user?.role,

    // 액션 함수들
    login,
    logout,
    updateUser,
    hasPermission,
    validateUserData
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth Context 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export default AuthContext;
