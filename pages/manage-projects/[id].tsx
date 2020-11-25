import React, { ReactElement, useEffect } from 'react'
import { useRouter } from 'next/router';
import ManageProjects from '../../src/features/user/ManageProjects/screens'
import { useSession } from 'next-auth/client';
import { getAuthenticatedRequest } from '../../src/utils/apiRequests/api';
import GlobeContentLoader from '../../src/features/common/ContentLoaders/Projects/GlobeLoader';
import AccessDeniedLoader from '../../src/features/common/ContentLoaders/Projects/AccessDeniedLoader';
import Footer from '../../src/features/common/Layout/Footer';
import { withAuthenticationRequired } from '@auth0/auth0-react';

interface Props {

}

function ManageSingleProject({ }: Props): ReactElement {
  const [projectGUID, setProjectGUID] = React.useState(null);

  const [ready, setReady] = React.useState(false);
  const [session, loading] = useSession();

  const router = useRouter();

  const [accessDenied, setAccessDenied] = React.useState(false)
  const [setupAccess, setSetupAccess] = React.useState(false)

  useEffect(() => {
    if (router && router.query.id) {
      setProjectGUID(router.query.id);
      setReady(true);
    }
  }, [router]);


  const [project, setProject] = React.useState({})

  useEffect(() => {
    async function loadProject() {      
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}`, session).then((result) => {
        if (result.status === 401) {
          setAccessDenied(true)
          setSetupAccess(true)
        } else {
          setProject(result)
          setSetupAccess(true)
        }
      }).catch(() => {
        setAccessDenied(true)
        setSetupAccess(true)
      })
    }

    // ready is for router, loading is for session
    if (ready && !loading) {
      loadProject();
    }
  }, [ready, loading])

  if (accessDenied && setupAccess) {
    return (
      <>
        <AccessDeniedLoader />
        <Footer />
      </>
    )
  }

  // Showing error to other TPOs is left
  return setupAccess ? (ready && session && !accessDenied) ? (
    <>
      <ManageProjects GUID={projectGUID} session={session} project={project} />
      <Footer />
    </>
  ) : (<h2>NO Project ID FOUND</h2>) :
    (
      <>
        <GlobeContentLoader />
        <Footer />
      </>
    )
}

export default withAuthenticationRequired(ManageSingleProject, {
  // Show a message while the user waits to be redirected to the login page.
  onRedirecting: () => <div>Only Reforestation Organizations can access this page</div>,
});
