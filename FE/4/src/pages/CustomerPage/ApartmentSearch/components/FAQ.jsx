import { Collapse, Typography } from "antd";

const { Paragraph, Title } = Typography;

const items = [
  {
    key: "1",
    label: "What types of accommodations are available for rent?",
    children: (
      <Paragraph>
        We offer a variety of rental options including studio apartments, one-
        to three-bedroom flats, shared rooms, serviced apartments, and entire
        houses. Both furnished and unfurnished units are available.{" "}
      </Paragraph>
    ),
  },
  {
    key: "2",
    label: "What is typically included in the rental price?",
    children: (
      <Paragraph>
        This varies by listing. Some rentals include utilities such as water,
        electricity, Wi-Fi, and maintenance, while others may require separate
        payment. Check the property details for specifics.
      </Paragraph>
    ),
  },
  {
    key: "3",
    label: "Are short-term rentals available?",
    children: (
      <Paragraph>
        Yes. Many listings offer flexible lease terms, including daily, weekly,
        or monthly stays. Short-term availability depends on the property and
        the landlord’s policy.
      </Paragraph>
    ),
  },
  {
    key: "4",
    label: "Is a security deposit required?",
    children: (
      <Paragraph>
        In most cases, yes. Landlords usually require a refundable security
        deposit, typically equal to one or two months' rent, to cover any
        potential damages or unpaid rent.
      </Paragraph>
    ),
  },
  {
    key: "5",
    label: "Are pets allowed in the rental properties?",
    children: (
      <Paragraph>
        Some accommodations are pet-friendly, while others have restrictions. Be
        sure to check the listing details or inquire directly with the landlord.
      </Paragraph>
    ),
  },
  {
    key: "6",
    label: "Can I visit the property before renting?",
    children: (
      <Paragraph>
        Yes, most landlords or agents offer property viewings. You can schedule
        a visit in advance to inspect the accommodation before making a
        decision.
      </Paragraph>
    ),
  },
  {
    key: "7",
    label: "How do I apply to rent a property?",
    children: (
      <Paragraph>
        You can usually apply by submitting a rental application, valid ID, and
        proof of income. Some landlords may also require references or a
        background check.
      </Paragraph>
    ),
  },
  {
    key: "8",
    label: "Are there any fees for booking through the platform?",
    children: (
      <Paragraph>
        Some platforms may charge a service or processing fee, while others
        allow direct contact with landlords at no cost. Check our terms of
        service or listing conditions for details.
      </Paragraph>
    ),
  },
  {
    key: "9",
    label: " What happens if I need to cancel my rental?",
    children: (
      <Paragraph>
        Cancellation policies vary. Some rentals offer free cancellation up to a
        certain date, while others may retain a portion of the deposit. Review
        the cancellation policy before booking.
      </Paragraph>
    ),
  },
  {
    key: "10",
    label: "Is internet access included in the accommodation?",
    children: (
      <Paragraph>
        Many furnished apartments and serviced units include Wi-Fi, but not all
        do. You can find this information in the amenities section of each
        listing.
      </Paragraph>
    ),
  },
];

const FAQ = () => {
  return (
    <div style={{ margin: "0 auto", padding: "40px 16px" }}>
      <Title level={2}>Find Your Perfect Living Space with Ease</Title>
      <Paragraph>
        Looking for a comfortable and reliable place to stay? Whether you're
        relocating for work, studying in a new city, planning an extended visit,
        or simply seeking a change of scenery, our wide selection of rental
        accommodations is here to meet your needs. From affordable studio
        apartments to luxurious family homes, our listings cover a variety of
        styles, sizes, and budgets.
      </Paragraph>
      <Paragraph>
        Each property is carefully listed with detailed information, including
        location, rental price, amenities, nearby services, and high-quality
        photos to help you make an informed decision. Whether you prefer a quiet
        neighborhood, a vibrant city center, or somewhere close to public
        transportation, you will find options that match your lifestyle.
      </Paragraph>
      <Paragraph>
        Discover a wide range of rental accommodations tailored to suit your
        lifestyle and budget. Whether you're looking for a cozy studio, a
        spacious apartment, or a fully furnished house, our listings offer
        comfortable and convenient living spaces in desirable locations. Browse
        detailed property information, amenities, and photos to find the perfect
        place to call home.
      </Paragraph>
      <Paragraph>
        Our accommodations include:
        <ul
          style={{
            paddingLeft: "1.5rem",
            marginTop: "0.5rem",
            lineHeight: "1.8",
          }}
        >
          <li>Short-term and long-term rentals</li>
          <li>Furnished and unfurnished units</li>
          <li>Private rooms, shared spaces, and full apartments</li>
          <li>Utilities and Wi-Fi included (select listings)</li>
          <li>Flexible lease terms and pet-friendly options</li>
        </ul>
      </Paragraph>
      <Paragraph>
        Browse properties with confidence and convenience. We prioritize
        transparency, security, and ease of access, ensuring that your rental
        experience is smooth from start to finish. Begin your search today and
        discover a place you will be proud to call home.
      </Paragraph>
      <Collapse
        accordion
        expandIconPosition="end"
        items={items}
        style={{
          border: "none",
          backgroundColor: "transparent",
          marginTop: "24px",
        }}
      />
    </div>
  );
};

export default FAQ;
