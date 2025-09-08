const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri);

const propertySampleData = [
  {
    title: "TONY ESTATES Danang Beach Luxury Apartments",
    description:
      "A 9-minute walk from My Khe Beach in Danang, TONY ESTATES Danang Beach Luxury Apartments offers accommodations with access to spa facilities, wellness packages, and beauty services.",
    price: 2500000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030412733-room0.png"],
    location: {
      district: "Hải Châu",
      street: "Lê Duẩn",
      addressDetail: "Số 12, Lê Duẩn",
      latitude: 16.074,
      longitude: 108.223,
    },
    city: "Da Nang",
    roomDetails:
      "2 bedrooms | 1 bath | WiFi | Beach view | 5th floor | Elevator | Parking | Near shopping area",
    vailable: "10 Jul 2025",
    maxGuest: 2,
    summary: [
      "2 bedrooms",
      "1 bath",
      "WiFi",
      "Beach view",
      "5th floor",
      "Elevator",
      "Parking",
      "Near shopping area",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030460575-property1.1.jpg",
      "/uploads/accommodation/1752030474449-property1.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
    available: "20 July 2025",
  },
  {
    title: "Sujet Da Nang",
    description:
      "Sujet Da Nang is a condo hotel featuring rooms with free Wifi and air conditioning in the center of Danang. The property is around 1.8 miles from Song Han Bridge, 2.2 miles from Asia Park Danang, and 6.5 miles from Marble Mountains.",
    price: 3200000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030422968-room1.png"],
    location: {
      district: "Sơn Trà",
      street: "Nguyễn Văn Thoại",
      addressDetail: "Studio A3, Nguyễn Văn Thoại",
      latitude: 16.062,
      longitude: 108.247,
    },
    roomDetails:
      "Studio | 1 bath | WiFi | City view | 2nd floor | Elevator | Parking | Balcony",
    available: "15 Jul 2025",
    city: "Da Nang",
    maxGuest: 2,
    summary: [
      "Studio",
      "1 bath",
      "WiFi",
      "City view",
      "2nd floor",
      "Elevator",
      "Parking",
      "Balcony",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030484691-property2.1.jpg",
      "/uploads/accommodation/1752030496561-property2.2.jpg",
    ],
    reviews: [
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Bui Le Viet Anh",
        rating: 7,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Leisure with partner",
        weeksAgo: 35,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
    available: "01 Dec 2025",
  },
  {
    title: "Lantana House Boutique Da Nang by Haviland",
    description:
      "The vast area encompasses beaches and hills, and is characterised by laid-back seafood eateries, beer gardens and upscale jazz venues.",
    price: 4000000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030435637-room2.png"],
    location: {
      district: "Ngũ Hành Sơn",
      street: "Trần Đại Nghĩa",
      addressDetail: "Căn hộ 2B, số 30 Trần Đại Nghĩa",
      latitude: 16.005,
      longitude: 108.26,
    },
    roomDetails:
      "1 bedroom | 1 bath | WiFi | Refrigerator | 5th floor | Elevator | Parking",
    available: "20 Jul 2025",
    city: "Da Nang",
    maxGuest: 3,
    summary: [
      "1 bedroom",
      "1 bath",
      "WiFi",
      "Refrigerator",
      "5th floor",
      "Elevator",
      "Parking",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030484691-property2.1.jpg",
      "/uploads/accommodation/1752030496561-property2.2.jpg",
    ],
    reviews: [
      {
        name: "Dinh Nguyen Khanh Luan",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "John Von Neumann",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
    available: "28 July 2025",
  },
  {
    title: "Sena home 3rd-Near Danang Dragon bridge-Han river",
    description:
      "Sena home 3rd-Near Danang Dragon bridge-Han river is located in Danang, just 1.4 miles from Indochina Riverside Mall and 2.7 miles from Asia Park Danang. Featuring mountain and river views, this homestay also comes with free Wifi.",
    price: 1800000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030449624-room3.png"],
    location: {
      district: "Liên Chiểu",
      street: "Nguyễn Lương Bằng",
      addressDetail: "Phòng A4, 213 Nguyễn Lương Bằng",
      latitude: 16.08,
      longitude: 108.146,
    },
    roomDetails:
      "1 bedroom | Shared bath | WiFi | City view | 8th floor | Elevator | Near school facilities",
    available: "05 Aug 2025",
    city: "Da Nang",
    maxGuest: 2,
    summary: [
      "1 bedroom",
      "Shared bath",
      "WiFi",
      "City view",
      "8th floor",
      "Elevator",
      "Near school facilities",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030540594-property4.1.jpg",
      "/uploads/accommodation/1752030553132-property4.2.jpg",
    ],
    reviews: [
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
    ],
  },
  {
    title: "M Village",
    description:
      "English Vietnamese Free Wi-Fi in all rooms! Internet Internet services Wi-Fi in public areas Billiards Fitness center Gym/fitness Pub crawl Anti-viral cleaning products Breakfast takeaway service Cashless payment service Daily disinfection in all rooms Daily disinfection in common areas First aid kit Free face masks Guest rooms seal after sanitization Hand sanitizer Hot water linen and laundry washing Professional-grade sanitizing services.",
    price: 4500000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030412733-room0.png"],
    location: {
      district: "Cẩm Lệ",
      street: "Phạm Như Xương",
      addressDetail: "Căn hộ 4A, Phạm Như Xương",
      latitude: 16.014,
      longitude: 108.194,
    },
    roomDetails:
      "2 bedrooms | 1 bath | Kitchen | WiFi | City view | Air condition | 4th floor | Elevator | Parking",
    available: "29 July 2025",
    city: "Da Nang",
    maxGuest: 4,
    summary: [
      "2 bedrooms",
      "1 bath",
      "Kitchen",
      "WiFi",
      "City view",
      "Air condition",
      "4th floor",
      "Elevator",
      "Parking",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030460575-property1.1.jpg",
      "/uploads/accommodation/1752030474449-property1.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
  {
    title: "Studio Banana Flower Apartment",
    description:
      "A truly global city, London has long been considered a cutting-edge metropolis and hub for culture, style and finance. With each borough, Tube zone and neighborhood of London sporting its own vibe and lifestyle advantages, it can be downright difficult to settle on where to look for a furnished apartment in London . Whether you’re a digital nomad looking for a studio apartment in London or just seeking a month to month rental in London, Blueground has you covered.",
    price: 3700000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030422968-room1.png"],
    location: {
      district: "Hải Châu",
      street: "2 Tháng 9",
      addressDetail: "Số 89, đường 2/9",
      latitude: 16.043,
      longitude: 108.218,
    },
    roomDetails:
      "Studio | 1 bath | Small kitchen | WiFi | Washing machine | 3th floor | Near shopping area",
    available: "10 Aug 2025",
    city: "Da Nang",
    maxGuest: 2,
    summary: [
      "Studio",
      "1 bath",
      "WiFi",
      "Small kitchen",
      "3rd floor",
      "Near shopping area",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030484691-property2.1.jpg",
      "/uploads/accommodation/1752030496561-property2.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
  {
    title: "Sharon Accommodation",
    description:
      "A stay at Sharon Accommodation and Spa places you in the heart of Da Nang, just a 5-minute walk from My Khe Beach and within a 5-minute drive of Han River. This spa aparthotel is 1.7 mi (2.7 km) from Dragon Bridge and 2.3 mi (3.8 km) from Da Nang Cathedral.",
    price: 2900000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030435637-room2.png"],
    location: {
      district: "Thanh Khê",
      street: "Lý Thái Tổ",
      addressDetail: "Phòng 6B, Lý Thái Tổ",
      latitude: 16.061,
      longitude: 108.195,
    },
    roomDetails: "1 phòng ngủ | 1 nhà vệ sinh | Gác lửng | Máy lạnh | WiFi",
    roomDetails:
      "1 bedroom | 1 bath | WiFi | Refrigerator | Mezzanine | 3rd floor",
    available: "12 Jul 2025",
    city: "Da Nang",
    maxGuest: 2,
    summary: [
      "1 bedroom",
      "1 bath",
      "WiFi",
      "Refrigerator",
      "Mezzanine",
      "3rd floor",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030484691-property2.1.jpg",
      "/uploads/accommodation/1752030496561-property2.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
  {
    title: "New Home Apartment",
    description:
      "A truly global city, London has long been considered a cutting-edge metropolis and hub for culture, style and finance. With each borough, Tube zone and neighborhood of London sporting its own vibe and lifestyle advantages, it can be downright difficult to settle on where to look for a furnished apartment in London . Whether you’re a digital nomad looking for a studio apartment in London or just seeking a month to month rental in London, Blueground has you covered.",
    price: 5000000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030449624-room3.png"],
    location: {
      district: "Sơn Trà",
      street: "Bạch Đằng",
      addressDetail: "Căn hộ 5C, số 200 Bạch Đằng",
      latitude: 16.078,
      longitude: 108.225,
    },
    roomDetails:
      "2 bedrooms | 2 baths | WiFi | Refrigerator | Kitchen | City view | 11th floor | Elevator | Parking | Near shopping area",
    available: "25 Jul 2025",
    city: "Da Nang",
    maxGuest: 4,
    summary: [
      "2 bedrooms",
      "2 baths",
      "WiFi",
      "Refrigerator",
      "Kitchen",
      "City view",
      "11th floor",
      "Elevator",
      "Parking",
      "Near shopping area",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030540594-property4.1.jpg",
      "/uploads/accommodation/1752030553132-property4.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
  {
    title: "Accommodation for students",
    description:
      "Good price, private bathroom, with balcony, suitable for groups of 2 students.",
    price: 2200000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030435637-room2.png"],
    location: {
      district: "Hải Châu",
      street: "Núi Thành",
      addressDetail: "Phòng 2A, số 88 Núi Thành",
      latitude: 16.038,
      longitude: 108.218,
    },
    roomDetails:
      "1 room | Private bathroom | Small kitchen | Electric fan | WiFi | 3rd floor | Near shopping area",
    available: "08 Aug 2025",
    city: "Da Nang",
    maxGuest: 2,
    summary: [
      "1 room",
      "1 bath",
      "1 small kitchen",
      "Electric fan",
      "WiFi",
      "3rd floor",
      "Near shopping area",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030484691-property2.1.jpg",
      "/uploads/accommodation/1752030496561-property2.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
  {
    title: "S Apartment",
    description:
      "English Vietnamese Free Wi-Fi in all rooms! Internet Internet services Wi-Fi in public areas Billiards Fitness center Gym/fitness Pub crawl Anti-viral cleaning products Breakfast takeaway service Cashless payment service Daily disinfection in all rooms Daily disinfection in common areas First aid kit Free face masks Guest rooms seal after sanitization Hand sanitizer Hot water linen and laundry washing Professional-grade sanitizing services.",
    price: 6000000,
    status: "Available",
    isApproved: true,
    approvedStatus: "approved",
    photos: ["/uploads/accommodation/1752030412733-room0.png"],
    location: {
      district: "Sơn Trà",
      street: "Trần Hưng Đạo",
      addressDetail: "Penthouse 10F, số 5 Trần Hưng Đạo",
      latitude: 16.065,
      longitude: 108.231,
    },
    roomDetails:
      "3 bedrooms | 2 baths | WiFi | City view | 7th floor | Elevator | Parking",
    available: "30 Jul 2025",
    city: "Da Nang",
    maxGuest: 6,
    summary: [
      "3 bedrooms",
      "2 baths",
      "WiFi",
      "City view",
      "7th floor",
      "Elevator",
      "Parking",
    ],
    galleryImages: [
      "/uploads/accommodation/1752030460575-property1.1.jpg",
      "/uploads/accommodation/1752030474449-property1.2.jpg",
    ],
    reviews: [
      {
        name: "Cao Thi Khanh Vy",
        rating: 10,
        comment: "Very good service in a beautiful place. We love it.",
        purpose: "Business trip",
        weeksAgo: 35,
      },
      {
        name: "Le Van Luyen",
        rating: 10,
        comment: "Tuyệt",
        purpose: "Business trip",
        weeksAgo: 24,
      },
      {
        name: "Phan Quoc Toan",
        rating: 9,
        comment: "Clean rooms and friendly staff. Good location.",
        purpose: "Leisure with partner",
        weeksAgo: 45,
      },
      {
        name: "James Bone",
        rating: 8,
        comment: "Nice view but noisy at night.",
        purpose: "Leisure",
        weeksAgo: 30,
      },
    ],
  },
];

module.exports = { propertySampleData };

async function run() {
  try {
    await client.connect();
    const db = client.db("tro_nhanh"); // ví dụ: "rentaldb"
    const collection = db.collection("accommodations");

    // Thêm dữ liệu mới
    await collection.insertMany(propertySampleData);
    console.log("✅ Data inserted successfully!");
  } catch (err) {
    console.error("❌ Error inserting data:", err);
  } finally {
    await client.close();
  }
}

run();
