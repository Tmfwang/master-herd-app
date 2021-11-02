import { locationType } from "../../types";
import { useEffect } from "react";

interface GeolocatorMockProps {
  latestLocationUpdateCallback: (location: locationType) => void;
}

// This Geolocator can be used to mock GPS location when running the app on a PC web browser, as that does not support the normal Geolocation
const Geolocator: React.FC<GeolocatorMockProps> = ({
  latestLocationUpdateCallback,
}) => {
  useEffect(() => {
    setTimeout(function () {
      // Fires the callback (provided as prop) whenever the latest location updates
      latestLocationUpdateCallback({
        // Longitude in degrees.
        longitude: 17.43318,
        // Latitude in degrees.
        latitude: 68.43117,
        // Radius of horizontal uncertainty in metres, with 68% confidence.
        accuracy: 10,
        // Metres above sea level (or null).
        altitude: 10,
        // Vertical uncertainty in metres, with 68% confidence (or null).
        altitudeAccuracy: 10,
        // Deviation from true north in degrees (or null).
        bearing: 90,
        // Speed in metres per second (or null).
        speed: 10,
        // Time the location was produced, in milliseconds since the unix epoch.
        time: 2323232323,
      });
    }, 1000);
  }, []);

  return <div />;
};

export default Geolocator;
