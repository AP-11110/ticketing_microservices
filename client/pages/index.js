import Link from "next/link";

// requests from the component are always issued from the browser
const LandingPage = ({ currentUser, tickets }) => {

    const ticketList = tickets?.map(ticket => {
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>
                    {/* wildcard routes with nextjs */}
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`} legacyBehavior>
                        <a className="text-decoration-none">View</a>
                    </Link>
                </td>
            </tr>
        )
    });

    return (
        <div>
            <h2>Tickets</h2>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    )
}

// requests from here can be issued from the client or the server as part of the server side rendering process
// generally used for pre-fetching data
LandingPage.getInitialProps = async (context, client, currentUser) => {
    const { data } = await client.get("/api/tickets");

    return { tickets: data };
}

export default LandingPage;

