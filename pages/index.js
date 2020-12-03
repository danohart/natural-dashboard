import { useState, useEffect } from "react";
import Head from "next/head";
import { Container, Row, Col } from "react-bootstrap";
import Card from "../components/Card";
import Footer from "../components/Footer";
import { DateRangePicker } from "react-dates";
import WCApi from "../utils/WCApi";
import moment from "moment";

export default function Home() {
  const currentDate = new Date();
  const [totalSales, setTotalSales] = useState("Loading");
  const [YTStats, setYTStats] = useState("Loading");
  const [selectDate, setSelectDate] = useState({
    beginning: currentDate.getFullYear() + "-" + currentDate.getMonth() + "-01",
    ending: currentDate.getFullYear() + "-" + currentDate.getMonth() + "-30",
  });
  const [percentageNumber, setPercentageNumber] = useState(10);

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

  function cleanNumbers(x) {
    if (x === undefined) return 0;
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }

  async function getYTData(part, channel) {
    const fetchApi = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=${part}&id=${channel}&key=${process.env.NEXT_PUBLIC_YT_API_KEY}`
    );
    const res = await fetchApi.json();

    setYTStats(res.items[0].statistics);

    return res;
  }

  useEffect(() => {
    getWCDataWithDate(selectDate.beginning, selectDate.ending);
    getYTData("statistics", "UCmsrdWd_iMIF2YKGduY5nig");
  }, []);

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
      <Row>
        <Col>
          <h2 align='center'>Sales</h2>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col xs={6} sm={6} md={6} lg={6}>
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
        <Col xs={6} sm={6} md={6} lg={6} className='d-flex justify-content-end'>
          <form>
            <label>Percentage</label>

            <input
              type='text'
              placeholder='percentage'
              value={percentageNumber}
              onChange={(e) => setPercentageNumber(e.target.value)}
            />
          </form>
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
            {cleanNumbers(totalSales.total_discount)}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "success"}
            text='black'
            title='Total Refunds'
            money
          >
            {totalSales.total_refunds}
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
            title='Total Sales minus refunds'
            money
          >
            {cleanNumbers(totalSales.total_sales - totalSales.total_refunds)}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "primary"}
            text='white'
            title='Total Sales'
            money
          >
            {cleanNumbers(totalSales.total_sales)}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "secondary"}
            text='white'
            title={percentageNumber + "% of total sales"}
            money
          >
            {cleanNumbers(
              (percentageNumber / 100) *
                (totalSales.total_sales - totalSales.total_refunds)
            )}
          </Card>
        </Col>
      </Row>
      <Row className='mb-4'>
        <Col>
          <h2 align='center'>YouTube Stats</h2>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "danger"}
            text='white'
            title='Subscribers'
          >
            {cleanNumbers(
              YTStats === "Loading" ? "0" : YTStats.subscriberCount
            )}
          </Card>
        </Col>
        <Col>
          <Card
            bg={totalSales === "Loading" ? "light" : "danger"}
            text='white'
            title='Total Views'
          >
            {cleanNumbers(YTStats === "Loading" ? "0" : YTStats.viewCount)}
          </Card>
        </Col>
      </Row>
      <Footer />
    </Container>
  );
}
