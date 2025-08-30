import React, { useState, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';
import './RehabCenters.css';

const containerStyle = {
  width: '100%',
  height: '500px'
};

const center = {
  lat: 12.9716,
  lng: 77.5946
};

const rehabCenters = [
  { id: 1, name: "City Rehab Center", position: { lat: 12.9716, lng: 77.5946 }, address: "123 Main St" },
  { id: 2, name: "Downtown Recovery", position: { lat: 12.9758, lng: 77.6055 }, address: "456 Oak Ave" },
  { id: 3, name: "Sunshine Rehabilitation", position: { lat: 12.9658, lng: 77.5863 }, address: "789 Pine Rd" }
];

const RehabCenters = () => {
  const navigate = useNavigate();
  const [selectedCenter, setSelectedCenter] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);

  // Get user's current location
  const getLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          if (map) {
            map.panTo({
              lat: position.coords.latitude,
              lng: position.coords.longitude
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, [map]);

  const onLoad = useCallback((map) => {
    setMap(map);
    getLocation();
  }, [getLocation]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <div className="rehab-centers-page">
      <header className="page-header">
        <button onClick={() => navigate(-1)} className="back-button">
          &larr; Back to Dashboard
        </button>
        <h1>Find Rehabilitation Centers</h1>
        <button onClick={getLocation} className="location-button">
          Find My Location
        </button>
      </header>

      <main>
        <LoadScript
          googleMapsApiKey="AIzaSyC-3pSl3bkiV0R6CvF-sij84lpHTy3WvSU"
          loadingElement={<div className="map-loading">Loading Map...</div>}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation || center}
            zoom={13}
            onLoad={onLoad}
            onUnmount={onUnmount}
          >
            {/* User location marker */}
            {userLocation && (
              <Marker
                position={userLocation}
                icon={{
                  url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                  scaledSize: new window.google.maps.Size(32, 32)
                }}
                title="Your Location"
              />
            )}

            {/* Rehab center markers */}
            {rehabCenters.map(center => (
              <Marker
                key={center.id}
                position={center.position}
                onClick={() => setSelectedCenter(center)}
                title={center.name}
              />
            ))}

            {/* Info window for selected center */}
            {selectedCenter && (
              <InfoWindow
                position={selectedCenter.position}
                onCloseClick={() => setSelectedCenter(null)}
              >
                <div className="info-window">
                  <h3>{selectedCenter.name}</h3>
                  <p>{selectedCenter.address}</p>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedCenter.position.lat},${selectedCenter.position.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="directions-link"
                  >
                    Get Directions
                  </a>
                </div>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>

        <div className="centers-list">
          <h2>Nearby Rehabilitation Centers</h2>
          <ul>
            {rehabCenters.map(center => (
              <li key={center.id} onClick={() => setSelectedCenter(center)}>
                <h3>{center.name}</h3>
                <p>{center.address}</p>
                <button className="list-directions-button">
                  View on Map
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
};

export default RehabCenters;