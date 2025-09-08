import React from 'react';
import { Menu } from 'antd';
import { UserOutlined, HeartOutlined, MessageOutlined, WarningOutlined } from '@ant-design/icons';

const Sidebar = ({ selectedKey, onSelect }) => {
  return (
    <Menu
      mode="inline"
      selectedKeys={[selectedKey]}
      onClick={onSelect}
      style={{ height: '100%' }}
    >
      <Menu.Item key="/customer/profile/personal-info" icon={<UserOutlined />}>
        Personal Info
      </Menu.Item>
      <Menu.Item key="/customer/profile/favorites" icon={<HeartOutlined />}>
        Favorites
      </Menu.Item>
       <Menu.Item key="/customer/profile/my-reports" icon={<WarningOutlined/>}>
        Reports
      </Menu.Item>
      <Menu.Item key="/customer/profile/messages" icon={<MessageOutlined />}>
        Messages
      </Menu.Item>
      
    </Menu>
  );
};

export default Sidebar;