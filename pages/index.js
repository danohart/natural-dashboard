import { useState, useEffect } from "react";
import Head from "next/head";
import { Container, Row, Col, Dropdown } from "react-bootstrap";
import Card from "../components/Card";
import WCApi from "../utils/WCApi";
import moment from "moment";

export default function Home() {
  const [totalSales, setTotalSales] = useState("Loading");
  const [selectDate, setSelectDate] = useState({
    beginning: "2020-08-01",
    ending: "2020-08-30",
  });

  async function getWCData(type, param) {
    const fetchData = await WCApi.get(type, param);
    const res = fetchData.data[0];

    return res;
  }

  function getWCDataWithDate(b, e) {
    setSelectDate({
      beginning: b,
      ending: e,
    });

    setTotalSales("Loading");

    getWCData("reports/sales", {
      date_min: b || selectDate.beginning,
      date_max: e || selectDate.ending,
    }).then((res) => setTotalSales(res));
  }

  useEffect(() => {
    getWCDataWithDate(selectDate.beginning, selectDate.ending);
  }, []);

  const monthlyDates = [
    { beginning: "2020-08-01", ending: "2020-08-30" },
    { beginning: "2020-07-01", ending: "2020-07-31" },
    { beginning: "2020-06-01", ending: "2020-06-30" },
  ];

  console.log(selectDate);

  return (
    <Container>
      <Head>
        <title>Natural Dashboard</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <Row>
        <Col>
          <h1 className='mt-4 mb-4' align='center'>
            Natural Dashboard
          </h1>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <Dropdown>
            <Dropdown.Toggle id='dropdown-basic'>Pick a Month</Dropdown.Toggle>

            <Dropdown.Menu>
              {monthlyDates.map((date) => (
                <Dropdown.Item
                  onClick={() => getWCDataWithDate(date.beginning, date.ending)}
                  key={date.beginning}
                >
                  {date.beginning} - {date.ending}
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
      <Row>
        <Col className='justify-content-center'>
          <div align='center'>
            {selectDate.beginning} - {selectDate.ending}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "info"}
            text='white'
            title='Total Discounts'
            money
          >
            {totalSales.total_discount}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "success"}
            text='white'
            title='Total Refunds'
          >
            {totalSales.total_refunds < 1 ? "None" : totalSales.total_sales}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "warning"}
            text='black'
            title='Total Orders'
          >
            {totalSales.total_orders}
          </Card>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "primary"}
            text='white'
            title='Total Sales'
            money
          >
            {totalSales.total_sales}
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
