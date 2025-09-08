import { Carousel, Avatar } from 'antd';
import { useRef, useState } from 'react';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { Row, Col, Button } from 'antd';

const testimonials = [
  {
    name: 'Annie',
    role: 'Customer',
    avatar: 'https://i.pravatar.cc/100?img=5',
    text: 'I had an amazing experience using this platform. The booking process was straightforward, and the customer service team was very responsive.',
  },
  {
    name: 'Gabriel',
    role: 'Landlord in Tokyo',
    avatar: 'https://i.pravatar.cc/100?img=8',
    text: 'This service made my tasks easier. From searching to payment, everything was smooth.',
  },
  {
    name: 'Emily',
    role: 'Customer',
    avatar: 'https://i.pravatar.cc/100?img=12',
    text: 'Great experience! Highly recommend to anyone looking for a comfortable stay.',
  },
];

export default function TestimonialCarousel() {
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef();

  const handlePrev = () => {
    carouselRef.current?.prev();
  };

  const handleNext = () => {
    carouselRef.current?.next();
  };

  return (
    <div className="testimonial-section">
      <h2>What our partners think</h2>
      <p>See what our partners say about us</p>

      <div className="carousel-wrapper">

        <Carousel
          dots={false}
          centerMode
          slidesToShow={3}
          infinite
          autoplay
          ref={carouselRef}
          beforeChange={(from, to) => setCurrent(to)}
          className="testimonial-carousel"
        >
          {testimonials.map((t, index) => {
            const isNext = (index === (current + 1) % testimonials.length);
            return (
              <div
                className={`testimonial-card-wrapper ${isNext ? 'highlight-next' : ''}`}
                key={index}
              >
                <div className="testimonial-card">
                  <div className="card-content">
                    <div className="avatar-section">
                      <Avatar src={t.avatar} size={64} />
                      <div className="name-role">
                        <strong>{t.name}</strong>
                        <div className="role">{t.role}</div>
                      </div>
                    </div>
                    <p className="testimonial-text">{t.text}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Carousel>
        <Row justify="center" className="mt-4">
          <Col>
            <Button
              shape="circle"
              icon={<LeftOutlined />}
              onClick={handlePrev}
              className="mx-2"
            />
            <Button
              shape="circle"
              icon={<RightOutlined />}
              onClick={handleNext}
              className="mx-2"
            />
          </Col>
        </Row>
      </div>
    </div>
  );
}
