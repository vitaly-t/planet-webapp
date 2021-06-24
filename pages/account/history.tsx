import React, { ReactElement } from 'react';
import i18next from '../../i18n';
import styles from '../../src/features/user/Account/styles/AccountHistory.module.scss';
import AccountHeader from '../../src/features/common/Layout/Header/AccountHeader';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import TopProgressBar from '../../src/features/common/ContentLoaders/TopProgressBar';
import History from '../../src/features/user/Account/screens/History';
import AccountFooter from '../../src/features/common/Layout/Footer/AccountFooter';
import { UserPropsContext } from '../../src/features/common/Layout/UserPropsContext';

const { useTranslation } = i18next;

interface Props {}

function AccountHistory({}: Props): ReactElement {
  const { t } = useTranslation(['me']);
  const { token, contextLoaded } = React.useContext(UserPropsContext);
  const [progress, setProgress] = React.useState(0);
  const [isDataLoading, setIsDataLoading] = React.useState(false);
  const [filter, setFilter] = React.useState(null);
  const [paymentHistory, setpaymentHistory] = React.useState();
  const [accountingFilters, setaccountingFilters] = React.useState();

  async function fetchPaymentHistory(next = false) {
    setIsDataLoading(true);
    setProgress(70);
    if (next && paymentHistory._links.next) {
      const newPaymentHistory = await getAuthenticatedRequest(
        paymentHistory._links.next,
        token
      );
      setpaymentHistory({
        ...paymentHistory,
        items: [...paymentHistory.items, ...newPaymentHistory.items],
        _links: newPaymentHistory._links,
      });
      setProgress(100);
      setIsDataLoading(false);
      setTimeout(() => setProgress(0), 1000);
    } else {
      if (filter === null) {
        const paymentHistory = await getAuthenticatedRequest(
          '/app/paymentHistory?limit=15',
          token
        );
        setpaymentHistory(paymentHistory);
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
        setaccountingFilters(paymentHistory._filters);
      } else {
        const paymentHistory = await getAuthenticatedRequest(
          `${
            filter
              ? accountingFilters[filter] + '&limit=15'
              : '/app/paymentHistory?limit=15'
          }`,
          token
        );
        setpaymentHistory(paymentHistory);
        setProgress(100);
        setIsDataLoading(false);
        setTimeout(() => setProgress(0), 1000);
      }
    }
  }

  React.useEffect(() => {
    if (contextLoaded && token) fetchPaymentHistory();
  }, [filter, contextLoaded, token]);

  const HistoryProps = {
    filter,
    setFilter,
    isDataLoading,
    accountingFilters,
    paymentHistory,
    fetchPaymentHistory,
  };

  return (
    <>
      {progress > 0 && (
        <div className={styles.topLoader}>
          <TopProgressBar progress={progress} />
        </div>
      )}
      <AccountHeader page={'history'} title={t('me:myAccount')} />
      <History {...HistoryProps} />

      <AccountFooter />
    </>
  );
}

export default AccountHistory;
