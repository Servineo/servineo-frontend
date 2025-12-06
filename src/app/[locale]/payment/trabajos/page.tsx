"use client";
import LoadingFallback from "./LoadingFallback";
import { Suspense,useEffect,useState } from "react";
import TrabajosList from "./TrabajosList";

export default function TrabajosRequester() {
  const [userId, setUserId] = useState<string | null>(null);
  // Simulamos un usuario (puedes reemplazarlo con el real)
  useEffect(() => {
      const token = localStorage.getItem('servineo_user');
      if (token) {
        const userData = JSON.parse(token);
        const id = userData._id || userData.id;
        setUserId(id);
      }
    }, []);

    console.log("User ID in TrabajosRequester:", userId);

  return (
    <Suspense fallback={<LoadingFallback />}>
      <TrabajosList userId={userId} />
    </Suspense>
  );
}
