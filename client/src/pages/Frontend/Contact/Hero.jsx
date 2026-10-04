import { Form, Input, Button, Typography, Row, Col, Card } from "antd"
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from "@ant-design/icons"
import { useState } from "react"

const { Title, Paragraph } = Typography

const Hero = () => {
  const [submitted, setSubmitted] = useState(false)

  const handleFinish = () => {
    setSubmitted(true)
    if (window.toastify) {
      window.toastify("Thank you! Your message has been sent to AliStore support.", "success")
    }
  }

  return (
    <div className="py-5">
      <div className="container">
        <div className="text-center max-w-700 mx-auto mb-5">
          <span className="badge bg-primary-subtle text-primary px-3 py-2 rounded-pill fw-semibold mb-2">
            Get in Touch
          </span>
          <Title level={2} className="fw-bold">Contact AliStore Support</Title>
          <Paragraph className="lead text-secondary">
            Have questions about your order, delivery, or product catalog? We are here to help!
          </Paragraph>
        </div>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={10}>
            <Card className="border-0 shadow-sm rounded-4 p-3 bg-white h-100">
              <h5 className="fw-bold mb-4">Store Contact Info</h5>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{ width: "44px", height: "44px", fontSize: "18px" }}
                >
                  <EnvironmentOutlined />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Address</h6>
                  <span className="text-muted small">AliStore HQ , Faisalabad, Punjab, Pakistan</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3 mb-4">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{ width: "44px", height: "44px", fontSize: "18px" }}
                >
                  <MailOutlined />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Email</h6>
                  <span className="text-muted small">support@alistore.com</span>
                </div>
              </div>

              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg-primary-subtle text-primary d-flex align-items-center justify-content-center"
                  style={{ width: "44px", height: "44px", fontSize: "18px" }}
                >
                  <PhoneOutlined />
                </div>
                <div>
                  <h6 className="mb-0 fw-bold">Phone Support</h6>
                  <span className="text-muted small">+92 334 7743550 (Mon-Sat, 9AM-8PM)</span>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} md={14}>
            <Card className="border-0 shadow-sm rounded-4 p-4 bg-white">
              <h5 className="fw-bold mb-3">Send us a Message</h5>
              <Form layout="vertical" onFinish={handleFinish}>
                <Form.Item label="Your Name" required>
                  <Input size="large" placeholder="Enter your full name" className="rounded-3" />
                </Form.Item>
                <Form.Item label="Email Address" required>
                  <Input type="email" size="large" placeholder="name@example.com" className="rounded-3" />
                </Form.Item>
                <Form.Item label="Message" required>
                  <Input.TextArea rows={4} placeholder="How can we help you today?" className="rounded-3" />
                </Form.Item>
                <Button
                  type="primary"
                  size="large"
                  htmlType="submit"
                  icon={<SendOutlined />}
                  className="rounded-pill px-5 fw-semibold"
                  style={{ backgroundColor: "#2563eb", borderColor: "#2563eb" }}
                >
                  Send Message
                </Button>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  )
}

export default Hero