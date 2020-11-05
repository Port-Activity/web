import React, { useState, useRef, useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { fromEvent } from 'file-selector';
import { saveAs } from 'file-saver';
import * as Sentry from '@sentry/browser';

import i18n from '../../i18n';

import { API_URL } from '../../utils/constants';

import { UserContext } from '../../context/UserContext';

import { message, Modal } from 'antd';
import Text from 'antd/lib/typography/Text';

import Button from '../ui/Button';
import Icon from '../ui/Icon';
import Table from '../ui/Table';

import PageAction from '../page/PageAction';
import PageSearch from '../page/PageSearch';

const { confirm } = Modal;

const RowInput = styled.input`
  border: 1px solid ${({ theme }) => theme.color.grey_light};
  border-radius: ${({ theme }) => theme.style.border_radius};
  padding: ${({ theme }) => theme.sizing.gap_small};
  color: ${({ theme }) => theme.color.grey_dark};
  background: ${({ theme }) => theme.color.white};
  min-width: 100%;
  min-height: 2.8rem;
`;

const Translations = () => {
  const { apiCall, namespace } = useContext(UserContext);
  const { t } = useTranslation(namespace);

  const inputFile = useRef(null);

  const [strings, setStrings] = useState([]);
  const [updated, setUpdated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  const lang = 'en';

  // TODO: set namespace and language selectable
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/translations/${namespace}/${lang}`)
      .then(r => r.json())
      .then(data => {
        setStrings(data);
        setLoading(false);
      })
      .catch(e => {
        Sentry.captureException(e);
        message.error(e, 4);
      });
  }, [namespace]);

  const loadTranslations = async () => {
    const res = await fetch(`${API_URL}/translations/${namespace}/${lang}`).catch(e => {
      Sentry.captureException(e);
      message.error(e, 4);
    });
    if (res) {
      const data = await res.json();
      setStrings(data);
      return data;
    }
    return [];
  };

  let stringsArr = Object.keys(strings).map(key => [key, strings[key]]);
  stringsArr.sort((a, b) => a[0].localeCompare(b[0], undefined, { sensitivity: 'base' }));
  let data = [];
  stringsArr.forEach((e, i) => {
    data.push({
      id: i,
      key: e[0],
      value: e[1],
    });
  });

  if (search !== '') {
    const searchResult = data.filter(
      string =>
        string.key.toUpperCase().includes(search.toUpperCase()) ||
        string.value.toUpperCase().includes(search.toUpperCase())
    );
    data = searchResult;
  }

  const handleChange = (r, text) => {
    const objIndex = updated.findIndex(obj => obj.key === r.key);
    const updatedObj = { key: r.key, ...updated[objIndex], value: text };
    if (strings[r.key] !== text) {
      const newItems = [...updated.slice(0, objIndex), updatedObj, ...updated.slice(objIndex + 1)];
      setUpdated(newItems);
    } else {
      let newItems = [...updated];
      newItems.splice(objIndex, 1);
      setUpdated(newItems);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    if (updated && updated.length) {
      await apiCall('put', `translations/${namespace}/${lang}`, { updated: updated });
      // TODO: investigate if translations could be loaded in single call (current list & i18next translations)
      await loadTranslations();
      await i18n.reloadResources();
      setUpdated([]);
    }
    setLoading(false);
  };

  const handleUpload = async data => {
    setLoading(true);
    if (data && data.length) {
      await apiCall('post', `translations/${namespace}/${lang}`, { translations: data });
      // TODO: investigate if translations could be loaded in single call (current list & i18next translations)
      await loadTranslations();
      await i18n.reloadResources();
    }
    setLoading(false);
  };

  const handleDownload = async () => {
    const res = await loadTranslations();
    if (res) {
      const json = JSON.stringify(
        res,
        Object.keys(res).sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' })),
        2
      );
      const blob = await new Blob([json], {
        type: 'application/json; charset=utf-8',
      });
      saveAs(blob, `translations_${namespace}_${lang}.json`);
    }
  };

  const uploadFile = async evt => {
    try {
      const files = await fromEvent(evt);
      if (files && files[0]) {
        // TODO: Replace fileReader with Blob.text() when all browsers are supported
        const reader = new FileReader();
        reader.addEventListener('loadend', function() {
          processFile(reader.result);
        });
        return reader.readAsText(files[0]);
      }
    } catch (e) {
      Sentry.captureException(e);
      message.error(t('Could not upload translations file: {{message}}', { message: e.message }));
    }
  };

  const processFile = async data => {
    try {
      if (data) {
        // Check that file contains data and parse
        const json = data ? JSON.parse(data) : {};
        const translations = Object.entries(json).reduce((acc, pair) => {
          const [key, value] = pair;
          if (typeof key === 'string' && typeof value === 'string') {
            acc.push({
              key: key,
              value: value,
            });
          }
          return acc;
        }, []);
        if (translations && translations.length) {
          return confirm({
            title: t('Are you sure you want to upload translations?'),
            content: t('The current translations ({{namespace}} / {{lang}}) will be replaced with this one', {
              namespace: namespace,
              lang: lang,
            }),
            okType: 'danger',
            onOk() {
              handleUpload(translations);
            },
            onCancel() {},
          });
        }
      }
    } catch (e) {
      Sentry.captureException(e);
      return message.error(t('Could not upload translations file: {{message}}', { message: e.message }));
    }
    message.error(t('Invalid translations file: No valid translations found'));
  };

  const columns = [
    {
      title: t('Text'),
      dataIndex: 'key',
      key: 'string',
      width: '40%',
      render: (text, record) => {
        if (record.key === record.value) {
          return <Text>{text}</Text>;
        } else {
          return <Text strong>{text} *</Text>;
        }
      },
    },
    {
      title: t('Translation'),
      dataIndex: 'value',
      key: 'translation',
      width: '60%',
      render: (text, record) => (
        <RowInput defaultValue={record.value} onChange={e => handleChange(record, e.target.value)} />
      ),
    },
  ];

  return (
    <>
      <PageSearch placeholder={t('Search translations')} onChange={e => setSearch(e.target.value)} />
      <PageAction>
        <Button link onClick={handleDownload} style={{ marginLeft: 16 }}>
          <Icon type="download" />
          {t('Download current translations')}
        </Button>
        <Button link onClick={() => inputFile.current.click()}>
          <Icon type="upload" />
          {t('Upload new translations')}
          <input
            type="file"
            id="file"
            ref={inputFile}
            style={{ display: 'none' }}
            accept="application/json"
            onChange={e => uploadFile(e)}
            onClick={e => (e.target.value = null)}
          />
        </Button>
      </PageAction>
      <Table
        rowKey="id"
        pagination={{ hideOnSinglePage: true }}
        columns={columns}
        loading={loading}
        dataSource={data}
        footer={() => (
          <>
            <Text strong>* </Text>
            <Text>Text was translated.</Text>
          </>
        )}
      />
      <Button onClick={handleSave}>{t('Save translations')}</Button>
    </>
  );
};

export default Translations;
