import { useParams } from "react-router";

export default function User() {
  const { id } = useParams();

  return (
    <div>
      <h1>User ID: {id}</h1>
    </div>
  );
}
