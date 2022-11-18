import "bootstrap/dist/css/bootstrap.css";

const Bootstrap = ({ Component, pageProps }) => { // Component will be equal to the visited page, pageProps other components passed to the main Component
    return <Component {...pageProps} />
}

export default Bootstrap;