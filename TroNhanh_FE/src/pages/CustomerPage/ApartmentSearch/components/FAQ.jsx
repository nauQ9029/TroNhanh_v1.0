import { Collapse, Typography } from "antd";

const { Paragraph, Title } = Typography;

const items = [
  {
    key: "1",
    label:
      "Integer morbi semper sodales sit facilisi habitant pulvinar sed venenatis?",
    children: (
      <Paragraph>
        Magnis congue neque sociis ut nisl. Quis dui lobortis lectus viverra.
      </Paragraph>
    ),
  },
  {
    key: "2",
    label: "Massa massa nulla rhoncus a quam consectetur sed purus, enim?",
    children: (
      <Paragraph>
        Nunc molestie sit in sed sodales. Bibendum pharetra, id viverra
        suspendisse pharetra ac aenean neque. Sodales ornare penatibus eros
        consectetur potenti in feugiat purus. Posuere amet, sodales nibh eget.
      </Paragraph>
    ),
  },
  {
    key: "3",
    label: "Dignissim congue rutrum pretium nunc sed nibh vitae tortor ut?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "4",
    label: "Vulputate imperdiet fusce vivamus nunc leo morbi scelerisque in?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "5",
    label: "Sit rhoncus rhoncus malesuada massa adipiscing arcu, semper ut in?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "6",
    label: "Vulputate nisl non neque iaculis lacus dui, habitant gravida?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "7",
    label: "Est felis a velit at vitae venenatis rhoncus?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "8",
    label: "Eget nam accumsan elementum accumsan imperdiet eu, cras?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "9",
    label: "Fermentum et semper aliquet justo, facilisis?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
  {
    key: "10",
    label: "A vulputate est diam tempus condimentum in?",
    children: <Paragraph>Example content here...</Paragraph>,
  },
];

const FAQ = () => {
  return (
    <div style={{ margin: "0 auto", padding: "40px 16px" }}>
      <Title level={2}>Apartments for rent in London</Title>
      <Paragraph>
        A truly global city, London has long been considered a cutting-edge
        metropolis and hub for culture, style and finance. With each borough,
        Tube zone and neighborhood of London sporting its own vibe and lifestyle
        advantages, it can be downright difficult to settle on where to look for
        a furnished apartment in London . Whether you’re a digital nomad looking
        for a studio apartment in London or just seeking a month to month rental
        in London, Blueground has you covered. With a pub on almost every corner
        and beautiful parks in all major neighborhoods, you’ll feel right at
        home across all of Blueground’s exquisite London flats.
      </Paragraph>
      <Paragraph>
        Furnished apartment rentals in London. Getting the most out of living in
        London starts with securing a furnished flat for rent. Fortunately,
        Blueground’s flats for rent across London marry convenient locations
        close to public transportation, top notch interiors and modern
        furnishings, and support from our local team. Zero in on the ideal
        serviced apartment in London from studios to two-bedroom apartments by
        filtering for your date, area, and must-have amenities on our site.
        Moving to London has never been simpler!
      </Paragraph>
      <Paragraph>
        The choice is yours from Chelsea to Soho to Shoreditch, always within a
        short walk from Tube stops and local hangouts. Show up and start living
        in your new London accommodation with furnishings and a fully-equipped
        setup taken care of before your arrival by the team at Blueground. So
        book today, and move in tomorrow so you can enjoy all a Blueground
        London flat has to offer: premium work from home setups, a user-friendly
        guest app service, flexible contracts, and a booking process free of
        broker’s fees (and stresses!).
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
