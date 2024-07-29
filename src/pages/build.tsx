import { useParams } from "react-router-dom";

export const Build = () => {
  const { bID } = useParams();
  return <h1>Build / {bID}</h1>;
};

