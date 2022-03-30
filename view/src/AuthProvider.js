import { useState, useEffect, useContext, createContext } from "react";

import '@authing/react-ui-components/lib/index.min.css';
import { initAuthClient, getAuthClient } from "@authing/react-ui-components";

initAuthClient({
  appId: "623ed2722dbacc824bd2bb0b",
});

export const authContext = createContext();

// Hook for child components to get the auth object ...
// ... and re-render when it changes.
export const useAuth = () => useContext(authContext);

// Provider hook that creates auth object and handles state
function useProvideAuth() {
  const storedUserInfo = localStorage.getItem('userInfo');
  const [userInfo, setUser] = useState(
    storedUserInfo === 'null' ? null : JSON.parse(storedUserInfo));

  const storedClient = localStorage.getItem('authClient');
  const [authClient, setClient] = useState(
    storedClient === 'null' ? null : getAuthClient());
// TODO  在Dashboard里面刷新后再登出会发生如下报错
// {
//   "code": 400,
//   "message": "userIds 参数有误"
// }
  useEffect(() => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
    localStorage.setItem('authClient', JSON.stringify(authClient));
  }, [userInfo, authClient]);

  // Return the user object and auth methods
  return {
    userInfo,
    setUser,
    authClient,
    setClient
  };
}

// function AnObject(number, string) {
//   this.number = number;
//   this.string = string;
//   this.add = function(){number++};
// }
// var initialObject = new AnObject(1, 'a');
// var serialized = JSON.stringify(initalObject);
// //Gives {"number": 1, "string": "a"}

// var parsed = JSON.parse(serialized);
// var recreated = new AnObject(parsed.number, parsed.string);
// //Is the same as initialObject


// Provider component that wraps your app and makes auth object ...
// ... available to any child component that calls useAuth().
export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

