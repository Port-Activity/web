import React, { useContext, useRef, useEffect, memo } from 'react';
import { useHistory, withRouter } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import { UserContext } from '../context/UserContext';
import { NotificationContext } from '../context/NotificationContext';

import useOnClickOutside from '../hooks/useOnClickOutside';

import { Badge } from 'antd';

import Icon from './ui/Icon';

import PortName from './PortName';
import BuildVersion from './BuildVersion';

const MenuVersion = styled(BuildVersion)`
  margin-top: ${({ theme }) => theme.sizing.gap_huge};
`;

const MenuWrapper = styled.nav`
  position: absolute;
  z-index: 50;
  left: 0;
  top: 0;
  width: 24rem;
  min-height: 100vh;
  height: 100%;
  overflow-y: auto;
  transform: ${props => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
  transition: ${({ theme }) => theme.transition.ease(0.1)};
  padding: ${({ theme }) => theme.sizing.gap_medium};
  background: ${({ theme }) => theme.color.white};
  box-shadow: ${props => (props.open ? props.theme.fx.box_shadow_right : 'none')};
`;

const MenuList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const MenuItem = styled.li`
  cursor: pointer;
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
  transition: ${({ theme }) => theme.transition.cubic(0.2)};
  &:hover {
    color: ${({ theme }) => theme.color.black};
  }
  &:last-child {
    margin-bottom: 0;
  }
  i {
    width: 24px;
    height: 24px;
    margin-right: ${({ theme }) => theme.sizing.gap_small};
  }
`;

const MenuLink = styled.span`
  border-bottom: 1px solid transparent;
  transition: ${({ theme }) => theme.transition.cubic(0.2)};
  ${MenuItem}:hover & {
    border-bottom: 1px solid ${({ theme }) => theme.color.grey_dark};
  }
`;

const MenuHeader = styled(PortName)`
  clear: both;
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
  a {
    color: inherit;
  }
`;

const Trigger = styled.div`
  cursor: pointer;
  width: 32px;
  height: 32px;
  margin-bottom: ${({ theme }) => theme.sizing.gap_medium};
  i {
    width: 32px;
    height: 32px;
    svg {
      fill: ${({ theme }) => theme.color.black};
    }
  }
`;

const NotificationsBadge = styled(Badge)`
  && {
    text-decoration: none;
    margin-left: ${({ theme }) => theme.sizing.gap_small};
  }
  .ant-badge-count {
    box-shadow: none;
    text-decoration: none;
  }
`;

const Menu = memo(props => {
  const { logout, namespace, user, modules, menuOpen, setMenuOpen } = useContext(UserContext);
  const { notificationCount } = useContext(NotificationContext);
  const { i18n } = useTranslation(namespace);
  const t = i18n.getFixedT(i18n.language, namespace);

  const menuRef = useRef();
  const history = useHistory();

  useEffect(() =>
    props.history.listen(() => {
      setMenuOpen(false);
    })
  );

  useOnClickOutside(menuRef, () => setMenuOpen(false));

  const handleLogout = () => {
    history.entries = [];
    history.index = -1;
    history.push('/');
    logout();
  };

  return (
    <MenuWrapper ref={menuRef} open={menuOpen} {...props}>
      <Trigger onClick={() => setMenuOpen(!menuOpen)}>
        <Icon type="close" />
      </Trigger>
      <MenuHeader />
      <MenuList>
        {modules.activity_module === 'enabled' && user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/')}>
            <Icon type="port" />
            <MenuLink>{t('Activity')}</MenuLink>
          </MenuItem>
        )}
        {modules.logistics_module === 'enabled' && user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/logistics')}>
            <Icon type="logistics" />
            <MenuLink>{t('Logistics')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/notifications')}>
            <Icon type="bell" />
            <MenuLink>{t('Notifications')}</MenuLink>
            <NotificationsBadge count={notificationCount} />
          </MenuItem>
        )}
        {user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/vessels')}>
            <Icon type="info" />
            <MenuLink>{t('Vessels')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/inbound-vessels')}>
            <Icon type="info" />
            <MenuLink>{t('Inbound vessels')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_port') && (
          <MenuItem onClick={() => history.push('/ports')}>
            <Icon type="info" />
            <MenuLink>{t('Other ports')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('view_vis_information') && (
          <MenuItem onClick={() => history.push('/vis-vessels')}>
            <Icon type="info" />
            <MenuLink>{t('VIS vessels')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.findIndex(e => e.includes('manage_user')) !== -1 && (
          <MenuItem onClick={() => history.push('/admin/users')}>
            <Icon type="profile" />
            <MenuLink>{t('Users')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_registration_code') && (
          <MenuItem onClick={() => history.push('/admin/register-codes')}>
            <Icon type="user-check" />
            <MenuLink>{t('Registration codes')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_permission') && (
          <MenuItem onClick={() => history.push('/admin/access-control')}>
            <Icon type="lock" />
            <MenuLink>{t('Access control')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_translation') && (
          <MenuItem onClick={() => history.push('/admin/string-translations')}>
            <Icon type="translate" />
            <MenuLink>{t('String translations')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_api_key') && (
          <MenuItem onClick={() => history.push('/admin/api-keys')}>
            <Icon type="key" />
            <MenuLink>{t('API keys')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_api_key') && (
          <MenuItem onClick={() => history.push('/admin/api-key-weights')}>
            <Icon type="key" />
            <MenuLink>{t('API key priorities')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('manage_setting') && (
          <MenuItem onClick={() => history.push('/admin/modules')}>
            <Icon type="module" />
            <MenuLink>{t('Modules')}</MenuLink>
          </MenuItem>
        )}
        {modules.activity_module === 'enabled' && user.permissions.includes('manage_port_call') && (
          <MenuItem onClick={() => history.push('/port-calls')}>
            <Icon type="port-call" />
            <MenuLink>{t('Port call timesheets')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('view_berth') && (
          <MenuItem onClick={() => history.push('/berths')}>
            <Icon type="info" />
            <MenuLink>{t('Berths')}</MenuLink>
          </MenuItem>
        )}
        {modules.queue_module === 'enabled' && user.permissions.includes('view_queue_slot_reservation') && (
          <MenuItem onClick={() => history.push('/queue-admin/admin-dashboard')}>
            <Icon type="info" />
            <MenuLink>{t('Queue - Just-In-Time-Arrival')}</MenuLink>
          </MenuItem>
        )}
        {modules.queue_module === 'enabled' && user.permissions.includes('view_own_queue_nomination') && (
          <MenuItem onClick={() => history.push('/queue/nominations')}>
            <Icon type="info" />
            <MenuLink>{t('Nominations')}</MenuLink>
          </MenuItem>
        )}
        {modules.queue_module === 'enabled' && user.permissions.includes('view_all_queue_nomination') && (
          <MenuItem onClick={() => history.push('/queue-admin/admin-nominations')}>
            <Icon type="info" />
            <MenuLink>{t('Admin nominations')}</MenuLink>
          </MenuItem>
        )}
        {modules.queue_module === 'enabled' && user.permissions.includes('view_queue_slot_reservation') && (
          <MenuItem onClick={() => history.push('/queue-admin/admin-slot-reservations')}>
            <Icon type="info" />
            <MenuLink>{t('Slot requests')}</MenuLink>
          </MenuItem>
        )}
        {modules.queue_module === 'enabled' && user.permissions.includes('view_berth_reservation') && (
          <MenuItem onClick={() => history.push('/queue-admin/admin-berth-reservations')}>
            <Icon type="info" />
            <MenuLink>{t('Berth reservations')}</MenuLink>
          </MenuItem>
        )}
        {modules.map_module === 'enabled' && user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/map')}>
            <Icon type="map" />
            <MenuLink>{t('Map')}</MenuLink>
          </MenuItem>
        )}
        {user.permissions.includes('basic_user_action') && (
          <MenuItem onClick={() => history.push('/help-page')}>
            <Icon type="info" />
            <MenuLink>{t('Help')}</MenuLink>
          </MenuItem>
        )}
        <MenuItem onClick={handleLogout}>
          <Icon type="logout" />
          <MenuLink>{t('Sign out')}</MenuLink>
        </MenuItem>
      </MenuList>
      <MenuVersion />
    </MenuWrapper>
  );
});

export default withRouter(Menu);
