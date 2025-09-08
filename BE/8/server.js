const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const motels = [
  {
    name: 'Nhà trọ Hoa Mai',
    address: '123 Lê Duẩn',
    district: 'Hải Châu',
    lat: 16.0544,
    lng: 108.2022
  },
  {
    name: 'Nhà trọ An Bình',
    address: '456 Nguyễn Văn Linh',
    district: 'Hải Châu',
    lat: 16.0589,
    lng: 108.2192
  },
  {
    name: 'Nhà trọ Bình Yên',
    address: '789 Hải Phòng',
    district: 'Thanh Khê',
    lat: 16.0601,
    lng: 108.2100
  }
];

// Tính khoảng cách theo công thức đơn giản (lat/lng, giả định mặt phẳng)
function getDistance(a, b) {
  const dx = a.lat - b.lat;
  const dy = a.lng - b.lng;
  return Math.sqrt(dx * dx + dy * dy) * 111; // nhân 111 để đổi ra km gần đúng
}

app.post('/api/search', (req, res) => {
  const { district, street, facilities } = req.body;

  console.log('Request:', req.body);

  // Mô phỏng toạ độ theo từ khoá (bạn có thể dùng AI sau này)
  const mockFacilityLocation = { lat: 16.0545, lng: 108.2050 };

  // Lọc theo district và gần tiện ích
  const nearby = motels.filter(motel =>
    motel.district.toLowerCase().includes(district.toLowerCase()) &&
    getDistance(motel, mockFacilityLocation) < 1
  );

  res.json(nearby);
});

app.listen(5000, () => {
  console.log('✅ Backend running at http://localhost:5000');
});
