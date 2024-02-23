"use client";
import React, { useEffect, useState } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import Map from "react-map-gl";
import Pin from "./pin";
import "../mapbox-gl.css";
import { Post } from "@/app/post/[id]/page";

const NamDinhMap = ({
  latitude,
  longitude,
  post,
}: {
  latitude?: number;
  longitude?: number;
  post?: Post[];
}) => {
  const [viewport, setViewport] = useState({
    width: "100%",
    height: 400,
    latitude: latitude || 20.4388, // Vĩ độ trung tâm của Nam Định
    longitude: longitude || 106.1621, // Kinh độ trung tâm của Nam Định
    zoom: 11,
  });

  const [landmarks, setLandmarks] = useState<any[]>();

  useEffect(() => {
    if (post) {
      setLandmarks(
        post.map((item) => {
          return {
            latitude: item.location.latitude,
            longitude: item.location.longitude,
            image: item.location.image,
            name: item.location.name,
            id: item._id,
          };
        })
      );
    }
  }, [post]);

  return (
    <div className="flex w-full h-full overflow-hidden">
      <Map
        {...viewport}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={
          "pk.eyJ1IjoibWFuaGh1bmczMTEiLCJhIjoiY2xzNXBhYXBvMHVvbzJpcnhqbXhuZmIzMSJ9.ltCJjUxoPqAjU1cKpdTdKQ" as string
        }
        onMoveEnd={(nextViewport: any) => setViewport(nextViewport)}
      >
        {landmarks?.map((landmark, index) => (
          <Marker
            key={index}
            latitude={landmark.latitude}
            longitude={landmark.longitude}
          >
            <Pin
              size={40}
              image={`/uploads/${landmark.image}`}
              id={landmark.id}
            />
          </Marker>
        ))}
      </Map>
    </div>
  );
};

export default NamDinhMap;
