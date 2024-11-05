// components/ProtectedRoute.js
import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import { ReactElement } from "react";

interface ProtectedRouteProps {
  element: ReactElement;
  userId: string;
}

const ProtectedRoute = ({ element, userId }: ProtectedRouteProps): ReactElement => {
  const { roomNumber } = useParams();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);

  useEffect(() => {
    const checkRoomAccess = async () => {
      try {
        const body = { userId: userId, roomId: roomNumber };
        const response = await axios.post(`${process.env.REACT_APP_MATCHING_SERVICE_URL}/check`, {
          data: body,
        });
        setHasAccess(response.data.hasAccess);
      } catch (error) {
        console.error("Error checking room access:", error);
        setHasAccess(false);
      }
    };

    checkRoomAccess();
  }, [roomNumber, userId]);

  if (hasAccess === null) {
    return <div>Loading...</div>;
  }

  return hasAccess ? element : <Navigate to="/" />;
};

export default ProtectedRoute;
