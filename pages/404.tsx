import Custom404Image from '../public/assets/images/Custom404Image';
import { useRouter } from 'next/router';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

interface Props {
  initialized: Boolean;
}

export default function Custom404(initialized: Props) {
  const styles = {
    width: '100vw',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  };
  const router = useRouter();

  return (
    <>
      {initialized ? (
        <div style={styles}>
          <h2>{router.query.error}</h2>
          <div style={{ width: '300px', height: '175px' }}>
            <Custom404Image />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(
        locale,
        [
          'bulkCodes',
          'common',
          'country',
          'donate',
          'donationLink',
          'editProfile',
          'giftfunds',
          'leaderboard',
          'managePayouts',
          'manageProjects',
          'maps',
          'me',
          'planet',
          'planetcash',
          'redeem',
          'registerTrees',
          'tenants',
          'treemapper',
        ],
        null,
        ['en', 'de', 'fr', 'es', 'it', 'pt-BR', 'cs']
      )),
    },
  };
}
