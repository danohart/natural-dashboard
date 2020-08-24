import { Card } from "react-bootstrap";

export default function Cards(props) {
  return (
    <Card text={props.bg} className='mb-4' border={props.bg}>
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
