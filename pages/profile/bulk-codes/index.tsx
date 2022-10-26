import React, { ReactElement } from 'react';
import UserLayout from '../../../src/features/common/Layout/UserLayout/UserLayout';
import BulkCodes, { BulkCodeSteps } from '../../../src/features/user/BulkCodes';
import Head from 'next/head';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function BulkCodePage(): ReactElement {
  const { t, ready } = useTranslation('me');
  return (
    <UserLayout>
      <Head>
        <title>{ready ? t('bulkCodesTitle') : ''}</title>
      </Head>
      <BulkCodes step={BulkCodeSteps.SELECT_METHOD} />
    </UserLayout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['me'])),
    },
  };
}
