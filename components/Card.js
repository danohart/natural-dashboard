import { Card } from "react-bootstrap";

export default function Cards(props) {
  return (
    <Card bg={props.bg} text={props.text} className='mb-4'>
      <Card.Header>{props.title}</Card.Header>
      <Card.Body>
        <Card.Text>
          {!props.money ? "" : "$"}
          {props.children}
        </Card.Text>
      </Card.Body>
    </Card>
  );
}
