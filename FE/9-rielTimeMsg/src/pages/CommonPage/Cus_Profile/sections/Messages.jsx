import React, { useEffect, useState } from 'react';
import { List } from 'antd';
import { getUserMessages } from '../../../../services/profileServices';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserMessages()
      .then(res => setMessages(res.data))
      .catch(err => {
        console.error(err);
        setError('Bạn phải login để vào trang này');
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h2>Your Messages</h2>
      <List
        bordered
        dataSource={messages}
        renderItem={item => (
          <List.Item>
            <strong>{item.sender}:</strong> {item.content}
          </List.Item>
        )}
      />
    </>
  );
};

export default Messages;