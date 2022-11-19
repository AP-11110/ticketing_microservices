import axios from "axios";

const BuildClient = ({ req }) => {
  // window object only exists in the browser
  if(typeof window === "undefined") {
    // on  the server
    return axios.create({
        // http://SERVICENAME.NAMESPACE.svc.cluster.local
        // ingress service will forward the request
        baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
        headers: req.headers // stores info such as domain (ticketing.dev) & cookie
    });

  } else {
    // on the browser/client
    return axios.create({
        baseUrl: "/"
    })
  }
}

export default BuildClient;