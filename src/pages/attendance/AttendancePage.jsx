import React, { useState, useEffect } from 'react';

const AttendancePage = () => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [filteredAttendance, setFilteredAttendance] = useState([]);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    staff_name: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('[AttendancePage] 근태 데이터 로딩');
    loadAttendanceList();
  }, []);

  useEffect(() => {
    filterAttendanceList();
  }, [attendanceList, filters]);

  const loadAttendanceList = async () => {
    try {
      // 임시 데이터 - 실제 구현에서는 API 호출
      const mockData = [
        {
          att_id: 1,
          staff_id: 'EMP001',
          staff_name: '김철수',
          type: '휴가',
          start_date: '2024-01-20',
          end_date: '2024-01-22',
          reason: '연차 휴가',
          status: '승인',
          request_date: '2024-01-15'
        },
        {
          att_id: 2,
          staff_id: 'EMP002',
          staff_name: '이영희',
          type: '출근',
          start_date: '2024-01-15 09:00',
          end_date: '2024-01-15 18:00',
          reason: '',
          status: '완료',
          request_date: '2024-01-15'
        },
        {
          att_id: 3,
          staff_id: 'EMP003',
          staff_name: '박민수',
          type: '휴가',
          start_date: '2024-01-25',
          end_date: '2024-01-30',
          reason: '병가',
          status: '대기',
          request_date: '2024-01-14'
        }
      ];
      setAttendanceList(mockData);
      console.log('[AttendancePage] 근태 데이터 로드 완료:', mockData.length, '건');
    } catch (error) {
      console.error('[AttendancePage] 데이터 로드 실패:', error);
    }
  };

  const filterAttendanceList = () => {
    let filtered = attendanceList.filter(attendance => {
      const matchesType = !filters.type || attendance.type === filters.type;
      const matchesStatus = !filters.status || attendance.status === filters.status;
      const matchesName = !filters.staff_name || attendance.staff_name.includes(filters.staff_name);
      return matchesType && matchesStatus && matchesName;
    });
    setFilteredAttendance(filtered);
    setCurrentPage(1);
  };

  const handleStatusChange = async (attId, newStatus) => {
    console.log('[AttendancePage] 근태 상태 변경:', attId, '->', newStatus);
    try {
      // 실제 구현에서는 API 호출
      setAttendanceList(prev =>
        prev.map(attendance =>
          attendance.att_id === attId
            ? { ...attendance, status: newStatus }
            : attendance
        )
      );
      console.log('[AttendancePage] 근태 상태 변경 완료');
    } catch (error) {
      console.error('[AttendancePage] 상태 변경 실패:', error);
      alert('상태 변경에 실패했습니다.');
    }
  };

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredAttendance.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentPageData = filteredAttendance.slice(startIndex, startIndex + itemsPerPage);

  const getStatusColor = (status) => {
    switch (status) {
      case '승인': return 'approved';
      case '대기': return 'pending';
      case '반려': return 'rejected';
      case '완료': return 'completed';
      default: return '';
    }
  };

  return (
    <div className="attendance-container">
      <div className="header">
        <h1>근태 관리</h1>
      </div>

      {/* 필터 */}
      <div className="filters">
        <div className="filter-group">
          <select
            value={filters.type}
            onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
          >
            <option value="">전체 유형</option>
            <option value="출근">출근</option>
            <option value="퇴근">퇴근</option>
            <option value="휴가">휴가</option>
          </select>

          <select
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">전체 상태</option>
            <option value="대기">대기</option>
            <option value="승인">승인</option>
            <option value="반려">반려</option>
            <option value="완료">완료</option>
          </select>

          <input
            type="text"
            placeholder="직원 이름으로 검색"
            value={filters.staff_name}
            onChange={(e) => setFilters(prev => ({ ...prev, staff_name: e.target.value }))}
          />
        </div>
      </div>

      {/* 근태 목록 테이블 */}
      <div className="table-container">
        <table className="attendance-table">
          <thead>
            <tr>
              <th>신청인</th>
              <th>유형</th>
              <th>기간</th>
              <th>사유</th>
              <th>상태</th>
              <th>신청일</th>
              <th>액션</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map(attendance => (
              <tr key={attendance.att_id}>
                <td>{attendance.staff_name} ({attendance.staff_id})</td>
                <td>{attendance.type}</td>
                <td>
                  {attendance.start_date}
                  {attendance.end_date && attendance.end_date !== attendance.start_date && ` ~ ${attendance.end_date}`}
                </td>
                <td>{attendance.reason || '-'}</td>
                <td>
                  <span className={`status ${getStatusColor(attendance.status)}`}>
                    {attendance.status}
                  </span>
                </td>
                <td>{attendance.request_date}</td>
                <td>
                  {attendance.status === '대기' && (
                    <div className="action-buttons">
                      <button
                        className="approve-btn"
                        onClick={() => handleStatusChange(attendance.att_id, '승인')}
                      >
                        승인
                      </button>
                      <button
                        className="reject-btn"
                        onClick={() => handleStatusChange(attendance.att_id, '반려')}
                      >
                        반려
                      </button>
                    </div>
                  )}
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

export default AttendancePage;
