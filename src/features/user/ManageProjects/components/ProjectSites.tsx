import React, { ReactElement } from 'react';
import styles from './../StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import dynamic from 'next/dynamic';
import { WebMercatorViewport } from 'react-map-gl';
import ReactMapboxGl, { GeoJSONLayer, Source, Layer } from 'react-mapbox-gl';
import * as turf from '@turf/turf';
import TrashIcon from '../../../../../public/assets/images/icons/manageProjects/Trash';
import {
  deleteAuthenticatedRequest,
  getAuthenticatedRequest,
  postAuthenticatedRequest,
  putAuthenticatedRequest,
} from '../../../../utils/apiRequests/api';
import EditIcon from '../../../../../public/assets/images/icons/manageProjects/Pencil';
import { makeStyles } from '@mui/styles';
import { Fade, Modal, MenuItem } from '@mui/material';
import { ThemeContext } from '../../../../theme/themeContext';
import themeProperties from '../../../../theme/themeProperties';
import { ErrorHandlingContext } from '../../../common/Layout/ErrorHandlingContext';
import { UserPropsContext } from '../../../common/Layout/UserPropsContext';

const MapStatic = ReactMapboxGl({
  interactive: false,
});

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectGUID: String;
  handleReset: Function;
  token: any;
  projectDetails: object;
}

const Map = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => <p></p>,
});

export default function ProjectSites({
  handleBack,
  token,
  handleNext,
  projectGUID,
  handleReset,
  projectDetails,
}: Props): ReactElement {
  const { t, ready } = useTranslation(['manageProjects']);
  const { theme } = React.useContext(ThemeContext);
  const [features, setFeatures] = React.useState([]);
  const { register, handleSubmit, errors, control } = useForm();
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const [geoJsonError, setGeoJsonError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [openModal, setOpenModal] = React.useState(false);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { impersonatedEmail } = React.useContext(UserPropsContext);

  const useStylesAutoComplete = makeStyles({
    root: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    },
  });
  const classes = useStylesAutoComplete();

  const [geoLocation, setgeoLocation] = React.useState<Object>();
  const defaultSiteDetails = {
    name: '',
    status: '',
    geometry: {},
  };

  // Assigning defaultSiteDetails as default
  const [siteDetails, setSiteDetails] = React.useState(defaultSiteDetails);
  const [siteList, setSiteList] = React.useState<
    Array<{
      id: String;
      name: String;
      status: String;
      geometry: Object;
    }>
  >([]);

  const changeSiteDetails = (e: any) => {
    setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
  };

  const [geoJson, setGeoJson] = React.useState(null);
  const defaultMapCenter = [36.96, -28.5];
  const defaultZoom = 1.4;
  const [viewport, setViewPort] = React.useState({
    height: 320,
    width: 200,
    center: defaultMapCenter,
    zoom: [defaultZoom],
  });
  const [style, setStyle] = React.useState({
    version: 8,
    sources: {},
    layers: [],
  });

  const RASTER_SOURCE_OPTIONS = {
    type: 'raster',
    tiles: [
      'https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    ],
    tileSize: 128,
  };

  const [showForm, setShowForm] = React.useState(true);

  const [editMode, seteditMode] = React.useState(false);

  const handleModalClose = () => {
    seteditMode(false);
    setOpenModal(false);
  };

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
    geoLocation,
  };

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(ready ? t('manageProjects:resetMessage') : '');
    }
  });

  const uploadProjectSite = (data: any) => {
    if (geoJson && geoJson.features.length !== 0) {
      setIsUploadingData(true);

      const submitData = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };

      if (!data.name) return;
      postAuthenticatedRequest(
        `/app/projects/${projectGUID}/sites`,
        submitData,
        token,
        impersonatedEmail,
        handleError
      )
        .then((res) => {
          if (!res.code) {
            const temp = siteList;
            const submitData = {
              id: res.id,
              name: res.name,
              geometry: res.geometry,
              status: res.status,
            };
            temp.push(submitData);
            setSiteList(temp);
            setGeoJson(null);
            setFeatures([]);
            setIsUploadingData(false);
            setShowForm(false);
            setErrorMessage('');
          } else {
            if (res.code === 404) {
              setIsUploadingData(false);
              setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
            } else {
              setIsUploadingData(false);
              setErrorMessage(res.message);
            }
          }
        })
        .catch((err) => {
          setIsUploadingData(false);
          setErrorMessage(err);
        });
    } else {
      setErrorMessage(ready ? t('manageProjects:polygonRequired') : '');
    }
  };

  const uploadProjectSiteNext = (data: any) => {
    uploadProjectSite(data);
    handleNext();
  };

  const deleteProjectSite = (id: any) => {
    setIsUploadingData(true);
    deleteAuthenticatedRequest(
      `/app/projects/${projectGUID}/sites/${id}`,
      token,
      impersonatedEmail,
      handleError
    ).then((res) => {
      if (res !== 404) {
        const siteListTemp = siteList.filter((item) => item.id !== id);
        setSiteList(siteListTemp);
        setIsUploadingData(false);
      }
    });
  };

  const status = [
    {
      label: ready
        ? projectDetails.purpose === 'trees'
          ? t('manageProjects:siteStatusPlanting')
          : t('manageProjects:siteStatusNotYetprotected')
        : '',
      value:
        projectDetails.purpose === 'trees' ? 'planting' : 'not yet protected',
    },
    {
      label: ready
        ? projectDetails.purpose === 'trees'
          ? t('manageProjects:siteStatusPlanted')
          : t('manageProjects:siteStatusPartiallyprotected')
        : '',
      value:
        projectDetails.purpose === 'trees' ? 'planted' : 'partially protected',
    },
    {
      label: ready
        ? projectDetails.purpose === 'trees'
          ? t('manageProjects:siteStatusBarren')
          : t('manageProjects:siteStatusFullyprotected')
        : '',
      value: projectDetails.purpose === 'trees' ? 'barren' : 'fully protected',
    },
    {
      label: ready
        ? projectDetails.purpose === 'trees'
          ? t('manageProjects:siteStatusReforestation')
          : ''
        : '',
      value: projectDetails.purpose === 'trees' ? 'reforestation' : '',
    },
  ];

  React.useEffect(() => {
    // Fetch sites of the project
    if (projectGUID)
      getAuthenticatedRequest(
        `/app/profile/projects/${projectGUID}?_scope=sites`,
        token,
        impersonatedEmail,
        {},
        handleError,
        '/profile'
      ).then((result) => {
        const geoLocation = {
          geoLatitude: result.geoLatitude,
          geoLongitude: result.geoLongitude,
        };
        setgeoLocation(geoLocation);

        if (result.sites.length > 0) {
          setShowForm(false);
        }
        setSiteList(result.sites);
      });
  }, [projectGUID]);

  const [siteGUID, setSiteGUID] = React.useState();

  const editSite = (site: any) => {
    const defaultSiteDetails = {
      name: site.name,
      status: site.status,
      geometry: {},
    };

    const collection = {
      type: 'FeatureCollection',
      features: [
        {
          geometry: site.geometry,
          properties: {},
          type: 'Feature',
        },
      ],
    };

    setGeoJson(collection);
    setSiteDetails(defaultSiteDetails);
    setSiteGUID(site.id);
    seteditMode(true);
    setOpenModal(true);
  };

  const EditProps = {
    openModal,
    handleModalClose,
    changeSiteDetails,
    siteDetails,
    errorMessage,
    status,
    geoJsonProp: geoJson,
    ready,
    projectGUID,
    setSiteList,
    token,
    setFeatures,
    seteditMode,
    siteGUID,
    siteList,
  };

  return ready ? (
    <div className={styles.stepContainer}>
      {editMode && <EditSite {...EditProps} />}

      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        <div className={styles.formField}>
          {siteList
            .filter((site) => {
              return site.geometry !== null;
            })
            .map((site) => {
              const bbox = turf.bbox(site.geometry);
              const { longitude, latitude, zoom } = new WebMercatorViewport(
                viewport
              ).fitBounds(
                [
                  [bbox[0], bbox[1]],
                  [bbox[2], bbox[3]],
                ],
                {
                  padding: {
                    top: 50,
                    bottom: 50,
                    left: 50,
                    right: 50,
                  },
                }
              );

              return (
                <div
                  key={site.id}
                  className={`${styles.formFieldHalf}`}
                  style={{ marginLeft: '10px' }}
                >
                  <div className={styles.mapboxContainer}>
                    <div className={styles.uploadedMapName}>{site.name}</div>
                    <div className={styles.uploadedMapStatus}>
                      {status
                        .find((e) => site.status == e.value)
                        ?.label.toUpperCase()}
                    </div>
                    <button
                      id={'trashIconProjS'}
                      onClick={() => {
                        deleteProjectSite(site.id);
                      }}
                      className={styles.uploadedMapDeleteButton}
                    >
                      <TrashIcon color={'#000'} />
                    </button>
                    <div
                      id={'edit'}
                      onClick={() => {
                        editSite(site);
                      }}
                      className={styles.uploadedMapEditButton}
                    >
                      <EditIcon color={'#000'} />
                    </div>
                    <MapStatic
                      {...viewport}
                      center={[longitude, latitude]}
                      zoom={[zoom]}
                      style={style} // eslint-disable-line
                      containerStyle={{
                        height: 200,
                        width: 320,
                      }}
                    >
                      <Source
                        id="satellite_source"
                        tileJsonSource={RASTER_SOURCE_OPTIONS}
                      />
                      <Layer
                        type="raster"
                        id="satellite_layer"
                        sourceId="satellite_source"
                      />
                      <GeoJSONLayer
                        data={site.geometry}
                        fillPaint={{
                          'fill-color': '#fff',
                          'fill-opacity': 0.2,
                        }}
                        linePaint={{
                          'line-color': '#68B030',
                          'line-width': 2,
                        }}
                      />
                    </MapStatic>
                  </div>
                </div>
              );
            })}
        </div>

        {showForm ? (
          <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
            <div className={styles.formField}>
              <div className={styles.formFieldHalf} data-test-id="siteName">
                <MaterialTextField
                  inputRef={register({
                    required: {
                      value: true,
                      message: t('manageProjects:siteNameValidation'),
                    },
                  })}
                  label={t('manageProjects:siteName')}
                  variant="outlined"
                  name="name"
                  onChange={changeSiteDetails}
                  defaultValue={siteDetails.name}
                />
                {errors.name && (
                  <span className={styles.formErrors}>
                    {errors.name.message}
                  </span>
                )}
              </div>
              <div style={{ width: '20px' }}></div>
              <div className={styles.formFieldHalf} data-test-id="siteStatus">
                <Controller
                  as={
                    <MaterialTextField
                      label={t('manageProjects:siteStatus')}
                      variant="outlined"
                      name="status"
                      onChange={changeSiteDetails}
                      select
                      value={siteDetails.status}
                    >
                      {status.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          classes={{
                            // option: classes.option,
                            root: classes.root,
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MaterialTextField>
                  }
                  name="status"
                  rules={{
                    required: t('manageProjects:selectProjectStatus'),
                  }}
                  control={control}
                  defaultValue={siteDetails.status ? siteDetails.status : ''}
                />
                {errors.status && (
                  <span className={styles.formErrors}>
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            {geoLocation && <Map {...MapProps} />}

            <button
              id="projSiteSaveandAdd"
              onClick={handleSubmit(uploadProjectSite)}
              className={styles.projSiteSaveandAdd}
            >
              <p className={styles.inlineLinkButton}>
                {t('manageProjects:saveAndAddSite')}
              </p>
            </button>
          </div>
        ) : (
          <button
            id={'manageProjAddSite'}
            onClick={() => {
              setShowForm(true);
              setGeoJson(null);
              setSiteDetails(defaultSiteDetails);
              setSiteGUID(null);
              seteditMode(false);
              setOpenModal(false);
            }}
            className={styles.formFieldLarge}
          >
            <p className={styles.inlineLinkButton}>
              {t('manageProjects:addSite')}
            </p>
          </button>
        )}

        {errorMessage && errorMessage !== '' ? (
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
        ) : null}

        <div className={styles.formField} style={{ marginTop: '10px' }}>
          <div className={`${styles.formFieldHalf}`}>
            <button onClick={handleBack} className="secondaryButton">
              <BackArrow />
              <p>{t('manageProjects:backToAnalysis')}</p>
            </button>
          </div>
          <div style={{ width: '20px' }}></div>
          <div className={`${styles.formFieldHalf}`}>
            <button
              onClick={handleSubmit(uploadProjectSiteNext)}
              className="primaryButton"
              style={{ width: '169px' }}
              data-test-id="projSitesCont"
            >
              {isUploadingData ? (
                <div className={styles.spinner}></div>
              ) : (
                t('manageProjects:saveAndContinue')
              )}
            </button>
          </div>
          <div className={styles.formFieldHalf}>
            <button
              onClick={handleNext}
              className="primaryButton"
              style={{ width: '89px', marginRight: '40px', marginLeft: '12px' }}
            >
              {t('manageProjects:skip')}
            </button>
          </div>
        </div>
      </form>
    </div>
  ) : (
    <></>
  );
}

interface EditSiteProps {
  openModal: boolean;
  handleModalClose: Function;
  changeSiteDetails: Function;
  siteDetails: any;
  status: any;
  geoJsonProp: any;
  ready: any;
  projectGUID: any;
  setSiteList: Function;
  token: any;
  setFeatures: Function;
  seteditMode: Function;
  siteGUID: any;
  siteList: any;
}

function EditSite({
  openModal,
  handleModalClose,
  changeSiteDetails,
  siteDetails,
  status,
  geoJsonProp,
  ready,
  projectGUID,
  setSiteList,
  token,
  setFeatures,
  seteditMode,
  siteGUID,
  siteList,
}: EditSiteProps) {
  const { theme } = React.useContext(ThemeContext);
  const { t } = useTranslation(['manageProjects']);
  const { register, handleSubmit, errors, control } = useForm();
  const [geoJson, setGeoJson] = React.useState(geoJsonProp);
  const [geoJsonError, setGeoJsonError] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState('');
  const [isUploadingData, setIsUploadingData] = React.useState(false);
  const { handleError } = React.useContext(ErrorHandlingContext);
  const { impersonatedEmail } = React.useContext(UserPropsContext);

  const useStylesAutoComplete = makeStyles({
    root: {
      color:
        theme === 'theme-light'
          ? `${themeProperties.light.primaryFontColor} !important`
          : `${themeProperties.dark.primaryFontColor} !important`,
      backgroundColor:
        theme === 'theme-light'
          ? `${themeProperties.light.backgroundColor} !important`
          : `${themeProperties.dark.backgroundColor} !important`,
    },
    option: {
      // color: '#2F3336',
      '&:hover': {
        backgroundColor:
          theme === 'theme-light'
            ? `${themeProperties.light.backgroundColorDark} !important`
            : `${themeProperties.dark.backgroundColorDark} !important`,
      },
    },
  });
  const classes = useStylesAutoComplete();

  const MapProps = {
    geoJson,
    setGeoJson,
    geoJsonError,
    setGeoJsonError,
    geoLocation: {
      geoLatitude: 36.96,
      geoLongitude: -28.5,
    },
  };

  const editProjectSite = (data: any) => {
    if (geoJson && geoJson.features && geoJson.features.length !== 0) {
      setIsUploadingData(true);
      const submitData = {
        name: siteDetails.name,
        geometry: geoJson,
        status: data.status,
      };
      putAuthenticatedRequest(
        `/app/projects/${projectGUID}/sites/${siteGUID}`,
        submitData,
        token,
        impersonatedEmail,
        handleError
      ).then((res) => {
        if (!res.code) {
          const temp = siteList;
          let siteIndex;
          temp.find((site, index) => {
            if (site.id === res.id) {
              siteIndex = index;
              return true;
            }
          });
          if (siteIndex !== null) {
            temp[siteIndex] = res;
          }
          setSiteList(temp);
          setGeoJson(null);
          setFeatures([]);
          setIsUploadingData(false);
          seteditMode(false);
          setErrorMessage('');
        } else {
          if (res.code === 404) {
            setIsUploadingData(false);
            setErrorMessage(ready ? t('manageProjects:projectNotFound') : '');
          } else {
            setIsUploadingData(false);
            setErrorMessage(res.message);
          }
        }
      });
    } else {
      setErrorMessage(ready ? t('manageProjects:polygonRequired') : '');
    }
  };

  return (
    <Modal
      aria-labelledby="transition-modal-title"
      aria-describedby="transition-modal-description"
      className={'modalContainer' + ' ' + theme}
      open={openModal}
      onClose={handleModalClose}
      closeAfterTransition
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={openModal}>
        <form
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
          }}
        >
          <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
            <div className={styles.formField}>
              <div className={styles.formFieldHalf}>
                <MaterialTextField
                  inputRef={register({ required: true })}
                  label={t('manageProjects:siteName')}
                  variant="outlined"
                  name="name"
                  onChange={changeSiteDetails}
                  defaultValue={siteDetails.name}
                />
              </div>
              <div className={styles.formFieldHalf}>
                <Controller
                  as={
                    <MaterialTextField
                      label={t('manageProjects:siteStatus')}
                      variant="outlined"
                      name="status"
                      onChange={changeSiteDetails}
                      select
                      value={siteDetails.status}
                    >
                      {status.map((option) => (
                        <MenuItem
                          key={option.value}
                          value={option.value}
                          classes={{
                            // option: classes.option,
                            root: classes.root,
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                    </MaterialTextField>
                  }
                  name="status"
                  rules={{ required: t('manageProjects:selectProjectStatus') }}
                  control={control}
                  defaultValue={siteDetails.status ? siteDetails.status : ''}
                />
                {errors.status && (
                  <span className={styles.formErrors}>
                    {errors.status.message}
                  </span>
                )}
              </div>
            </div>

            <Map {...MapProps} />
          </div>

          {errorMessage && errorMessage !== '' ? (
            <div className={styles.formFieldLarge}>
              <h4 className={styles.errorMessage}>{errorMessage}</h4>
            </div>
          ) : null}

          <div className={styles.formField}>
            <div className={`${styles.formFieldHalf}`}>
              <button
                onClick={handleModalClose}
                className="secondaryButton"
                style={{ width: '234px' }}
              >
                <BackArrow />
                <p>{t('manageProjects:backToSites')}</p>
              </button>
            </div>
            <div style={{ width: '20px' }}></div>
            <div className={`${styles.formFieldHalf}`}>
              <button
                onClick={handleSubmit(editProjectSite)}
                className="primaryButton"
                style={{ minWidth: '240px' }}
              >
                {isUploadingData ? (
                  <div className={styles.spinner}></div>
                ) : (
                  t('manageProjects:saveSite')
                )}
              </button>
            </div>
          </div>
        </form>
      </Fade>
    </Modal>
  );
}
