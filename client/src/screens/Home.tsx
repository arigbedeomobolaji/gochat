import { useNavigate } from "react-router-dom";
import useAuth from "@src/hooks/useAuth";
import { logoutUser } from "@src/queries/user.mutation";
import { errorFormat } from "@src/utils/errorFormat";
import { useMutation} from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { removeUser } from "@src/localStorage/userLocalStorage";
// import { useCookies } from "react-cookie";

export default function Home() {
    const navigate = useNavigate();
    const mutation = useMutation({
      mutationFn: logoutUser,
      onSuccess(){
        console.log("successfully");
        removeUser();
        navigate("/auth");
      },
      onError(error){
        setTimeout(() => {
          toast.error(errorFormat(error), {
            position: "top-right",
            theme: "colored"
          })
        }, 0)
      }
    });
    const {loading, user} = useAuth();
    if(loading) {
      return <h1>Fetching User data</h1>
    }
   
    function handleLogout(path: string) {
      console.log(path)
      mutation.mutate(path);
    }


    
  return (
    <div>Home
      <Link to="/about">about
      
      </Link>
      {JSON.stringify(user)}
      <button onClick={() => handleLogout("/logout")}>Logout</button>
      <button onClick={() => handleLogout("/logoutall")}>Logout All</button>
    </div>
  )
}
