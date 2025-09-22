import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Row, Col, Typography, Image } from 'antd';
import { FileAddOutlined, CalculatorOutlined, DollarOutlined } from '@ant-design/icons';

import './HomePage.css';

const { Title } = Typography;

const HomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="home-container">
            <div className="company-header">
                <img
                    src="/logo.jpeg"
                    alt="Utsab Micro Finance Logo"
                    className="company-logo"
                    style={{
                        filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))' /* Optional shadow effect */
                    }}
                />
                <Title level={2} className="company-name">
                    Utsab Micro Finance Private Limited
                </Title>
            </div>

            <Row gutter={[24, 24]} justify="center" className="button-row">
                <Col xs={24} sm={12} md={8}>
                    <Card hoverable className="feature-card">
                        <Button
                            type="primary"
                            icon={<FileAddOutlined />}
                            size="large"
                            block
                            onClick={() => navigate('/proposal-entry')}
                        >
                            Proposal Entry
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card hoverable className="feature-card">
                        <Button
                            type="primary"
                            icon={<CalculatorOutlined />}
                            size="large"
                            block
                            onClick={() => navigate('/bm-grt-entry')}
                        >
                            BM GRT Entry
                        </Button>
                    </Card>
                </Col>

                <Col xs={24} sm={12} md={8}>
                    <Card hoverable className="feature-card">
                        <Button
                            type="primary"
                            icon={<DollarOutlined />}
                            size="large"
                            block
                            onClick={() => navigate('/disbursement-entry')}
                        >
                            Disbursement Entry
                        </Button>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default HomePage;