"use client";
import React, { useState } from "react";
import {
  Map,
  Source,
  Layer,
  ViewState,
  MapLayerMouseEvent,
  FillLayer,
} from "react-map-gl";
import ReactMapGL from "react-map-gl";
// Giả sử namDinhGeoJSON là biến chứa dữ liệu GeoJSON của tỉnh Nam Định
import namDinhGeoJSON from "../vn.json";
import layerStyle from "../layer.json";
import textStyle from "../text-layer.json";
import type { FeatureCollection } from "geojson";

export function CustomMap() {
  const [viewState, setViewState] = useState<ViewState>({
    pitch: 0,
    bearing: 0,
    latitude: 16.047079,
    longitude: 108.20623,
    zoom: 5,
    padding: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },
  });
  const [id, setId] = useState<string>();
  const handleClick = (event: MapLayerMouseEvent) => {
    const { features } = event;
    const clickedFeature =
      features && features.find((f) => f.layer.id === "vn-layer");
    if (clickedFeature) {
      setId((clickedFeature.properties as any).id);
    }
  };

  return (
    <div className=" w-full h-full">
      <Map
        {...viewState}
        mapStyle="mapbox://styles/mapbox/streets-v11"
        mapboxAccessToken={
          "pk.eyJ1IjoibWFuaGh1bmczMTEiLCJhIjoiY2xzNXBhYXBvMHVvbzJpcnhqbXhuZmIzMSJ9.ltCJjUxoPqAjU1cKpdTdKQ" as string
        }
        onClick={handleClick}
        interactiveLayerIds={["vn-layer"]}
        onMoveEnd={({ viewState }) => setViewState(viewState)}
      >
        <Source type="geojson" data={namDinhGeoJSON as FeatureCollection}>
          <Layer {...(layerStyle as FillLayer)} />
          <Layer {...(textStyle as FillLayer)} />
        </Source>
      </Map>
    </div>
  );
};
