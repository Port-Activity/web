import React, { useContext } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import { UserContext } from '../../context/UserContext';
import { SeaChartMarkersContext } from '../../context/SeaChartMarkersContext';
import { SeaChartVesselsContext } from '../../context/SeaChartVesselsContext';
import L from 'leaflet';
import './MapContainer.css';

// Required re-setup to make default point icon work
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

let options = {
  tileserver: '',
};

if (process.env.REACT_APP_MAP_TILE_SERVER) {
  options.tileserver = process.env.REACT_APP_MAP_TILE_SERVER;
}

const MapContainer = ({ coordinatesString, zoom }) => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const { markers } = useContext(SeaChartMarkersContext);
  const { vessels } = useContext(SeaChartVesselsContext);

  let appliedCoordinates = coordinatesString === undefined ? '59.129089,14.373028' : coordinatesString;
  let appliedZoom = zoom === undefined ? '5' : zoom;

  const onEachMarkerFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name && feature.properties.description) {
      layer.bindPopup(` <div><h2>${feature.properties.name}</h2>
        <div>${feature.properties.description}</div></div> `);
      layer.bindTooltip(` <div><h4>${feature.properties.name}</h4></div> `, {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
      });
    }
  };

  const onEachVesselFeature = (feature, layer) => {
    if (feature.properties) {
      layer.bindPopup(`<div><h2>${feature.properties.name}</h2>
      <div><b>${t('MMSI')}:</b> ${feature.properties.mmsi}</div>
      <div><b>${t('IMO')}:</b> ${feature.properties.imo}</div>
      <div><b>${t('Latitude')}:</b> ${feature.properties.latitude}</div>
      <div><b>${t('Longitude')}:</b> ${feature.properties.longitude}</div>
      <div><b>${t('Speed (knots)')}:</b> ${feature.properties.speed_knots}</div>
      <div><b>${t('Heading (degrees)')}:</b> ${feature.properties.heading_degrees}</div>
      </div> `);
      layer.bindTooltip(` <div><h4>${feature.properties.name}</h4></div> `, {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
      });
    }
  };

  const markerPointToLayer = (feature, latlng) => {
    let icon = L.divIcon({
      html:
        ' <div class="div-map-marker-generic" style="background-color:' +
        feature.properties.color +
        '"; ! important; /> ',
      iconSize: [12, 12],
      iconAnchor: [6, 0],
      className: 'map-marker-icon-class',
    });

    return L.marker(latlng, {
      title: feature.properties.name,
      alt: feature.properties.description,
      icon: icon,
    });
  };

  const vesselPointToLayer = (feature, latlng) => {
    let pointProperties = {
      title: feature.properties.name,
      alt: feature.properties.description,
    };

    let markerStyleClass = 'div-map-marker-vessel-other';

    switch (feature.properties.marker_class) {
      case 'timeline':
        markerStyleClass = 'div-map-marker-vessel-timeline';
        break;
      case 'tug':
        markerStyleClass = 'div-map-marker-vessel-tug';
        break;
      case 'cargo':
        markerStyleClass = 'div-map-marker-vessel-cargo';
        break;
      default:
        markerStyleClass = 'div-map-marker-vessel-other';
        break;
    }

    let htmlContent = `<div class="${markerStyleClass}" style=`;
    if (feature.properties.color) {
      htmlContent += `background-color:${feature.properties.color};`;
    }
    htmlContent += `transform:rotate(${feature.properties.heading_degrees}deg); important;"/>`;

    let icon = L.divIcon({
      html: htmlContent,
      iconSize: [32, 32],
      iconAnchor: [12, 0],
      className: 'map-marker-icon-class',
    });
    pointProperties.icon = icon;

    return L.marker(latlng, pointProperties);
  };

  const markerStyle = feature => {
    return { color: feature.properties.color ? feature.properties.color : '#f54275' };
  };

  const createMarkersOverlay = () => {
    if (markers !== undefined) {
      return (
        <GeoJSON
          id="markers-layer"
          data={markers}
          onEachFeature={onEachMarkerFeature}
          pointToLayer={markerPointToLayer}
          style={markerStyle}
        />
      );
    }
  };

  const createVesselsOverlay = () => {
    if (vessels !== undefined) {
      return (
        <GeoJSON
          id="vessels-layer"
          data={vessels}
          onEachFeature={onEachVesselFeature}
          pointToLayer={vesselPointToLayer}
        />
      );
    }
  };

  return (
    <Map center={appliedCoordinates.split(',')} zoom={appliedZoom}>
      <TileLayer
        url={options.tileserver + '/tile/{z}/{x}/{y}.png'}
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {createMarkersOverlay()}
      {createVesselsOverlay()}
    </Map>
  );
};

export default MapContainer;
