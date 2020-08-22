import WooCommerceRestApi from "@woocommerce/woocommerce-rest-api";

const api = new WooCommerceRestApi({
  url: process.env.NEXT_PUBLIC_WP_URL,
  consumerKey: process.env.NEXT_PUBLIC_WC_CK,
  consumerSecret: process.env.NEXT_PUBLIC_WC_CS,
  version: "wc/v3",
});

export default api;
