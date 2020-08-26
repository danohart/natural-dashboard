import { useState, useEffect } from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import { DateRangePicker } from "react-dates";
import WCApi from "../utils/WCApi";
import moment from "moment";

export default function Home() {
  const [totalSales, setTotalSales] = useState("Loading");
  const [selectDate, setSelectDate] = useState({
    beginning: "2020-08-01",
    ending: "2020-08-30",
  });
  const [focus, setFocus] = useState(null);

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
      date_min: b,
      date_max: e,
    }).then((res) => setTotalSales(res));
  }

  useEffect(() => {
    getWCDataWithDate(selectDate.beginning, selectDate.ending);
  }, []);

  console.log("beginning", selectDate);

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
        <Col xs={6} sm={6} md={10} lg={10}>
          <DateRangePicker
            startDate={moment(selectDate.beginning)} // momentPropTypes.momentObj or null,
            startDateId='reportStartDate' // PropTypes.string.isRequired,
            endDate={moment(selectDate.ending)} // momentPropTypes.momentObj or null,
            endDateId='reportEndDate' // PropTypes.string.isRequired,
            numberOfMonths={1}
            displayFormat='MMMM DD'
            isOutsideRange={() => false}
            onDatesChange={({ startDate, endDate }) =>
              getWCDataWithDate(
                moment(startDate).format("YYYY-MM-DD"),
                moment(endDate).format("YYYY-MM-DD")
              )
            }
            focusedInput={focus}
            onFocusChange={(focus) => setFocus(focus)}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "info"}
            text='primary'
            title='Total Discounts'
            money
          >
            {totalSales.total_discount}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "success"}
            text='black'
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
