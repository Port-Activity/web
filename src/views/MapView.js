import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Page from '../components/ui/Page';

import MapContainer from '../components/map/MapContainer';
import { SeaChartMarkersProvider } from '../context/SeaChartMarkersContext';
import { SeaChartVesselsProvider } from '../context/SeaChartVesselsContext';

const MapView = () => {
  const { namespace, mapDefaultCoordinates, mapDefaultZoom } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  useEffect(() => {
    document.title = 'Map | Port Activity App';
  }, []);

  return (
    <Layout>
      <Page fullWidth title={t('Map')}>
        <SeaChartMarkersProvider>
          <SeaChartVesselsProvider>
            <MapContainer coordinatesString={mapDefaultCoordinates} zoom={mapDefaultZoom} />
          </SeaChartVesselsProvider>
        </SeaChartMarkersProvider>
      </Page>
    </Layout>
  );
};

export default MapView;
