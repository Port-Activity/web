import React, { useContext, useRef, useState } from 'react';
import { Map, TileLayer, GeoJSON } from 'react-leaflet';
import { useTranslation } from 'react-i18next';
import hash from 'object-hash';
import moment from 'moment';
import { UserContext } from '../../context/UserContext';
import { SeaChartMarkersContext } from '../../context/SeaChartMarkersContext';
import { SeaChartVesselsContext } from '../../context/SeaChartVesselsContext';
import L from 'leaflet';
import './MapContainer.css';
import PageSearch from '../page/PageSearch';
import { debounce } from 'throttle-debounce';
import { useHistory, useLocation } from 'react-router-dom';
import vesselIconBlue from '../../images/icons/map/vessel-icon-blue.svg';
import vesselIconCyan from '../../images/icons/map/vessel-icon-cyan.svg';
import vesselIconPurple from '../../images/icons/map/vessel-icon-purple.svg';
import vesselIconGreen from '../../images/icons/map/vessel-icon-green.svg';
import vesselIconGray from '../../images/icons/map/vessel-icon-gray.svg';
import vesselIconBlack from '../../images/icons/map/vessel-icon-black.svg';
import vesselIconWhite from '../../images/icons/map/vessel-icon-white.svg';
import vesselIconRed from '../../images/icons/map/vessel-icon-red.svg';
import vesselIconOrange from '../../images/icons/map/vessel-icon-orange.svg';
import vesselIconYellow from '../../images/icons/map/vessel-icon-yellow.svg';
import { Alert, Layout } from 'antd';

// Required re-setup to make default point icon work
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

let options = {
  tileserver: '',
  smallIconsZoomRange: { start: 0, end: 12 },
  mediumIconsZoomRange: { start: 13, end: 17 },
  largeIconsZoomRange: { start: 18, end: 18 },
  smallMarkerIconPixelSize: 12,
  mediumMarkerIconPixelSize: 20,
  largeMarkerIconPixelSize: 28,
  markerIconSpacingPixels: 4,
  smallVesselIconPixelSize: 18,
  mediumVesselIconPixelSize: 42,
  largeVesselIconPixelSize: 58,
  smallVesselCourseIconPixelSize: 6,
  mediumVesselCourseIconPixelSize: 14,
  largeVesselCourseIconPixelSize: 22,
  vesselColorToIconMappings: {
    vessel_blue: vesselIconBlue,
    vessel_cyan: vesselIconCyan,
    vessel_purple: vesselIconPurple,
    vessel_green: vesselIconGreen,
    vessel_gray: vesselIconGray,
    vessel_black: vesselIconBlack,
    vessel_white: vesselIconWhite,
    vessel_red: vesselIconRed,
    vessel_orange: vesselIconOrange,
    vessel_yellow: vesselIconYellow,
    defaultColor: vesselIconGray,
  },
  initWithVesselDelayMilliSeconds: 1000,
  lineMarkerDefaultStyle: { color: '#000000', weight: 2, opacity: 1.0 },
  polygonMarkerDefaultStyle: { color: '#000000', weight: 2, opacity: 1.0, fillColor: '#8f8c8c', fillOpacity: 0.3 },
};

if (process.env.REACT_APP_MAP_TILE_SERVER) {
  options.tileserver = process.env.REACT_APP_MAP_TILE_SERVER;
}

const MapContainer = ({ coordinatesString, zoom }) => {
  const { namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);
  const { markers } = useContext(SeaChartMarkersContext);
  const { vessels } = useContext(SeaChartVesselsContext);
  const mapRef = useRef(null);
  const location = useLocation();
  const history = useHistory();
  const [searchResultsAlert, setSearchResultsAlert] = useState(null);
  const [searchResultsAlertDismissed, setSearchResultsAlertDismissed] = useState(false);

  let appliedCoordinates = coordinatesString === undefined ? '59.129089,14.373028' : coordinatesString;
  const [appliedZoom, setAppliedZoom] = useState(zoom === undefined ? 5 : zoom);

  const onEachMarkerFeature = (feature, layer) => {
    if (feature.properties && feature.properties.name) {
      if (feature.properties.description) {
        layer.bindPopup(`<div><h2>${t(feature.properties.name)}</h2>
          <div>${t(feature.properties.description)}</div></div> `);
      }
      layer.bindTooltip(` <div><h4>${t(feature.properties.name)}</h4></div> `, {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
      });
    }
  };

  const onEachVesselFeature = (feature, layer) => {
    if (feature.properties) {
      let formattedTimestamp = moment(feature.properties.location_timestamp).fromNow();
      layer.bindPopup(
        `<div><h2>${feature.properties.name}</h2>
        <div><b>${t('Type')}:</b> ${t(feature.properties.vessel_type_name)}</div>
        <div><b>${t('MMSI')}:</b> ${feature.properties.mmsi ? feature.properties.mmsi : t('Not available')}</div>
        <div><b>${t('IMO')}:</b> ${feature.properties.imo ? feature.properties.imo : t('Not available')}</div>
        <div><b>${t('Latitude')}:</b> ${feature.properties.latitude}</div>
        <div><b>${t('Longitude')}:</b> ${feature.properties.longitude}</div>
        <div><b>${t('Speed (knots)')}:</b> ${
          feature.properties.speed_knots ? feature.properties.speed_knots : t('Not available')
        }</div>
        <div><b>${t('Heading (degrees)')}:</b> ${
          feature.properties.heading_degrees ? feature.properties.heading_degrees : t('Not available')
        }</div>
        <div><b>${t('Course over ground (degrees)')}:</b> ${
          feature.properties.course_over_ground_degrees
            ? feature.properties.course_over_ground_degrees
            : t('Not available')
        }</div>
        <div><b>${t('Location timestamp')}:</b> ${formattedTimestamp}</div>
        </div>`
      );
      layer.bindTooltip(` <div><h4>${feature.properties.name}</h4></div> `, {
        permanent: false,
        direction: 'top',
        offset: [0, -6],
      });
    }
  };

  const markerIcon = feature => {
    let markerStyleClass = undefined;

    if (feature.properties.type) {
      switch (feature.properties.type) {
        case 'port':
          markerStyleClass = 'div-map-marker-port';
          break;
        case 'vis-sync-point':
          markerStyleClass = 'div-map-marker-vis-sync-point';
          break;
        case 'rta-point':
        case 'berth':
        case 'anchorage':
        default:
          markerStyleClass = 'div-map-marker-generic';
          break;
      }
    }

    const iconSize =
      appliedZoom >= options.smallIconsZoomRange.start && appliedZoom <= options.smallIconsZoomRange.end
        ? options.smallMarkerIconPixelSize
        : appliedZoom >= options.mediumIconsZoomRange.start && appliedZoom < options.mediumIconsZoomRange.end
        ? options.mediumMarkerIconPixelSize
        : options.largeMarkerIconPixelSize;

    return L.divIcon({
      html: ` <div class="${markerStyleClass}" style="background-color:${feature.properties.color};
        height:${iconSize}px;
        width:${iconSize}px;
        background-size:${iconSize - options.markerIconSpacingPixels}px;!important;"/>`,
      iconSize: [iconSize, iconSize],
      iconAnchor: [0, 0],
      className: 'map-marker-icon-class',
    });
  };

  const markerPointToLayer = (feature, latlng) => {
    return L.marker(latlng, {
      title: t(feature.properties.name),
      alt: t(feature.properties.description),
      icon: markerIcon(feature),
    });
  };

  const vesselIconProperties = feature => {
    const iconSizeStyle =
      appliedZoom >= options.smallIconsZoomRange.start && appliedZoom <= options.smallIconsZoomRange.end
        ? '-small'
        : appliedZoom >= options.mediumIconsZoomRange.start && appliedZoom < options.mediumIconsZoomRange.end
        ? '-medium'
        : '-large';

    const vesselIconSize =
      appliedZoom >= options.smallIconsZoomRange.start && appliedZoom <= options.smallIconsZoomRange.end
        ? options.smallVesselIconPixelSize
        : appliedZoom >= options.mediumIconsZoomRange.start && appliedZoom < options.mediumIconsZoomRange.end
        ? options.mediumVesselIconPixelSize
        : options.largeVesselIconPixelSize;

    const courseIconSize =
      appliedZoom >= options.smallIconsZoomRange.start && appliedZoom <= options.smallIconsZoomRange.end
        ? options.smallVesselCourseIconPixelSize
        : appliedZoom >= options.mediumIconsZoomRange.start && appliedZoom < options.mediumIconsZoomRange.end
        ? options.mediumVesselCourseIconPixelSize
        : options.largeVesselCourseIconPixelSize;

    let markerStyleClass = 'marker-image-vessel' + iconSizeStyle;
    let markerCourseStyleClass = 'marker-image-course-over-ground' + iconSizeStyle;
    let markerIconFile =
      options.vesselColorToIconMappings[feature.properties.marker_class] !== undefined
        ? options.vesselColorToIconMappings[feature.properties.marker_class]
        : options.vesselColorToIconMappings['defaultColor'];

    return {
      markerStyle: markerStyleClass,
      markerCourseStyle: markerCourseStyleClass,
      markerIconSize: vesselIconSize,
      courseIconSize: courseIconSize,
      courseIconOffset: (vesselIconSize - courseIconSize) / 2,
      markerIconFile: markerIconFile,
    };
  };

  const vesselIcon = feature => {
    let vesselMarkerProperties = vesselIconProperties(feature);

    let vesselRotationDegrees = feature.properties.heading_degrees ? feature.properties.heading_degrees : '0';

    let htmlContent = `<div class="div-map-marker-vessel">
      <img class="${vesselMarkerProperties.markerStyle}"
        src="${vesselMarkerProperties.markerIconFile}"
        style="transform:rotate(${vesselRotationDegrees}deg);
        height:${vesselMarkerProperties.markerIconSize}px;
        important;" />`;
    if (feature.properties.course_over_ground_degrees) {
      htmlContent += `<img class="${vesselMarkerProperties.markerCourseStyle}"
        style="transform:rotate(${feature.properties.course_over_ground_degrees}deg);
        height:${vesselMarkerProperties.courseIconSize}px;
        width:${vesselMarkerProperties.courseIconSize}px;
        top:${vesselMarkerProperties.courseIconOffset}px;
        left:${vesselMarkerProperties.courseIconOffset}px;
        important;" />`;
    }
    htmlContent += '</div>';

    return L.divIcon({
      html: htmlContent,
      iconSize: [vesselMarkerProperties.markerIconSize, vesselMarkerProperties.markerIconSize],
      iconAnchor: [vesselMarkerProperties.markerIconSize / 2, vesselMarkerProperties.markerIconSize / 2],
      className: 'map-vessel-icon-class',
    });
  };

  const vesselPointToLayer = (feature, latlng) => {
    let pointProperties = {
      title: feature.properties.name,
      alt: feature.properties.description,
      icon: vesselIcon(feature),
    };
    return L.marker(latlng, pointProperties);
  };

  const markerStyle = feature => {
    return feature.style
      ? feature.style
      : feature.geometry.type === 'Polygon'
      ? options.polygonMarkerDefaultStyle
      : options.lineMarkerDefaultStyle;
  };

  const createMarkersOverlay = () => {
    if (markers !== undefined) {
      return (
        <GeoJSON
          id="markers-layer"
          key={hash(markers)}
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
          key={hash(vessels)}
          data={vessels}
          onEachFeature={onEachVesselFeature}
          pointToLayer={vesselPointToLayer}
        />
      );
    }
  };

  const handleZoomEnd = () => {
    setAppliedZoom(mapRef.current.leafletElement.getZoom());
    mapRef.current.contextValue.map.eachLayer(function(layer) {
      if (layer.feature && layer.options.icon) {
        if (layer.options.icon.options.className === 'map-vessel-icon-class') {
          layer.setIcon(vesselIcon(layer.feature));
        } else if (layer.options.icon.options.className === 'map-marker-icon-class') {
          layer.setIcon(markerIcon(layer.feature));
        }
      }
    });
  };

  const evaluateSearchResultAlert = (searchString, matches) => {
    if (searchString.length === 0) {
      setSearchResultsAlert(null);
    } else if (
      matches.length === 0 &&
      (searchResultsAlert === null || searchResultsAlert.message !== t('No search results'))
    ) {
      setSearchResultsAlert({ message: t('No search results') });
    } else if (matches.length > 0) {
      let resultString =
        matches.length === 1 ? t('Found one vessel') : t('Found {{number}} vessels', { number: matches.length });
      if (searchResultsAlert === null || searchResultsAlert.message !== resultString) {
        setSearchResultsAlert({ message: resultString });
      }
    }
  };

  const doSearch = params => {
    let matches = [];
    mapRef.current.contextValue.map.eachLayer(function(layer) {
      if (
        params.search.length > 0 &&
        layer.feature &&
        layer.options.icon &&
        layer.options.icon.options.className === 'map-vessel-icon-class'
      ) {
        if (
          (layer.feature.properties.name &&
            layer.feature.properties.name.toLowerCase().includes(params.search.toLowerCase())) ||
          (layer.feature.properties.description &&
            layer.feature.properties.description.toLowerCase().includes(params.search.toLowerCase())) ||
          (layer.feature.properties.imo &&
            !isNaN(parseInt(params.search)) &&
            layer.feature.properties.imo.toString().includes(params.search)) ||
          (layer.feature.properties.mmsi &&
            !isNaN(parseInt(params.search)) &&
            layer.feature.properties.mmsi.toString().includes(params.search))
        ) {
          matches.push(layer);
        } else {
          layer.closeTooltip();
          layer.closePopup();
        }
      } else {
        layer.closeTooltip();
        layer.closePopup();
      }
    });

    if (matches.length === 1) {
      matches[0].openPopup();
    } else if (matches.length > 1) {
      matches.forEach(function(layer) {
        layer.openTooltip();
      });
    }
    evaluateSearchResultAlert(params.search, matches);
  };

  const debouncedSearch = debounce(500, doSearch);

  const handleSearchChange = e => {
    e.preventDefault();
    const searchParameters = {
      search: e.target.value,
    };
    history.replace(location.pathname + '?search=' + encodeURIComponent(searchParameters.search));
    setSearchResultsAlertDismissed(false);
    setSearchResultsAlert(null);
    debouncedSearch(searchParameters);
  };

  const constructSearchContentFromLocation = () => {
    const params = new URLSearchParams(location.search);
    if (params.get('search')) {
      const searchParameters = {
        search: params.get('search'),
      };
      debouncedSearch(searchParameters);
      return params.get('search');
    }
    return '';
  };

  return (
    // Disabling tap for Map is needed to support bound popups on Safari
    // (bug in leaflet, see https://github.com/Leaflet/Leaflet/issues/7255)
    <>
      <Layout style={{ backgroundColor: '#00000000' }}>
        <Layout.Sider width="60%" style={{ backgroundColor: '#00000000' }}>
          <PageSearch
            placeholder={t('Search vessel by name')}
            value={constructSearchContentFromLocation()}
            onChange={handleSearchChange}
          />
        </Layout.Sider>
        {searchResultsAlert !== null && !searchResultsAlertDismissed && (
          <Layout.Sider width="40%" style={{ backgroundColor: '#00000000' }}>
            <Alert
              message={searchResultsAlert.message}
              type="info"
              closable
              afterClose={() => setSearchResultsAlertDismissed(true)}
            />
          </Layout.Sider>
        )}
      </Layout>
      <Map ref={mapRef} center={appliedCoordinates.split(',')} zoom={appliedZoom} onzoomend={handleZoomEnd} tap={false}>
        <TileLayer
          url={options.tileserver + '/{z}/{x}/{y}.png'}
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {createMarkersOverlay()}
        {createVesselsOverlay()}
      </Map>
    </>
  );
};

export default MapContainer;
