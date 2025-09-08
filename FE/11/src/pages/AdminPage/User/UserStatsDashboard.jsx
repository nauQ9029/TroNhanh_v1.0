import React, { useState, useEffect } from 'react';
import { Card, Statistic, Row, Col, Progress, Spin, message } from 'antd';
import { 
  TeamOutlined, 
  LockOutlined, 
  CrownOutlined, 
  ShoppingOutlined, 
  SafetyOutlined,
  DashboardOutlined
} from '@ant-design/icons';
import { getUserStats } from '../../../services/userService';

const UserStatsDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOwners: 0,
    totalCustomers: 0,
    totalMembership: 0,
    totalLockedAccounts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserStats();
  }, []);

  const fetchUserStats = async () => {
    try {
      setLoading(true);
      const response = await getUserStats();
      console.log('Stats API response:', response);
      
      // Handle the new API response structure
      if (response.success && response.data) {
        const apiData = response.data;
        
        // Transform API data to match component expectations
        const transformedStats = {
          totalUsers: apiData.totalUsers || 0,
          activeUsers: (apiData.totalUsers || 0) - (apiData.totalLockedAccounts || 0),
          lockedUsers: apiData.totalLockedAccounts || 0,
          owners: apiData.totalOwners || 0,
          users: apiData.totalCustomers || 0,
        };
        
        console.log('Transformed stats:', transformedStats);
        setStats(transformedStats);
      } else {
        console.warn('Unexpected API response structure:', response);
        setStats({
          totalUsers: 0,
          newUsersLast30Days: 0,
          activeUsers: 0,
          lockedUsers: 0,
          owners: 0,
          admins: 0,
          users: 0,
          activeMemberships: 0,
          noneMemberships: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      message.error('Failed to fetch user statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '16px 0' }}>
        <Card 
          style={{ 
            textAlign: 'center',
            padding: '40px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
          }}
        >
          <Spin size="large" />
          <div style={{ marginTop: '16px', color: '#666', fontSize: '16px' }}>
            Loading user statistics...
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Overview Statistics */}
      <Card 
        title={
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#1890ff' }}>
            <DashboardOutlined style={{ marginRight: '8px' }} />
            User Overview
          </span>
        }
        style={{ 
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8}>
            <Card 
              style={{ 
                border: '1px solid #e8f4fd',
                borderRadius: '8px',
                backgroundColor: '#f8fcff',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              bodyStyle={{ padding: '20px 16px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>Total Users</span>}
                value={stats.totalUsers}
                prefix={<TeamOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
                valueStyle={{ color: '#1890ff', fontSize: '28px', fontWeight: 'bold' }}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Card 
              style={{ 
                border: '1px solid #e6f7ff',
                borderRadius: '8px',
                backgroundColor: '#f6ffed',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              bodyStyle={{ padding: '20px 16px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>Active Users</span>}
                value={stats.activeUsers}
                suffix={<span style={{ fontSize: '16px', color: '#999' }}>/ {stats.totalUsers}</span>}
                prefix={<SafetyOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 'bold' }}
              />
              <Progress 
                percent={stats.totalUsers ? Math.round((stats.activeUsers / stats.totalUsers) * 100) : 0}
                showInfo={false}
                strokeColor="#52c41a"
                trailColor="#f0f0f0"
                style={{ marginTop: '8px' }}
                strokeWidth={8}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={8}>
            <Card 
              style={{ 
                border: '1px solid #ffece6',
                borderRadius: '8px',
                backgroundColor: '#fff2f0',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              bodyStyle={{ padding: '20px 16px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>Locked Accounts</span>}
                value={stats.lockedUsers}
                suffix={<span style={{ fontSize: '16px', color: '#999' }}>/ {stats.totalUsers}</span>}
                prefix={<LockOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />}
                valueStyle={{ color: '#ff4d4f', fontSize: '28px', fontWeight: 'bold' }}
              />
              <Progress 
                percent={stats.totalUsers ? Math.round((stats.lockedUsers / stats.totalUsers) * 100) : 0}
                showInfo={false}
                strokeColor="#ff4d4f"
                trailColor="#f0f0f0"
                style={{ marginTop: '8px' }}
                strokeWidth={8}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      
      {/* Role Distribution */}
      <Card 
        title={
          <span style={{ fontSize: '16px', fontWeight: 600, color: '#722ed1' }}>
            <TeamOutlined style={{ marginRight: '8px' }} />
            User Roles Distribution
          </span>
        }
        style={{ 
          marginBottom: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: '8px'
        }}
      >
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={12}>
            <Card 
              style={{ 
                border: '1px solid #f3e8ff',
                borderRadius: '8px',
                backgroundColor: '#faf5ff',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              bodyStyle={{ padding: '20px 16px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>Property Owners</span>}
                value={stats.owners}
                suffix={<span style={{ fontSize: '16px', color: '#999' }}>/ {stats.totalUsers}</span>}
                prefix={<CrownOutlined style={{ color: '#722ed1', fontSize: '24px' }} />}
                valueStyle={{ color: '#722ed1', fontSize: '28px', fontWeight: 'bold' }}
              />
              <Progress 
                percent={stats.totalUsers ? Math.round((stats.owners / stats.totalUsers) * 100) : 0}
                showInfo={false}
                strokeColor="#722ed1"
                trailColor="#f0f0f0"
                style={{ marginTop: '8px' }}
                strokeWidth={8}
              />
            </Card>
          </Col>
          
          <Col xs={24} sm={12} md={12}>
            <Card 
              style={{ 
                border: '1px solid #e6fffb',
                borderRadius: '8px',
                backgroundColor: '#f6ffed',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                cursor: 'pointer'
              }}
              hoverable
              bodyStyle={{ padding: '20px 16px' }}
            >
              <Statistic
                title={<span style={{ fontSize: '14px', color: '#666' }}>Customers</span>}
                value={stats.users}
                suffix={<span style={{ fontSize: '16px', color: '#999' }}>/ {stats.totalUsers}</span>}
                prefix={<ShoppingOutlined style={{ color: '#13c2c2', fontSize: '24px' }} />}
                valueStyle={{ color: '#13c2c2', fontSize: '28px', fontWeight: 'bold' }}
              />
              <Progress 
                percent={stats.totalUsers ? Math.round((stats.users / stats.totalUsers) * 100) : 0}
                showInfo={false}
                strokeColor="#13c2c2"
                trailColor="#f0f0f0"
                style={{ marginTop: '8px' }}
                strokeWidth={8}
              />
            </Card>
          </Col>
        </Row>
      </Card>
      
    </div>
  );
};

export default UserStatsDashboard;