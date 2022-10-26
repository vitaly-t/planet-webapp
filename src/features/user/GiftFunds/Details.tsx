import React, { useContext } from 'react';
import { UserPropsContext } from '../../common/Layout/UserPropsContext';
import styles from './GiftFunds.module.scss';
import i18next from '../../../../i18n';

const { useTranslation } = i18next;
const Details = () => {
  const { user } = useContext(UserPropsContext);
  const { t, ready } = useTranslation('giftfunds');

  return (
    ready &&
    user.planetCash && (
      <div className={styles.allGiftFundscontainer}>
        {user.planetCash.giftFunds.map((gift, index) => (
          <div className={styles.container} key={index}>
            <div className={styles.container_heading}>
              <b>
                {user.planetCash?.country}/{user.planetCash?.currency}{' '}
                {t('title')}
              </b>
            </div>
            <hr />
            <div className={styles.container_details}>
              <div className={styles.project}>
                <b>{t('project')}</b>
                <p>{gift.project}</p>
              </div>

              <div className={styles.unit}>
                <b>{t('units')}</b>
                <p>{Number(gift.openUnits / 100).toFixed(2)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  );
};

export default Details;
