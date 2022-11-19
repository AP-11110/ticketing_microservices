import "bootstrap/dist/css/bootstrap.css";
import buildClient from "../api/build-client";
import Header from "../components/header";

const AppComponent = ({ Component, pageProps, currentUser }) => { // Component will be equal to the visited page, pageProps other components passed to the main Component
    return (
        <div>
            <Header currentUser={currentUser} />
            <Component {...pageProps} />
        </div>
        
    )
}

// below will run before each page load
AppComponent.getInitialProps = async (appContext) => {
    const client = buildClient(appContext.ctx);
    const { data } = await client.get("/api/users/currentuser");

    let pageProps = {};
    if(appContext.Component.getInitialProps) {
        pageProps = await appContext.Component.getInitialProps(appContext.ctx);
    }
    

    return {
        pageProps,
        currentUser: data.currentUser
    }
};

export default AppComponent;