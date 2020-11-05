import React, { useEffect, useContext } from 'react';

import { UserContext } from '../context/UserContext';

import Layout from '../components/Layout';
import Timeline from '../components/activity/Timeline';

const Activity = () => {
  const { isIE, isEdge } = useContext(UserContext);

  useEffect(() => {
    document.title = 'Activity | Port Activity App';
  }, []);

  return (
    <Layout>
      <Timeline isIE={isIE} isEdge={isEdge} />
    </Layout>
  );
};

export default Activity;
