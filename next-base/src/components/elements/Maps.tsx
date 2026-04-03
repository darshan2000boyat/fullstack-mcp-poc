"use client";

import { mapStyle } from "@/styles/mapStyle";
import { PageBlock } from "@/typings/blocks";
import { AdvancedMarker, Map, useApiIsLoaded } from "@vis.gl/react-google-maps";
import Image from "next/image";

// Documentation Link
// https://visgl.github.io/react-google-maps/docs/

const Maps = ({ block }: PageBlock) => {
  const isGoogleMapsLoaded = useApiIsLoaded();
  const userLocation: google.maps.LatLngLiteral = {
    lat: Number(block?.Latitude),
    lng: Number(block?.Longitude),
  };
  const mapCenter: google.maps.LatLngLiteral = {
    lat: Number(block?.Latitude),
    lng: Number(block?.Longitude),
  };

  if (!isGoogleMapsLoaded) return null;

  return (
    <div className=" text-black  h-[75vh] w-full">
      <Map
        // mapId="" ADD THIS MAP ID ONCE CREATED IN GOOGLE CONSOLE
        mapTypeId={google.maps.MapTypeId.ROADMAP} // ROADMAP or SATELLITE
        styles={mapStyle}
        defaultZoom={13}
        zoomControlOptions={{
          position: google.maps.ControlPosition.RIGHT_CENTER,
        }}
        defaultCenter={mapCenter}
        scrollwheel={false}
        mapTypeControl={false}
        streetViewControl={false}
        scaleControl
        zoomControl
      >
        {/* <Marker
          title="Maps"
          position={userLocation}
          icon={{
            url: "/images/marker.png",
            scaledSize: new google.maps.Size(25, 25),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(0, 0),
          }}
          animation={google.maps.Animation.DROP}
        /> */}
        <AdvancedMarker position={userLocation} title="Maps">
          <Image
            src="/images/marker.png"
            alt="Marker Icon"
            width={25}
            height={25}
          />
        </AdvancedMarker>
      </Map>
    </div>
  );
};

export default Maps;
