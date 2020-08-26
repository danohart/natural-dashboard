import { Row, Col } from "react-bootstrap";

export default function Footer() {
  return (
    <Row className='footer'>
      <Col>
        &copy; {new Date().getFullYear()} |{" "}
        <a href='https://danielhart.co/' target='_blank'>
          Daniel Hart Web Design
        </a>
      </Col>
    </Row>
  );
}
