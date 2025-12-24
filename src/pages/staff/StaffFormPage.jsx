import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Base44Crypto } from '../../utils/base44Crypto';

const StaffFormPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState({
    staff_id: '',
    name: '',
    department: '',
    position: '',
    status: '재직',
    email: '',
    phone: '',
    join_date: '',
    address: '',
    birth_date: '',
    emergency_contact: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isEditing) {
      console.log('[StaffFormPage] 직원 수정 폼 로딩:', id);
      loadStaffData();
    }
  }, [id, isEditing]);

  const loadStaffData = async () => {
    try {
      // 임시 데이터 - 실제 구현에서는 API 호출
      const mockData = {
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

      setFormData(mockData);
      console.log('[StaffFormPage] 직원 데이터 로드 완료');
    } catch (error) {
      console.error('[StaffFormPage] 데이터 로드 실패:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // 에러 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.staff_id.trim()) newErrors.staff_id = '사번을 입력해주세요';
    if (!formData.name.trim()) newErrors.name = '이름을 입력해주세요';
    if (!formData.department) newErrors.department = '부서를 선택해주세요';
    if (!formData.position) newErrors.position = '직급을 선택해주세요';
    if (!formData.email.trim()) newErrors.email = '이메일을 입력해주세요';
    if (!formData.join_date) newErrors.join_date = '입사일을 선택해주세요';

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      console.log('[StaffFormPage] 폼 검증 실패');
      return;
    }

    setLoading(true);
    console.log('[StaffFormPage] 직원 정보 저장 시도:', isEditing ? '수정' : '등록');

    try {
      // Base44 암호화 적용 (기획서 요구사항)
      const encryptedData = Base44Crypto.encode(formData);

      // 실제 구현에서는 API 호출
      console.log('[StaffFormPage] Base44 암호화 적용 완료');
      console.log('[StaffFormPage] 서버에 전송할 데이터:', encryptedData);

      // 성공 시 목록 페이지로 이동
      navigate('/staff');
      console.log('[StaffFormPage] 직원 정보 저장 완료');
    } catch (error) {
      console.error('[StaffFormPage] 저장 실패:', error);
      alert('저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="staff-form-container">
      <div className="header">
        <h1>{isEditing ? '직원 정보 수정' : '직원 등록'}</h1>
        <button
          className="back-btn"
          onClick={() => navigate('/staff')}
        >
          목록으로
        </button>
      </div>

      <form onSubmit={handleSubmit} className="staff-form">
        <div className="form-section">
          <h2>기본 정보</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="staff_id">사번 *</label>
              <input
                type="text"
                id="staff_id"
                name="staff_id"
                value={formData.staff_id}
                onChange={handleInputChange}
                disabled={isEditing} // 수정 시 사번 변경 불가
              />
              {errors.staff_id && <span className="error">{errors.staff_id}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="name">이름 *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
              />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="department">부서 *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
              >
                <option value="">부서 선택</option>
                <option value="개발팀">개발팀</option>
                <option value="디자인팀">디자인팀</option>
                <option value="인사팀">인사팀</option>
                <option value="영업팀">영업팀</option>
              </select>
              {errors.department && <span className="error">{errors.department}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="position">직급 *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleInputChange}
              >
                <option value="">직급 선택</option>
                <option value="사원">사원</option>
                <option value="대리">대리</option>
                <option value="과장">과장</option>
                <option value="차장">차장</option>
                <option value="부장">부장</option>
              </select>
              {errors.position && <span className="error">{errors.position}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="status">상태</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleInputChange}
              >
                <option value="재직">재직</option>
                <option value="휴직">휴직</option>
                <option value="퇴사">퇴사</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="join_date">입사일 *</label>
              <input
                type="date"
                id="join_date"
                name="join_date"
                value={formData.join_date}
                onChange={handleInputChange}
              />
              {errors.join_date && <span className="error">{errors.join_date}</span>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>연락처 정보</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="email">이메일 *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">전화번호</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group full-width">
              <label htmlFor="address">주소</label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h2>개인 정보</h2>
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="birth_date">생년월일</label>
              <input
                type="date"
                id="birth_date"
                name="birth_date"
                value={formData.birth_date}
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="emergency_contact">비상연락처</label>
              <input
                type="text"
                id="emergency_contact"
                name="emergency_contact"
                value={formData.emergency_contact}
                onChange={handleInputChange}
                placeholder="예: 김부모 010-9876-5432"
              />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => navigate('/staff')}
          >
            취소
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? '저장 중...' : (isEditing ? '수정' : '등록')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StaffFormPage;
