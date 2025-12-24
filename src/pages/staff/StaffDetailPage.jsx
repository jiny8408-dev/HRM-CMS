import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const StaffDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [staffData, setStaffData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('[StaffDetailPage] 직원 상세 정보 로딩:', id);
    loadStaffDetail();
  }, [id]);

  const loadStaffDetail = async () => {
    try {
      // 임시 데이터 - 실제 구현에서는 API 호출
      const mockData = {
        id: parseInt(id),
        staff_id: 'EMP001',
        name: '김철수',
        department: '개발팀',
        position: '대리',
        status: '재직',
        email: 'kim@example.com',
        phone: '010-1234-5678',
        join_date: '2023-01-15',
        address: '서울시 강남구',
        birth_date: '1990-05-20',
        emergency_contact: '김부모 010-9876-5432'
      };

      setStaffData(mockData);
      setLoading(false);
      console.log('[StaffDetailPage] 직원 상세 정보 로드 완료');
    } catch (error) {
      console.error('[StaffDetailPage] 데이터 로드 실패:', error);
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말로 이 직원을 삭제하시겠습니까?')) return;

    console.log('[StaffDetailPage] 직원 삭제 실행:', id);
    try {
      // 실제 구현에서는 API 호출
      console.log('[StaffDetailPage] 직원 삭제 완료');
      navigate('/staff');
    } catch (error) {
      console.error('[StaffDetailPage] 삭제 실패:', error);
      alert('삭제에 실패했습니다.');
    }
  };

  if (loading) {
    return <div className="loading">로딩 중...</div>;
  }

  if (!staffData) {
    return <div className="error">직원 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="staff-detail-container">
      <div className="header">
        <h1>직원 상세 정보</h1>
        <div className="actions">
          <button
            className="edit-btn"
            onClick={() => navigate(`/staff/form/${id}`)}
          >
            수정
          </button>
          <button
            className="delete-btn"
            onClick={handleDelete}
          >
            삭제
          </button>
          <button
            className="back-btn"
            onClick={() => navigate('/staff')}
          >
            목록으로
          </button>
        </div>
      </div>

      <div className="detail-content">
        <div className="info-section">
          <h2>기본 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>사번</label>
              <span>{staffData.staff_id}</span>
            </div>
            <div className="info-item">
              <label>이름</label>
              <span>{staffData.name}</span>
            </div>
            <div className="info-item">
              <label>부서</label>
              <span>{staffData.department}</span>
            </div>
            <div className="info-item">
              <label>직급</label>
              <span>{staffData.position}</span>
            </div>
            <div className="info-item">
              <label>상태</label>
              <span className={`status ${staffData.status.toLowerCase()}`}>
                {staffData.status}
              </span>
            </div>
            <div className="info-item">
              <label>입사일</label>
              <span>{staffData.join_date}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>연락처 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>이메일</label>
              <span>{staffData.email}</span>
            </div>
            <div className="info-item">
              <label>전화번호</label>
              <span>{staffData.phone}</span>
            </div>
            <div className="info-item">
              <label>주소</label>
              <span>{staffData.address}</span>
            </div>
          </div>
        </div>

        <div className="info-section">
          <h2>개인 정보</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>생년월일</label>
              <span>{staffData.birth_date}</span>
            </div>
            <div className="info-item">
              <label>비상연락처</label>
              <span>{staffData.emergency_contact}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDetailPage;
