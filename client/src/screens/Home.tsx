/* eslint-disable @typescript-eslint/no-unused-vars */
import useAuth from "@src/hooks/useAuth";
import { Link } from "react-router-dom";

export default function Home() {
    // const navigate = useNavigate();
    const {loading, user} = useAuth();
    if(loading) {
      return <h1>Fetching User data</h1>
    }

    
  return (
    <div>Home
      <Link to="/about">about
      
      </Link>
      {JSON.stringify(user)}
    </div>
  )
}
