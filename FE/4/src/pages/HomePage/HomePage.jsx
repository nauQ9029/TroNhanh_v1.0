// pages/HomePage/HomePage.jsx
import React from 'react';
import { Layout } from 'antd';
import './HomePage_css.css';

import HeroSection from './HeroSection';
import InfoSection from './InfoSection';
import ServicesSection from './ServicesSection';
import TestimonialsCarousel from './testimonials';
import BlogSection from './BlogSection';
import UsefulLinks from './UsefulLinks';

const { Content } = Layout;

export default function HomePage() {
    return (
        <Layout className="homepage-container">
            <Content style={{ padding: '0 50px', marginTop: 24 }}>
                <HeroSection />
                <InfoSection />
                <ServicesSection />
                <TestimonialsCarousel />
                <BlogSection />
                <UsefulLinks />
            </Content>
        </Layout>
    );
}
