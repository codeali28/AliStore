import { Col, Row, Typography, Card } from "antd"
import { ShoppingOutlined, TeamOutlined, TrophyOutlined } from "@ant-design/icons"

const { Title, Paragraph } = Typography

const Hero = () => {
  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            About AliStore
          </span>
          <Title level={2} className="fw-bold">Our Story & Mission</Title>
          <Paragraph className="lead text-secondary">
            AliStore was created as a modern, reliable e-commerce shopping experience for the CoDev Training Program final MERN mini-project.
          </Paragraph>
        </div>

        <Row gutter={[24, 24]}>
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white">
              <ShoppingOutlined className="text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Curated Products</h5>
              <p className="text-muted small mb-0">
                We select the latest and most demanded consumer electronics, fashion, and lifestyle items at affordable prices.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white">
              <TrophyOutlined className="text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Cash on Delivery</h5>
              <p className="text-muted small mb-0">
                Shop with total peace of mind. Pay cash right at your doorstep after inspecting your packaged items.
              </p>
            </Card>
          </Col>
          <Col xs={24} md={8}>
            <Card className="border-0 shadow-sm rounded-4 text-center p-3 h-100 bg-white">
              <TeamOutlined className="text-primary fs-1 mb-3" />
              <h5 className="fw-bold">Customer First</h5>
              <p className="text-muted small mb-0">
                Dedicated customer assistance and easy 7-day exchange policies ensure a seamless shopping journey.
              </p>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Hero