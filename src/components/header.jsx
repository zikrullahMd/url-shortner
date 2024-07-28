import React from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo_link2.png";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent,DropdownMenuLabel,DropdownMenuSeparator, DropdownMenuItem } from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { HomeIcon, LinkIcon, LogOut } from "lucide-react";
import { UrlState } from "@/context";
import { BarLoader } from "react-spinners";
import useFetch from "@/hooks/useFetch";
import { signout } from "../../db/apiAuth";


function Header() {
  const navigate = useNavigate();
  const {user, fetchUser} = UrlState();
  const {loading,fn:fnLogout} = useFetch(signout);
  return (
    <>
    <nav className="py-4 flex justify-between items-center">
      <Link to="/">
        <img src={logo} className="h-20" alt="logo"/>
      </Link>
      <div>
        {!user ? (
          <Button onClick={() => navigate("/auth")}>Login</Button>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger className="w-10 rounded-full overflow">
            <Avatar>
                <AvatarImage src={user?.user_metadata?.profile_pic} />
                <AvatarFallback>{user?.user_metadata?.name.substring(0,2).toUpperCase()}</AvatarFallback>
            </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user?.user_metadata?.name}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <HomeIcon className="mr-2 h-4 w-4" />
                <p onClick={()=>{
                  navigate("/");
                }}>Home</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                <LinkIcon className="mr-2 h-4 w-4" />
                <p onClick={()=>{
                  navigate("/dashboard");
                }}>My Links</p>
              </DropdownMenuItem>
              <DropdownMenuItem className="text-red-400 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4"/>
                <span onClick={()=>{
                  fnLogout()
                  .then(()=>{
                    fetchUser();
                    navigate("/");
                  })
                }}>Logout</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
      {loading && <BarLoader className="mb-4" width={"100%"} color="$36d7b7" />}
    </>
  );
}

export default Header;
