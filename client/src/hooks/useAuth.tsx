/* eslint-disable @typescript-eslint/no-unused-vars */
import { useLocation, useNavigate } from "react-router-dom";
// import { toast } from 'react-toastify';
import { getCurrentUser } from "@src/queries/user.queries";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { User } from "@src/types";
import {
  getUserLocally,
  removeUser,
  saveUser,
} from "@src/localStorage/userLocalStorage";

type UseAuth = {
  user?: User;
  loading?: boolean;
};

export default function useAuth(): UseAuth {
  const navigate = useNavigate();
  const userLocally = getUserLocally();
  const { search } = useLocation();
  const userId = search.split("=")[1] || userLocally?._id;
  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(false);
  const getUser = useQuery({
    queryKey: ["user", userId],
    queryFn: getCurrentUser,
    retry: 2,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (!userLocally && !search) {
      navigate("/auth");
    }
  }, [userLocally, navigate, search]);

  useEffect(() => {
    setLoading(getUser.isLoading);
    if (getUser.data) {
      setUser(getUser.data.data);
      saveUser(getUser.data.data);
    } else {
      if (getUser.fetchStatus === "idle") {
        removeUser();
        navigate("/auth");
      }
    }
  }, [
    getUser,
    getUser.data,
    getUser?.data?.data,
    getUser.fetchStatus,
    getUser.isFetched,
    getUser.isLoading,
    navigate,
  ]);

  if (getUser.isError) {
    if (getUser.dataUpdatedAt >= Date.now()) {
      toast(JSON.stringify(getUser.error), {
        position: "top-right",
      });
    }
  }

  return {
    user,
    loading,
  };
}
