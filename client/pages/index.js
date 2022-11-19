import buildClient from "../api/build-client";

// requests from the component are always issued from the browser
const LandingPage = ({ currentUser }) => {

    return currentUser ? <h1>You are signed in</h1> : <h1>You are not signed in</h1>
}

// requests from here can be issued from the client or the server as part of the server side rendering process
// generally used for pre-fetching data
LandingPage.getInitialProps = async (context) => {
    const { data } = await buildClient(context).get("/api/users/currentuser");
    return data;
}

export default LandingPage;

