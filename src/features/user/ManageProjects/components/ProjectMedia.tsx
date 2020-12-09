import React, { ReactElement } from 'react';
import { useForm } from 'react-hook-form';
import { useDropzone } from 'react-dropzone';
import styles from '../styles/StepForm.module.scss';
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import i18next from '../../../../../i18n';
import BackArrow from '../../../../../public/assets/images/icons/headerIcons/BackArrow';
import { deleteAuthenticatedRequest, getAuthenticatedRequest, postAuthenticatedRequest, putAuthenticatedRequest } from '../../../../utils/apiRequests/api';
import getImageUrl from '../../../../utils/getImageURL';
import DeleteIcon from '../../../../../public/assets/images/icons/manageProjects/Delete';
import Star from '../../../../../public/assets/images/icons/manageProjects/Star';

const { useTranslation } = i18next;

interface Props {
  handleNext: Function;
  handleBack: Function;
  projectDetails: Object;
  setProjectDetails: Function;
  projectGUID: String;
  handleReset: Function;
  token: any;
}

export default function ProjectMedia({ handleBack, token, handleNext, projectDetails, setProjectDetails, projectGUID, handleReset }: Props): ReactElement {
  const { t, i18n, ready } = useTranslation(['manageProjects']);

  const { register, handleSubmit, errors } = useForm({ mode: 'all' });

  const [uploadedImages, setUploadedImages] = React.useState([])

  const [isUploadingData, setIsUploadingData] = React.useState(false)
  const [errorMessage, setErrorMessage] = React.useState('')

  React.useEffect(() => {
    // Fetch images of the project 
    if (projectGUID && token)
      getAuthenticatedRequest(`/app/profile/projects/${projectGUID}?_scope=images`, token).then((result) => {
        setUploadedImages(result.images)
      })
  }, [projectGUID]);

  const uploadPhotos = (image: any) => {
    setIsUploadingData(true)

    const submitData = {
      "imageFile": image,
      "description": null,
      "isDefault": false
    }
    postAuthenticatedRequest(`/app/projects/${projectGUID}/images`, submitData, token).then((res) => {
      if (!res.code) {
        let newUploadedImages = uploadedImages;
        newUploadedImages.push(res)
        setUploadedImages(newUploadedImages)
        setIsUploadingData(false)
        setErrorMessage('')
      } else {
        if (res.code === 404) {
          setIsUploadingData(false)
          setErrorMessage(t('manageProjects:projectNotFound'))
        }
        else {
          setIsUploadingData(false)
          setErrorMessage(res.message)
        }

      }


    })
  };

  React.useEffect(() => {
    if (!projectGUID || projectGUID === '') {
      handleReset(t('manageProjects:resetMessage'))
    }
  })

  const [files, setFiles] = React.useState([]);

  const onDrop = React.useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file: any) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onabort = () => console.log('file reading was aborted')
      reader.onerror = () => console.log('file reading has failed')
      reader.onload = (event) => {
        uploadPhotos(event.target.result);
      }
    })

  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/*',
    multiple: true,
    onDrop: onDrop,
    onDropAccepted: () => {
      console.log('uploaded');

    },

    // onFileDialogCancel: () => {
    //     alert('no file selected')
    // }
  });

  const [youtubeURL, setYoutubeURL] = React.useState('')

  React.useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach((file) => URL.revokeObjectURL(file.preview));
  }, [files]);

  const deleteProjectCertificate = (id: any) => {
    deleteAuthenticatedRequest(`/app/projects/${projectGUID}/images/${id}`, token).then(res => {
      if (res !== 404) {
        let uploadedFilesTemp = uploadedImages.filter(item => item.id !== id);
        setUploadedImages(uploadedFilesTemp)
      }
    })
  }

  // For uploading the Youtube field
  const onSubmit = (data: any) => {
    // Add isDirty test here
    setIsUploadingData(true)
    const submitData = {
      videoUrl: data.youtubeURL
    }
    putAuthenticatedRequest(`/app/projects/${projectGUID}`, submitData, token).then((res) => {
      if (!res.code) {
        setProjectDetails(res)
        setIsUploadingData(false)
        handleNext()
        setErrorMessage('')
      } else {
        if (res.code === 404) {
          setIsUploadingData(false)
          setErrorMessage(t('manageProjects:projectNotFound'))
        }
        else {
          setIsUploadingData(false)
          setErrorMessage(res.message)
        }

      }
    })
  };

  React.useEffect(() => {
    if (projectDetails) {
      setYoutubeURL(projectDetails.videoUrl)
    }
  }, [projectDetails])

  const setDefaultImage = (id: any, index: any) => {
    setIsUploadingData(true)
    const submitData = {
      isDefault: true
    }
    putAuthenticatedRequest(`/app/projects/${projectGUID}/images/${id}`, submitData, token).then((res) => {
      if (!res.code) {
        let tempUploadedData = uploadedImages;
        tempUploadedData.forEach((image) => {
          image.isDefault = false
        })
        tempUploadedData[index].isDefault = true;
        setUploadedImages(tempUploadedData);
        setIsUploadingData(false)
        setErrorMessage('')
      } else {
        if (res.code === 404) {
          setIsUploadingData(false)
          setErrorMessage(t('manageProjects:projectNotFound'))
        }
        else {
          setIsUploadingData(false)
          setErrorMessage(res.message)
        }
      }
    })
  }

  const uploadCaption = (id: any, index: any, e: any) => {
    setIsUploadingData(true)
    const submitData = {
      description: e.target.value
    }
    putAuthenticatedRequest(`/app/projects/${projectGUID}/images/${id}`, submitData, token).then((res) => {
      if (!res.code) {
        let tempUploadedData = uploadedImages;
        tempUploadedData[index].description = res.description;
        setUploadedImages(tempUploadedData);
        setIsUploadingData(false)
        setErrorMessage('')
      } else {
        if (res.code === 404) {
          setIsUploadingData(false)
          setErrorMessage(t('manageProjects:projectNotFound'))
        }
        else {
          setIsUploadingData(false)
          setErrorMessage(res.message)
        }

      }
    })
  }
  return ready ? (
    <div className={styles.stepContainer}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={`${isUploadingData ? styles.shallowOpacity : ''}`}>
          {/* <div className={styles.formFieldLarge}>
            {youtubeURL && !errors.youtubeURL ? (
              <iframe src={youtubeURL}></iframe>
            ) : null}
          </div> */}
          <div className={styles.formFieldLarge}>
            <MaterialTextField
              inputRef={register({
                pattern: {
                  value: /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\?v=)([^#\&\?]*).*/,
                  message: t('manageProjects:youtubeURLValidation')
                }
              })}
              label={t('manageProjects:youtubeURL')}
              variant="outlined"
              name="youtubeURL"
              onChange={(e) => setYoutubeURL(e.target.value)}
              defaultValue={youtubeURL}
              value={youtubeURL}
            />

          </div>
          {errors.youtubeURL && (
            <span className={styles.formErrors}>
              {errors.youtubeURL.message}
            </span>
          )}

          {/* Change to field array of react hook form  */}
          {uploadedImages && uploadedImages.length > 0 ?
            <div className={styles.formField}>
              {
                uploadedImages.map((image, index) => {
                  return (
                    <div key={image.id} className={styles.formFieldHalf}>
                      <div className={styles.uploadedImageContainer}>
                        <img src={getImageUrl('project', 'medium', image.image)} />
                        <div className={styles.uploadedImageOverlay}></div>

                        <input
                          onBlur={(e) => uploadCaption(image.id, index, e)}
                          type="text"
                          placeholder={t('manageProjects:addCaption')}
                          defaultValue={image.description}
                        />

                        <div className={styles.uploadedImageButtonContainer}>
                          <div onClick={() => deleteProjectCertificate(image.id)}>
                            <DeleteIcon />
                          </div>
                          <div onClick={() => setDefaultImage(image.id, index)}>
                            <Star color={image.isDefault ? '#ECB641' : '#aaa'} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            : null}

          <div className={styles.formFieldLarge} {...getRootProps()}>
            <label htmlFor="upload" className={styles.fileUploadContainer}>
              <AnimatedButton
                onClick={uploadPhotos}
                className={styles.continueButton}
              >
                <input {...getInputProps()} />
                {t('manageProjects:uploadPhotos')}

              </AnimatedButton>
              <p style={{ marginTop: '18px' }}>
                {t('manageProjects:dragIn')}
              </p>
            </label>

            {/* <input type="file" multiple id="upload" style={{ display: 'none' }} /> */}
          </div>
        </div>

        {errorMessage && errorMessage !== '' ?
          <div className={styles.formFieldLarge}>
            <h4 className={styles.errorMessage}>{errorMessage}</h4>
          </div>
          : null}

        <div className={styles.formField}>
          <div className={`${styles.formFieldHalf}`}>
            <AnimatedButton
              onClick={handleBack}
              className={styles.secondaryButton}
            >
              <BackArrow />
              <p>
                {t('manageProjects:backToBasic')}
              </p>
            </AnimatedButton>
          </div>
          <div style={{ width: '20px' }} />
          <div className={`${styles.formFieldHalf}`}>
            <div onClick={handleSubmit(onSubmit)} className={styles.continueButton}>
              {isUploadingData ? <div className={styles.spinner}></div> : t('manageProjects:saveAndContinue')}
            </div>
          </div>
        </div>
      </form>
    </div>
  ) : null;
}
