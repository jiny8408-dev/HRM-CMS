import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StaffListPage = () => {
  const navigate = useNavigate();
  const [staffList, setStaffList] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    status: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('[StaffListPage] 직원 목록 데이터 로딩');
    loadStaffList();
  }, []);

  useEffect(() => {
    filterStaffList();
  }, [staffList, searchTerm, filters]);

  const loadStaffList = async () => {
    try {
      // 임시 데이터 - 실제 구현에서는 API 호출
      const mockData = [
        { id: 1, staff_id: 'EMP001', name: '김철수', department: '개발팀', position: '대리', status: '재직', email: 'kim@example.com', join_date: '2023-01-15' },
        { id: 2, staff_id: 'EMP002', name: '이영희', department: '디자인팀', position: '과장', status: '재직', email: 'lee@example.com', join_date: '2022-06-01' },
        { id: 3, staff_id: 'EMP003', name: '박민수', department: '인사팀', position: '사원', status: '휴직', email: 'park@example.com', join_date: '2023-03-20' }
      ];
      setStaffList(mockData);
      console.log('[StaffListPage] 직원 목록 로드 완료:', mockData.length, '명');
    } catch (error) {
      console.error('[StaffListPage] 데이터 로드 실패:', error);
    }
  };

  const filterStaffList = () => {
    let filtered = staffList.filter(staff => {
      const matchesSearch = staff.name.includes(searchTerm) || staff.staff_id.includes(searchTerm);
      const matchesDepartment = !filters.department || staff.department === filters.department;
      const matchesStatus = !filters.status || staff.status === filters.status;
      return matchesSearch && matchesDepartment && matchesStatus;
    });
    setFilteredStaff(filtered);
    setCurrentPage(1);
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedStaff(currentPageData.map(staff => staff.id));
    } else {
      setSelectedStaff([]);
    }
  };

  const handleSelectStaff = (staffId, checked) => {
    if (checked) {
      setSelectedStaff(prev => [...prev, staffId]);
    } else {
      setSelectedStaff(prev => prev.filter(id => id !== staffId));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedStaff.length === 0) return;

    console.log('[StaffListPage] 일괄 삭제 실행:', selectedStaff);
    try {
      // 실제 구현에서는 API 호출
      setStaffList(prev => prev.filter(staff => !selectedStaff.includes(staff.id)));
      setSelectedStaff([]);
      console.log('[StaffListPage] 일괄 삭제 완료');
    } catch (error) {
      console.error('[StaffListPage] 일괄 삭제 실패:', error);
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredStaff.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="staff-list-container">
      <div className="header">
        <h1>직원 관리</h1>
        <button
          className="add-btn"
          onClick={() => navigate('/staff/form')}
        >
          직원 등록
        </button>
      </div>

      {/* 검색 및 필터 */}
      <div className="filters">
        <div className="search-group">
          <input
            type="text"
            placeholder="이름 또는 사번으로 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.department}
            onChange={(e) => setFilters(prev => ({ ...prev, department: e.target.value }))}
          >
            <option value="">전체 부서</option>
            <option value="개발팀">개발팀</option>
            <option value="디자인팀">디자인팀</option>
            <option value="인사팀">인사팀</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">전체 상태</option>
            <option value="재직">재직</option>
            <option value="휴직">휴직</option>
            <option value="퇴사">퇴사</option>
          </select>
        </div>
      </div>

      {/* 일괄 삭제 버튼 */}
      {selectedStaff.length > 0 && (
        <div className="bulk-actions">
          <span>{selectedStaff.length}명 선택됨</span>
          <button className="delete-btn" onClick={handleBulkDelete}>
            일괄 삭제
          </button>
        </div>
      )}

      {/* 직원 목록 테이블 */}
      <div className="table-container">
        <table className="staff-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedStaff.length === currentPageData.length && currentPageData.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th>사번</th>
              <th>이름</th>
              <th>부서</th>
              <th>직급</th>
              <th>상태</th>
              <th>입사일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map(staff => (
              <tr key={staff.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedStaff.includes(staff.id)}
                    onChange={(e) => handleSelectStaff(staff.id, e.target.checked)}
                  />
                </td>
                <td>{staff.staff_id}</td>
                <td
                  className="clickable"
                  onClick={() => navigate(`/staff/${staff.id}`)}
                >
                  {staff.name}
                </td>
                <td>{staff.department}</td>
                <td>{staff.position}</td>
                <td>
                  <span className={`status ${staff.status.toLowerCase()}`}>
                    {staff.status}
                  </span>
                </td>
                <td>{staff.join_date}</td>
                <td>
                  <button
                    className="edit-btn"
                    onClick={() => navigate(`/staff/form/${staff.id}`)}
                  >
                    수정
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              className={currentPage === page ? 'active' : ''}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            다음
          </button>
        </div>
      )}
    </div>
  );
};

export default StaffListPage;
