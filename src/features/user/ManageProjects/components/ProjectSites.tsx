import React, { ReactElement } from 'react'
import styles from './../styles/StepForm.module.scss'
import MaterialTextField from '../../../common/InputTypes/MaterialTextField';
import AnimatedButton from '../../../common/InputTypes/AnimatedButton';
import { useForm } from 'react-hook-form';
import i18next from './../../../../../i18n'

const { useTranslation } = i18next;

interface Props {
    
}

export default function ProjectSites({}: Props): ReactElement {

    const { t, i18n } = useTranslation(['manageProjects']);

    const { register, handleSubmit, errors } = useForm();

    const [siteDetails,setSiteDetails] = React.useState({});

    const changeSiteDetails = (e: any) => {
        setSiteDetails({ ...siteDetails, [e.target.name]: e.target.value });
    };

    const onSubmit = (data: any) => {

    };

    return (
        <div className={styles.stepContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>

                <div className={styles.formField}>
                    <MaterialTextField
                        inputRef={register({ required: true })}
                        label={t('manageProjects:siteName')}
                        variant="outlined"
                        name="siteName"
                        onChange={changeSiteDetails}
                        // defaultValue={}
                    />
                </div>
            </form>
        </div>
    )
}
