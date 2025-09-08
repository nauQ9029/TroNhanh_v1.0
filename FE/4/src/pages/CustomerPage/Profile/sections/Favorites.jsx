import React, { useEffect, useState } from 'react';
import { Card } from 'antd';
import { getUserFavorites } from '../../../../services/profileServices';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    getUserFavorites()
      .then(res => setFavorites(res.data))
      .catch(err => {
        console.error(err);
        setError('Bạn phải login để vào trang này');
      });
  }, []);

  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <>
      <h2>Your Favorites</h2>
      {favorites.map((fav, index) => (
        <Card key={index} title={fav.title}>
          <p>{fav.description}</p>
        </Card>
      ))}
    </>
  );
};

export default Favorites;
