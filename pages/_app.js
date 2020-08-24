import "../styles/globals.css";
import "react-dates/initialize";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/style.scss";

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
