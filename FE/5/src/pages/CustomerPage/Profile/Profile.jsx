import React, { useEffect, useState } from 'react';
import { Layout } from 'antd';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from './sidebar/SideBarCustomer'; 
import PersonalInfo from './sections/PersonalInfo';
import Favorites from './sections/Favorites';
import Messages from './sections/Messages';
import { getUserInfo, getUserMessages, getUserFavorites } from '../../../services/profileServices';

const { Sider, Content } = Layout;

const ProfilePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favRes = await getUserFavorites();
        setFavorites(favRes.data);
        await getUserInfo();
        await getUserMessages();
      } catch (err) {
        console.error(err);
        setError('Bạn phải login để vào trang này');
      }
    };
    fetchData();
  }, []);

return error ? (
  <div style={{ color: 'red', textAlign: 'center', marginTop: 40, fontSize: 18 }}>
    {error}
  </div>
) : (
  <Layout style={{ minHeight: '100vh' }}>
    <Sider width={250} className="bg-white shadow">
      <Sidebar
        selectedKey={location.pathname}
        onSelect={({ key }) => navigate(key)}
      />
    </Sider>
    <Content style={{ padding: '24px' }}>
      <Routes>
        <Route path="personal-info" element={<PersonalInfo />} />
        <Route path="messages" element={<Messages />} />
        <Route path="favorites" element={<Favorites favorites={favorites} />} />
      </Routes>
    </Content>
  </Layout>
);
}
export default ProfilePage;