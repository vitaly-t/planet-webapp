import React, { ReactElement } from 'react';
import dynamic from 'next/dynamic';
import MuiButton from '../../common/InputTypes/MuiButton';
import ProjectLoader from '../../common/ContentLoaders/Projects/ProjectLoader';
import { useTranslation } from 'next-i18next';
import LazyLoad from 'react-lazyload';
import NotFound from '../../../../public/assets/images/NotFound';
import Header from '../components/projects/Header';
import SearchBar from '../components/projects/SearchBar';
import { useDebouncedEffect } from '../../../utils/useDebouncedEffect';
import Explore from '../components/maps/Explore';
import { ParamsContext } from '../../common/Layout/QueryParamsContext';
import { UserPropsContext } from '../../../../src/features/common/Layout/UserPropsContext';

interface Props {
  projects: any;
  showProjects: Boolean;
  setShowProjects: Function;
  setsearchedProjects: any;
}

const ProjectSnippet = dynamic(() => import('../components/ProjectSnippet'), {
  loading: () => <ProjectLoader />,
});

function ProjectsList({
  projects,
  showProjects,
  setsearchedProjects,
}: Props): ReactElement {
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  const isMobile = screenWidth <= 767;
  const { embed, showProjectList, email } = React.useContext(ParamsContext);
  const { isImpersonationModeOn } = React.useContext(UserPropsContext);
  const isEmbed = embed === 'true';
  const [scrollY, setScrollY] = React.useState(0);
  const [hideSidebar, setHideSidebar] = React.useState(isEmbed);
  const { t, ready } = useTranslation(['donate', 'country', 'maps']);

  const featuredList = process.env.NEXT_PUBLIC_FEATURED_LIST;

  const showFeaturedList =
    featuredList === 'false' || featuredList === '0' ? false : true;

  const [selectedTab, setSelectedTab] = React.useState('all');
  const [searchMode, setSearchMode] = React.useState(false);
  React.useEffect(() => {
    showFeaturedList ? setSelectedTab('featured') : null;
  }, []);

  const [searchValue, setSearchValue] = React.useState('');
  const [trottledSearchValue, setTrottledSearchValue] = React.useState('');

  useDebouncedEffect(
    () => {
      setTrottledSearchValue(searchValue);
    },
    1000,
    [searchValue]
  );

  const searchRef = React.useRef(null);

  function getProjects(projects: Array<any>, type: string) {
    if (type === 'featured') {
      return projects.filter(
        (project: { properties: { isFeatured: boolean } }) =>
          project.properties.isFeatured === true
      );
    } else if (type === 'all') {
      return projects;
    }
  }

  function getSearchProjects(projects: Array<any>, keyword: string) {
    let resultProjects = [];
    if (keyword !== '') {
      const keywords = keyword.split(/[\s\-.,+]+/);
      resultProjects = projects.filter(function (project) {
        const found = keywords.every(function (word) {
          const searchWord = word
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          const projectName = project.properties.name
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase();
          const projectLocation = project.properties.location
            ? project.properties.location
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          const projectTpoName = project.properties.tpo.name
            ? project.properties.tpo.name
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          const projectCountry = project.properties.country
            ? t('country:' + project.properties.country.toLowerCase())
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()
            : '';
          //searching for name
          return (
            projectName.indexOf(searchWord) > -1 ||
            //searching for location
            (projectLocation && projectLocation.indexOf(searchWord) > -1) ||
            //searching for tpo name
            (projectTpoName && projectTpoName.indexOf(searchWord) > -1) ||
            //searching for country name
            (projectCountry && projectCountry.indexOf(searchWord) > -1)
          );
        });
        return found;
      });
      setsearchedProjects(resultProjects);
      return resultProjects;
    } else {
      setsearchedProjects(projects);
    }
  }

  const allProjects = React.useMemo(
    () => getProjects(projects, 'all'),
    [projects]
  );

  const searchProjectResults = React.useMemo(
    () => getSearchProjects(projects, trottledSearchValue),
    [trottledSearchValue, projects]
  );

  const featuredProjects = React.useMemo(
    () => getProjects(projects, 'featured'),
    [projects]
  );

  const NoProjectFound = (props: any) => {
    return ready ? (
      <div className={'projectNotFound'}>
        <LazyLoad>
          <NotFound className={'projectNotFoundImage'} />
          <h5 style={{ color: 'var(--primary-font-color' }}>
            {t('donate:noProjectsFound')}
          </h5>
        </LazyLoad>
      </div>
    ) : null;
  };

  const toggleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  return ready ? (
    <>
      <Explore />
      {isEmbed && isMobile && showProjectList === undefined && (
        <MuiButton
          onClick={toggleSidebar}
          variant={hideSidebar ? 'outlined' : 'contained'}
          className="toggleButton"
        >
          {hideSidebar ? t('maps:showProjectList') : t('maps:hideProjectList')}
        </MuiButton>
      )}
      {showProjects ? (
        <div
          style={{ transform: `translate(0,${scrollY}px)` }}
          className={isEmbed ? 'embedContainer' : 'container'}
          onTouchMove={(event) => {
            if (isMobile) {
              if (event.targetTouches[0].clientY < (screenHeight * 2) / 8) {
                setScrollY(event.targetTouches[0].clientY);
              } else {
                setScrollY((screenHeight * 2) / 9);
              }
            }
          }}
        >
          {!(isEmbed && showProjectList === 'false') && (
            <div
              className={`sidebar ${
                isMobile && hideSidebar && showProjectList !== 'true'
                  ? 'mobile-hidden'
                  : ''
              } ${isImpersonationModeOn ? `impersonationTop` : ''}`}
            >
              <div className={`header ${isMobile ? 'header--mobile' : ''}`}>
                {isMobile && (!hideSidebar || showProjectList === 'true') && (
                  <div className={'dragBar'}></div>
                )}
                {searchMode ? (
                  <SearchBar
                    setSearchValue={setSearchValue}
                    setSearchMode={setSearchMode}
                    searchValue={searchValue}
                    searchRef={searchRef}
                  />
                ) : (
                  <Header
                    showFeaturedList={showFeaturedList}
                    setSelectedTab={setSelectedTab}
                    selectedTab={selectedTab}
                    setSearchMode={setSearchMode}
                    projects={projects}
                  />
                )}
              </div>
              {/* till here is header */}
              <div className={'projectsContainer'}>
                {trottledSearchValue !== '' ? (
                  searchProjectResults && searchProjectResults.length > 0 ? (
                    searchProjectResults.map((project: any) => (
                      <ProjectSnippet
                        key={project.properties.id}
                        project={project.properties}
                        editMode={false}
                      />
                    ))
                  ) : (
                    <NoProjectFound />
                  )
                ) : selectedTab === 'all' ? (
                  allProjects && allProjects.length > 0 ? (
                    allProjects.map((project: any) => (
                      <ProjectSnippet
                        key={project.properties.id}
                        project={project.properties}
                        editMode={false}
                      />
                    ))
                  ) : (
                    <NoProjectFound />
                  )
                ) : featuredProjects && featuredProjects.length > 0 ? (
                  featuredProjects.map((project: any) => (
                    <ProjectSnippet
                      key={project.properties.id}
                      project={project.properties}
                      editMode={false}
                    />
                  ))
                ) : (
                  <NoProjectFound />
                )}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </>
  ) : (
    <></>
  );
}

export default ProjectsList;
