import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Image } from 'antd';
import { EyeOutlined, FileSearchOutlined, AuditOutlined } from '@ant-design/icons';
import './AdminHomePage.css';

const { Title } = Typography;

const AdminHomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="admin-home-container">
      <div className="admin-company-header">
        <Image 
          src="/logo.jpeg" 
          preview={false}
          className="admin-logo"
          alt="Utsab Micro Finance Logo"
        />
        <Title level={2} className="admin-company-name">
          Utsab Micro Finance Private Limited
        </Title>
        <div className="admin-badge">Admin Dashboard</div>
      </div>
      
      <Row gutter={[24, 24]} justify="center" className="admin-button-row">
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="admin-feature-card">
            <Button 
              type="primary" 
              icon={<FileSearchOutlined />} 
              size="large"
              block
              onClick={() => navigate('/proposal-entries')}
              className="admin-view-button"
            >
              View Proposal Entries
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="admin-feature-card">
            <Button 
              type="primary" 
              icon={<AuditOutlined />} 
              size="large"
              block
              onClick={() => navigate('/bm-grt-entries')}
              className="admin-view-button"
            >
              View BM GRT Entries
            </Button>
          </Card>
        </Col>
        
        <Col xs={24} sm={12} md={8}>
          <Card hoverable className="admin-feature-card">
            <Button 
              type="primary" 
              icon={<EyeOutlined />} 
              size="large"
              block
              onClick={() => navigate('/disbursement-entries')}
              className="admin-view-button"
            >
              View Disbursement Entries
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminHomePage;