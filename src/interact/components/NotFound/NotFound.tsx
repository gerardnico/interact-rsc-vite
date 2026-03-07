
export default function NotFound({request}: { request: Request }) {

    return <p>Error: The page {new URL(request.url).pathname} was not found</p>

}