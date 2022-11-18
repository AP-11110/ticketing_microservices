import axios from "axios";

// requests from the component are always issued from the browser
const LandingPage = ({ currentUser }) => {
    // console.log(currentUser);
    // axios.get("/api/users/currentuser").catch((err) => {
    //     console.log(err.message);
    // })
    console.log(currentUser);
    return (
        <div>Landing</div>
    )
}

// requests from here can be issued from the client or the server as part of the server side rendering process
// generally used for pre-fetching data
LandingPage.getInitialProps = async () => {

    // window object only exists in the browser
    if(typeof window === "undefined") {
        // run on the server
        const { data } = await axios.get(
            // http://SERVICENAME.NAMESPACE.svc.cluster.local
            // ingress service will forward the request
            "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser", {
                headers: {
                    Host: "ticketing.dev" // otherwise ingress wouldn't know which domain to use
                }
            }
        );
        return data;

    } else {
        // run on the browser/client, requests can be made with a base url
        const { data } = await axios.get("/api/users/currentuser");
        return data; // { currentUser: ... } will indicate whether user is signed in
    }
}

export default LandingPage;