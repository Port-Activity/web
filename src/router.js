import React, { useContext } from 'react';
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom';

import { UserContext } from './context/UserContext';
import { NotificationProvider } from './context/NotificationContext';
import { ConsigneeNotificationProvider } from './context/ConsigneeNotificationContext';

import Loader from './components/ui/Loader';

import Authenticate from './views/Authenticate';
import Activity from './views/Activity';
import Logistics from './views/Logistics';
import Notifications from './views/Notifications';
import Vessels from './views/vessels/Vessels';
import VesselTimestamps from './views/vessels/VesselTimestamps';
import VesselTimestamp from './views/vessels/VesselTimestamp';
import InboundVessels from './views/inbound_vessels/InboundVessels';
import Ports from './views/ports/Ports';
import VisVessels from './views/vis/VisVessels';
import VisSentTextMessages from './views/vis/VisSentTextMessages';
import VisReceivedTextMessages from './views/vis/VisReceivedTextMessages';
import VisSentVoyagePlans from './views/vis/VisSentVoyagePlans';
import VisReceivedVoyagePlans from './views/vis/VisReceivedVoyagePlans';
import VisSendTextMessage from './views/vis/VisSendTextMessage';
import VisSendRta from './views/vis/VisSendRta';
import VisNotifications from './views/vis/VisNotifications';
import VisServiceFind from './views/vis/VisServiceFind';
import VisServiceConfiguration from './views/vis/VisServiceConfiguration';
import VisVoyagePlanView from './views/vis/VisVoyagePlanView';
import AdminUsers from './views/admin/AdminUsers';
import AdminRegisterCodes from './views/admin/AdminRegisterCodes';
import AdminAccessControl from './views/admin/AdminAccessControl';
import AdminTranslations from './views/admin/AdminTranslations';
import AdminModules from './views/admin/AdminModules';
import AdminApiKeys from './views/admin/AdminApiKeys';
import AdminPortCallList from './views/admin/AdminPortCallList';
import AdminPortCallTimesheet from './views/admin/AdminPortCallTimesheet';
import ProfilePage from './views/ProfilePage';
import NotFound from './views/NotFound';
import ResetPassword from './views/ResetPassword';
import PrivacyPolicy from './views/PrivacyPolicy';
import PrivacyPolicyPage from './views/PrivacyPolicyPage';
import HelpPage from './views/HelpPage';
import Nominations from './views/queue/Nominations';
import Berths from './views/berths/Berths';
import AdminBerthReservations from './views/queue_admin/AdminBerthReservations';
import AdminSlotReservations from './views/queue_admin/AdminSlotReservations';
import AdminNominations from './views/queue_admin/AdminNominations';
import AdminDashboard from './views/queue_admin/AdminDashboard';
import AdminQueueSettings from './views/queue_admin/AdminQueueSettings';
import AdminApiKeyWeights from './views/admin/AdminApiKeyWeights';
import MapView from './views/MapView';

const Router = () => {
  const { verifyingSession, modules, user } = useContext(UserContext);

  if (verifyingSession) {
    return <Loader />;
  }

  if (user) {
    if (user.permissions.includes('basic_user_action')) {
      return (
        <BrowserRouter>
          <NotificationProvider>
            <Switch>
              {modules && modules.activity_module === 'disabled' && <Redirect exact from="/" to="/notifications" />}
              {modules && modules.activity_module === 'enabled' && <Route path="/" exact component={Activity} />}
              {modules && modules.logistics_module === 'enabled' && (
                <Route path="/logistics" exact component={Logistics} />
              )}
              <Route path="/notifications" exact component={Notifications} />
              <Route path="/vessels" exact component={Vessels} />
              <Route path="/inbound-vessels" exact component={InboundVessels} />
              {user.permissions.includes('manage_port') && <Route path="/ports" component={Ports} />}
              {user.permissions.includes('manage_port_call') && (
                <Route path="/vessels/vessel-timestamps/:imo" component={VesselTimestamps} />
              )}
              {user.permissions.includes('manage_port_call') && (
                <Route path="/vessels/vessel-timestamp/:id" component={VesselTimestamp} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels" exact component={VisVessels} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/sent-text-messages/:service_id" component={VisSentTextMessages} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/received-text-messages/:service_id" component={VisReceivedTextMessages} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/sent-voyage-plans/:service_id" component={VisSentVoyagePlans} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/received-voyage-plans/:service_id" component={VisReceivedVoyagePlans} />
              )}
              {user.permissions.includes('send_vis_text_message') && (
                <Route path="/vis-vessels/send-text-message/:service_id" component={VisSendTextMessage} />
              )}
              {user.permissions.includes('send_vis_rta') && (
                <Route path="/vis-vessels/send-rta/:service_id" component={VisSendRta} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/vis-notifications" exact component={VisNotifications} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/vis-service-find" exact component={VisServiceFind} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/vis-service-configuration" exact component={VisServiceConfiguration} />
              )}
              {user.permissions.includes('view_vis_information') && (
                <Route path="/vis-vessels/voyage-plan-view" exact component={VisVoyagePlanView} />
              )}
              {user.permissions.findIndex(e => e.includes('manage_user')) !== -1 && (
                <Route path="/admin/users" exact component={AdminUsers} />
              )}
              {user.permissions.includes('manage_registration_code') && (
                <Route path="/admin/register-codes" exact component={AdminRegisterCodes} />
              )}
              {user.permissions.includes('manage_permission') && (
                <Route path="/admin/access-control" exact component={AdminAccessControl} />
              )}
              {user.permissions.includes('manage_translation') && (
                <Route path="/admin/string-translations" exact component={AdminTranslations} />
              )}
              {user.permissions.includes('manage_api_key') && (
                <Route path="/admin/api-keys" exact component={AdminApiKeys} />
              )}
              {modules && modules.activity_module === 'enabled' && user.permissions.includes('manage_port_call') && (
                <Route path="/port-calls" exact component={AdminPortCallList} />
              )}
              {modules && modules.activity_module === 'enabled' && user.permissions.includes('manage_port_call') && (
                <Route path="/admin/port-calls/:id" component={AdminPortCallTimesheet} />
              )}
              {user.permissions.includes('manage_setting') && (
                <Route path="/admin/modules" exact component={AdminModules} />
              )}
              {user.permissions.includes('view_berth') && <Route path="/berths" component={Berths} />}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_own_queue_nomination') && (
                  <Route path="/queue/nominations" exact component={Nominations} />
                )}
              {modules && modules.queue_module === 'enabled' && user.permissions.includes('view_berth_reservation') && (
                <Route path="/queue-admin/admin-berth-reservations" exact component={AdminBerthReservations} />
              )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_queue_slot_reservation') && (
                  <Route path="/queue-admin/admin-slot-reservations" exact component={AdminSlotReservations} />
                )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_all_queue_nomination') && (
                  <Route path="/queue-admin/admin-nominations" exact component={AdminNominations} />
                )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_queue_slot_reservation') && (
                  <Route path="/queue-admin/admin-dashboard" exact component={AdminDashboard} />
                )}
              {modules && modules.queue_module === 'enabled' && user.permissions.includes('manage_setting') && (
                <Route path="/queue-admin/admin-queue-settings" component={AdminQueueSettings} />
              )}
              {user.permissions.includes('manage_api_key') && (
                <Route path="/admin/api-key-weights" exact component={AdminApiKeyWeights} />
              )}
              {modules && modules.map_module === 'enabled' && <Route path="/map" exact component={MapView} />}
              <Route path="/profile" exact component={ProfilePage} />
              <Route path="/privacy-policy" exact component={PrivacyPolicyPage} />
              <Route path="/help-page" exact component={HelpPage} />
              <Route component={NotFound} />
            </Switch>
          </NotificationProvider>
        </BrowserRouter>
      );
    } else if (user.role.includes('consignee')) {
      return (
        <BrowserRouter>
          <ConsigneeNotificationProvider>
            <Switch>
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_own_queue_nomination') && (
                  <Redirect exact from="/" to="/queue/nominations" />
                )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_own_queue_nomination') && (
                  <Route path="/queue/nominations" exact component={Nominations} />
                )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_queue_slot_reservation') && (
                  <Route path="/queue-admin/admin-dashboard" exact component={AdminDashboard} />
                )}
              {modules &&
                modules.queue_module === 'enabled' &&
                user.permissions.includes('view_queue_slot_reservation') && (
                  <Route path="/queue-admin/admin-slot-reservations" exact component={AdminSlotReservations} />
                )}
              {modules && modules.queue_module === 'enabled' && user.permissions.includes('view_berth_reservation') && (
                <Route path="/queue-admin/admin-berth-reservations" exact component={AdminBerthReservations} />
              )}
              <Route path="/profile" exact component={ProfilePage} />
              <Route path="/privacy-policy" exact component={PrivacyPolicyPage} />
              <Route path="/help-page" exact component={HelpPage} />
              <Route component={NotFound} />
            </Switch>
          </ConsigneeNotificationProvider>
        </BrowserRouter>
      );
    }
  } else {
    return (
      <BrowserRouter>
        <Switch>
          <Route path="/privacy-policy" exact component={PrivacyPolicy} />
          <Route path="/reset-password" exact component={ResetPassword} />
          <Route component={Authenticate} />
        </Switch>
      </BrowserRouter>
    );
  }
};

export default Router;
