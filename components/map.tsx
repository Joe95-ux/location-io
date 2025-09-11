"use client";

import { useState, useMemo, useCallback, useRef } from "react";
import {
  GoogleMap,
  Marker,
  DirectionsRenderer,
  Circle,
  MarkerClusterer,
} from "@react-google-maps/api";
import Places from "./places";
import Distance from "./distance";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "./logo";
import { cn } from "@/lib/utils";

type LatLngLiteral = google.maps.LatLngLiteral;
type DirectionsResult = google.maps.DirectionsResult;
type MapOptions = google.maps.MapOptions;

export default function Map() {
  const [office, setOffice] = useState<LatLngLiteral>();
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const mapRef = useRef<google.maps.Map | null>(null);
  const isMobile = useIsMobile();
  const [directions, setDirections] = useState<DirectionsResult>();
  const center = useMemo<LatLngLiteral>(
    () => ({ lat: 43.45, lng: -80.49 }),
    []
  );
  const options = useMemo<MapOptions>(
    () => ({
      mapId: "17fa4381e2fd3a624dbc2993",
      colorScheme: google.maps.ColorScheme.DARK,
      disableDefaultUI: true,
      clickableIcons: false,
    }),
    []
  );
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);
  const houses = useMemo(() => generateHouses(center), [center]);
  const fetchDirections = (house: LatLngLiteral) => {
    if (!office) return;

    const service = new google.maps.DirectionsService();
    service.route(
      {
        origin: house,
        destination: office,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          setDirections(result);
        }
      }
    );
  };

  const handleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className={cn("container", isMobile && "container-mobile")}>
      <div
        className={cn(
          "controls h-full z-10 flex flex-col gap-4 transition-[left,right,width] duration-200 ease-linear",
          !isSidebarOpen && !isMobile && "sm-controls",
          isMobile && "controls-full overflow-y-scroll"
        )}
      >
        <div className="flex justify-between items-center gap-2 w-full py-6 btm-border  mb-3">
          {!isMobile && (
            <div
              className="cursor-pointer order-1 p-2 hover:bg-slate-600 transition-all hover:rounded-full duration-300"
              onClick={handleSidebar}
            >
              {!isSidebarOpen && (
                <PanelLeftClose
                  size={18}
                  className="text-slate-500 hover:text-slate-200"
                />
              )}
              {isSidebarOpen && (
                <PanelLeftOpen
                  size={18}
                  className="text-slate-500 hover:text-slate-200"
                />
              )}
            </div>
          )}

          <Logo isSidebarOpen={isSidebarOpen} />
        </div>

        <div
          className={`flex flex-col gap-4 z-2 min-w-[276px] transition-transform duration-200 ease-linear ${
            isSidebarOpen ? "translate-x-0 opacity-100" : "slide-in"
          }`}
        >
          <h1 className="whitespace-nowrap">Commute?</h1>
          <Places
            setOffice={(position) => {
              setOffice(position);
              mapRef.current?.panTo(position);
            }}
          />
          {!office && <p>Enter the address of your office.</p>}
          {directions && <Distance leg={directions.routes[0].legs[0]} />}
        </div>
      </div>
      <div
        className={cn(
          "map transition-[left,right,width] duration-200 ease-linear",
          !isSidebarOpen && !isMobile && "small-screen-width",
          isMobile && isSidebarOpen && "map-full"
        )}
      >
        <GoogleMap
          zoom={10}
          center={center}
          mapContainerClassName="map-container"
          options={options}
          onLoad={onLoad}
        >
          {directions && (
            <DirectionsRenderer
              directions={directions}
              options={{
                polylineOptions: {
                  zIndex: 50,
                  strokeColor: "#1976D2",
                  strokeWeight: 5,
                },
              }}
            />
          )}

          {office && (
            <>
              <Marker
                position={office}
                icon="https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png"
              />

              <MarkerClusterer>
                {(clusterer) => (
                  <>
                    {houses.map((house, idx) => (
                      <Marker
                        key={idx}
                        position={house}
                        clusterer={clusterer}
                        onClick={() => fetchDirections(house)}
                      />
                    ))}
                  </>
                )}
              </MarkerClusterer>

              <Circle center={office} radius={15000} options={closeOptions} />
              <Circle center={office} radius={30000} options={middleOptions} />
              <Circle center={office} radius={45000} options={farOptions} />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

const defaultOptions = {
  strokeOpacity: 0.5,
  strokeWeight: 2,
  clickable: false,
  draggable: false,
  editable: false,
  visible: true,
};
const closeOptions = {
  ...defaultOptions,
  zIndex: 3,
  fillOpacity: 0.05,
  strokeColor: "#8BC34A",
  fillColor: "#8BC34A",
};
const middleOptions = {
  ...defaultOptions,
  zIndex: 2,
  fillOpacity: 0.05,
  strokeColor: "#FBC02D",
  fillColor: "#FBC02D",
};
const farOptions = {
  ...defaultOptions,
  zIndex: 1,
  fillOpacity: 0.05,
  strokeColor: "#FF5252",
  fillColor: "#FF5252",
};

const generateHouses = (position: LatLngLiteral) => {
  const _houses: Array<LatLngLiteral> = [];
  for (let i = 0; i < 100; i++) {
    const direction = Math.random() < 0.5 ? -2 : 2;
    _houses.push({
      lat: position.lat + Math.random() / direction,
      lng: position.lng + Math.random() / direction,
    });
  }
  return _houses;
};
