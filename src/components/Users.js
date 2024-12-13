import { useEffect, useState } from "react";

const User = () => {
  const [allUser, setUser] = useState({
    id: 1,
    name: "",
  });

  useEffect(() => {
    console.log(allUser);
  }, []); // Empty dependency array ensures this runs only once.

  return <div>Hello {allUser.name}</div>;
};

export default User;
