"use client";

import { useLoadScript } from "@react-google-maps/api";
import Map from "@/components/map";
import { BounceLoader } from "react-spinners";

export default function Home() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  if (!apiKey) {
    throw new Error("Missing Google Maps API Key in environment variables.");
  }

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: apiKey,
    libraries: ["places"],
  });

  return !isLoaded ? (
    <div className="w-[100vw] h-[100vh] flex justify-center items-center">
      <BounceLoader color="#0922b1" size={80} />
    </div>
  ) : (
    <Map />
  );
}
