import React, { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalStaff: 0,
    onLeave: 0,
    activeStaff: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);

  useEffect(() => {
    console.log('[DashboardPage] 대시보드 데이터 로딩');
    // 실제 구현에서는 API에서 데이터 가져오기
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // 임시 데이터 - 실제 구현에서는 API 호출
      setStats({
        totalStaff: 150,
        onLeave: 12,
        activeStaff: 138
      });

      setRecentActivities([
        { id: 1, action: '신규 직원 등록', user: '김관리', time: '2024-01-15 09:30' },
        { id: 2, action: '휴가 승인', user: '이직원', time: '2024-01-15 08:45' },
        { id: 3, action: '직원 정보 수정', user: '박관리', time: '2024-01-14 16:20' }
      ]);

      console.log('[DashboardPage] 대시보드 데이터 로드 완료');
    } catch (error) {
      console.error('[DashboardPage] 데이터 로드 실패:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h1>대시보드</h1>

      {/* 주요 통계 */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>총 직원 수</h3>
          <div className="stat-number">{stats.totalStaff}명</div>
        </div>

        <div className="stat-card">
          <h3>휴가자 수</h3>
          <div className="stat-number">{stats.onLeave}명</div>
        </div>

        <div className="stat-card">
          <h3>재직자 수</h3>
          <div className="stat-number">{stats.activeStaff}명</div>
        </div>
      </div>

      {/* 최근 활동 */}
      <div className="recent-activities">
        <h2>최근 활동</h2>
        <div className="activity-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-content">
                <span className="activity-action">{activity.action}</span>
                <span className="activity-user">{activity.user}</span>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
