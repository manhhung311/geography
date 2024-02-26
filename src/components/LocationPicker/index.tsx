import LocationPin from "../LocationPin";
import { useDebounce } from "../../useDebounce";
import { LoadingOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Dropdown, Input, MenuProps, Tooltip } from "antd";
import axios from "axios";
import "maplibre-gl/dist/maplibre-gl.css";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { Marker, NavigationControl, Popup, ScaleControl } from "react-map-gl";
import Map, { MapRef } from "react-map-gl/maplibre";
export type Location = {
  lon: number;
  lat: number;
};
export type ShortLocationType = {
  name: string;
  lon: number;
  lat: number;
};
type AddressType = {
  town: string;
  district: string;
  state_district: string;
  state: string;
  postcode: number | string;
  country: string;
  country_code: string;
};
type LocationType = {
  address?: AddressType;
  class?: string;
  importance?: number;
  boundingbox: Array<number>;
  display_name: string;
  lon: number;
  lat: number;
  osm_id: number;
  type: string;
  osm_type: string;
  place_id: number;
};
interface ILocationPickerProps {
  name?: string | null;
  coordinates?: Location | null;
  readonly?: boolean;
  onEndSelect?: () => void | undefined;
  onSelectLocation?: (locationName?: string, locationGeo?: Location) => void;
}

function LocationPicker({
  name,
  coordinates,
  readonly,
  onEndSelect,
  onSelectLocation,
}: ILocationPickerProps) {
  const MAPTILER_API_KEY = "h96m56BzC5pkbmuwF9WL";
  const MAPTILER_NATIVE_URL =
    "https://api.maptiler.com/maps/aba3bb9f-009a-4720-b2d6-93a906132a0d/style.json";
  const SEARCH_API_KEY = "pk.30f33a6ade65a47c92caca3108ec94e0";
  const SEARCH_BASE_URL = "https://eu1.locationiq.com/v1";
  const INITIAL_VIEW_STATE = {
    longitude: 0,
    latitude: 0,
    zoom: 1,
    maxZoom: 20,
    pitch: 0,
    bearing: 0,
    maxPitch: 85,
  };
  const defaultResult = {
    key: "unknown",
    label: <p className="text-xs line-clamp-2">{"Unknown"}</p>,
  };
  const mapRef = useRef<MapRef>(null);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [currentLocation, setCurrentLocation] = useState<string | undefined>();
  const [currentLocationGeo, setCurrentLocationGeo] = useState<
    Location | undefined
  >();
  const [searchResultItems, setSearchResultItems] = useState<
    MenuProps["items"]
  >([defaultResult]);
  const [keyword, setKeyword] = useState<string>("");
  const debounceSearchQuery = useDebounce(keyword, 500) as string;

  useEffect(() => {
    if (debounceSearchQuery) {
      handleSearchByKeyword(debounceSearchQuery);
    }
    return () => setSearchResultItems([defaultResult]);
  }, [debounceSearchQuery]);

  useEffect(() => {
    if (name) {
      if (coordinates) {
        setKeyword(name);
        setCurrentLocation(name);
        setCurrentLocationGeo(coordinates);
        handleFlyToLocation(coordinates, name);
      } else {
        handleExactSearchByLocation(name);
      }
    }
    return () => {
      handleResetLocation();
    };
  }, [name, coordinates]);

  const handleResetLocation = () => {
    setKeyword("");
    setCurrentLocation(undefined);
    setCurrentLocationGeo(undefined);
    handleFlyToLocation();
  };

  const handleSearchByKeyword = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SEARCH_BASE_URL}/search`, {
        params: {
          key: SEARCH_API_KEY,
          q: searchQuery,
          limit: 5,
          format: "json",
          "accept-language": "en",
        },
      });
      setSearchResultItems(
        response.data?.map((item: LocationType) => ({
          key: item?.osm_id || item?.place_id,
          label: (
            <div
              onClick={(e) => {
                e.preventDefault();
                const { display_name, lon, lat } = item;
                setKeyword(display_name);
                setCurrentLocation(display_name);
                setCurrentLocationGeo({ lon, lat });
                handleFlyToLocation({ lon, lat }, display_name);
              }}
            >
              <p className="text-xs line-clamp-2" title={item.display_name}>
                {item.display_name}
              </p>
            </div>
          ),
        }))
      );
    } catch (error) {
      setSearchResultItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleExactSearchByLocation = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SEARCH_BASE_URL}/search`, {
        params: {
          key: SEARCH_API_KEY,
          q: searchQuery,
          limit: 5,
          format: "json",
          "accept-language": "en",
        },
      });

      if (response && response.data) {
        const { display_name, lon, lat } = response.data[0];
        setKeyword(display_name);
        setCurrentLocation(display_name);
        setCurrentLocationGeo({ lon, lat });
        handleFlyToLocation({ lon, lat }, display_name);
      }
    } catch (error) {
      handleResetLocation();
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByCoordinates = async (
    longitude: number,
    latitude: number
  ) => {
    try {
      setLoading(true);
      const response = await axios.get(`${SEARCH_BASE_URL}/reverse`, {
        params: {
          key: SEARCH_API_KEY,
          lon: longitude,
          lat: latitude,
          format: "json",
          "accept-language": "en",
        },
      });
      const { display_name, lon, lat } = response.data;
      setKeyword(display_name);
      setCurrentLocation(display_name);
      setCurrentLocationGeo({ lat: Number(lat), lon: Number(lon) });
      handleFlyToLocation({ lat: Number(lat), lon: Number(lon) }, display_name);
    } catch (error) {
      handleResetLocation();
    } finally {
      setLoading(false);
    }
  };

  const handleFlyToLocation = (
    locationGeo?: Location,
    locationName?: string
  ) => {
    if (locationGeo && locationName) {
      mapRef.current?.flyTo({
        center: [locationGeo.lon, locationGeo.lat],
        zoom: locationName.split(",").length + 8,
      });
    } else {
      mapRef.current?.flyTo({
        center: [0, 0],
        zoom: 1,
      });
    }
  };

  const handleGetUserMomentLocation = () => {
    navigator.geolocation.getCurrentPosition((position) =>
      handleSearchByCoordinates(
        position.coords.longitude,
        position.coords.latitude
      )
    );
  };

  const handleSubmitLocation = () => {
    if (
      !readonly &&
      onSelectLocation &&
      currentLocation &&
      currentLocationGeo
    ) {
      onSelectLocation(currentLocation, currentLocationGeo);
    }
  };

  const handleEndSelect = () => {
    handleResetLocation();
    if (onEndSelect) onEndSelect();
  };

  return (
    <div className="flex flex-col h-full w-full">
      <div className="flex items-center justify-between gap-3 pb-4">
        <div className="flex-1 w-full">
          <Dropdown
            menu={{ items: searchResultItems }}
            placement="bottom"
            trigger={["click"]}
            getPopupContainer={(triggerNode: HTMLElement) =>
              triggerNode.parentNode as HTMLElement
            }
            rootClassName="w-full max-w-[320px] custom-dropdown"
          >
            <div className="relative">
              <Input
                type="search"
                value={keyword}
                placeholder={"trans.myProfile.location.search"}
                onChange={(e) => setKeyword(e.target.value)}
                className="pr-8"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-neutrals-60">
                {isLoading ? <LoadingOutlined /> : <SearchOutlined />}
              </span>
            </div>
          </Dropdown>
        </div>
        <Tooltip
          title={"Vị trí của bạn"}
          color="rgba(0, 0, 0, 0.8)"
          placement="bottom"
        >
          <Button
            onClick={handleGetUserMomentLocation}
            className="flex w-32 items-center gap-2"
          >
            <span className="!hidden lg:!inline text-black">
              vị trí
            </span>
          </Button>
        </Tooltip>
      </div>
      <Map
        ref={mapRef}
        mapStyle={`${MAPTILER_NATIVE_URL}?key=${MAPTILER_API_KEY}`}
        initialViewState={INITIAL_VIEW_STATE}
        attributionControl={false}
        dragRotate={false}
        style={{ width: "100%", minHeight: "600px", flex: "1" }}
        onClick={(e) => {
          e.originalEvent.stopPropagation();
          handleSearchByCoordinates(Number(e.lngLat.lng), Number(e.lngLat.lat));
        }}
        onLoad={() => handleFlyToLocation(currentLocationGeo, currentLocation)}
      >
        {currentLocation && currentLocationGeo && (
          <Marker
            key={currentLocation}
            longitude={currentLocationGeo.lon}
            latitude={currentLocationGeo.lat}
            anchor="bottom"
          >
            <div className="animate-bounce">
              <LocationPin />
            </div>
          </Marker>
        )}
        {currentLocationGeo && (
          <Popup
            anchor="top"
            longitude={Number(currentLocationGeo.lon)}
            latitude={Number(currentLocationGeo.lat)}
            closeButton={false}
            closeOnClick={false}
          >
            <p className="text-sm">{currentLocation}</p>
          </Popup>
        )}
        <ScaleControl position="bottom-left" />
        <NavigationControl position="bottom-right" />
      </Map>
      {readonly ? null : (
        <div className="flex flex-wrap sm:flex-nowrap gap-3 mt-4">
          <Button
            block
            size="large"
            loading={isLoading}
            disabled={!currentLocation || !currentLocationGeo}
            className="font-semibold bg-blue-600 text-white"
            onClick={handleSubmitLocation}
          >
            {"Lựa Chọn"}
          </Button>
          <Button
            block
            size="large"
            onClick={handleEndSelect}
          >
            {"Đóng"}
          </Button>
        </div>
      )}
    </div>
  );
}
export default LocationPicker;
