import React, { ReactElement } from 'react';
import MaterialTextField from '../../../../common/InputTypes/MaterialTextField';
import { useTranslation } from 'next-i18next';
import styles from '../Import.module.scss';
import DeleteIcon from '../../../../../../public/assets/images/icons/manageProjects/Delete';
import { Controller } from 'react-hook-form';
import { localeMapForDate } from '../../../../../utils/language/getLanguageName';
import { InputAdornment, MenuItem, SxProps } from '@mui/material';

import { MobileDatePicker as MuiDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import themeProperties from '../../../../../theme/themeProperties';

const dialogSx: SxProps = {
  '& .MuiButtonBase-root.MuiPickersDay-root.Mui-selected': {
    backgroundColor: themeProperties.primaryColor,
    color: '#fff',
  },

  '& .MuiPickersDay-dayWithMargin': {
    '&:hover': {
      backgroundColor: themeProperties.primaryColor,
      color: '#fff',
    },
  },
  '.MuiDialogActions-root': {
    paddingBottom: '12px',
  },
};

interface Props {
  index: number;
  register: Function;
  remove: Function;
  getValues: Function;
  control: any;
  userLang: string;
  setValue: Function;
  item: any;
  plantLocation: Treemapper.PlantLocation;
  errors: any;
  key: string;
}

export default function SampleTreeCard({
  index,
  register,
  remove,
  getValues,
  control,
  userLang,
  setValue,
  item,
  plantLocation,
  errors,
  key,
}: Props): ReactElement {
  const sampleTrees = getValues();
  const { t, ready } = useTranslation(['treemapper', 'common']);

  return (
    <div key={key} className={styles.sampleTreeFieldGroup}>
      <div className={styles.sampleTreeName}>
        <div>
          {t('sampleTree', { number: index + 1 })}
          {`${
            sampleTrees[index]?.treeTag
              ? ` • ${t('tag')} ${sampleTrees[index]?.treeTag}`
              : ''
          }`}
        </div>
        <div
          onClick={() => remove(index)}
          style={{
            cursor: 'pointer',
          }}
        >
          <DeleteIcon />
        </div>
      </div>
      <div className={styles.sampleTreeSummary}>
        {`${
          sampleTrees[index]?.height
            ? ` • ${t('height')} ${sampleTrees[index]?.height}`
            : ''
        }`}{' '}
        {`${
          sampleTrees[index]?.diameter
            ? ` • ${t('diameter')} ${sampleTrees[index]?.diameter}`
            : ''
        }`}
      </div>
      <div className={styles.sampleTreeDetails}>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <LocalizationProvider
              dateAdapter={AdapterDateFns}
              locale={
                localeMapForDate[userLang]
                  ? localeMapForDate[userLang]
                  : localeMapForDate['en']
              }
            >
              <Controller
                defaultValue={item.plantingDate}
                render={(properties: any) => (
                  <MuiDatePicker
                    label={t('plantingDate')}
                    value={properties.value}
                    onChange={properties.onChange}
                    renderInput={(props) => <MaterialTextField {...props} />}
                    disableFuture
                    inputFormat="MMMM d, yyyy"
                    DialogProps={{
                      sx: dialogSx,
                    }}
                  />
                )}
                name={`sampleTrees[${index}].plantingDate`}
                control={control}
              />
            </LocalizationProvider>
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register()}
              label={t('treeTag')}
              variant="outlined"
              name={`sampleTrees[${index}].treeTag`}
              defaultValue={item.treeTag}
            />
          </div>
        </div>
        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidHeight'),
                },
              })}
              type="text"
              label={t('height')}
              variant="outlined"
              name={`sampleTrees[${index}].height`}
              defaultValue={item.height}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{t('m')}</InputAdornment>
                ),
              }}
            />
            {errors?.sampleTrees?.[index]?.height && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.height?.message}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidDiameter'),
                },
              })}
              type="text"
              label={t('diameter')}
              variant="outlined"
              name={`sampleTrees[${index}].diameter`}
              defaultValue={item.diameter}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">{t('cm')}</InputAdornment>
                ),
              }}
            />
            {errors?.sampleTrees?.[index]?.diameter && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.diameter?.message}
              </span>
            )}
          </div>
        </div>

        <div className={styles.formField}>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLatitude'),
                },
              })}
              type="text"
              label={t('latitude')}
              variant="outlined"
              name={`sampleTrees[${index}].latitude`}
              defaultValue={item.latitude}
            />
            {errors?.sampleTrees?.[index]?.latitude && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.latitude?.message}
              </span>
            )}
          </div>
          <div className={styles.formFieldHalf}>
            <MaterialTextField
              inputRef={register({
                pattern: {
                  value: /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/,
                  message: t('invalidLongitude'),
                },
              })}
              type="text"
              label={t('longitude')}
              variant="outlined"
              name={`sampleTrees[${index}].longitude`}
              defaultValue={item.longitude}
            />
            {errors?.sampleTrees?.[index]?.longitude && (
              <span className={styles.errorMessage}>
                {errors?.sampleTrees?.[index]?.longitude?.message}
              </span>
            )}
          </div>
        </div>
        <div className={styles.formFieldLarge}>
          {/* <MaterialTextField
            inputRef={register()}
            label={t('treeSpecies')}
            variant="outlined"
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
          /> */}
          {/* <NativeSelect
            id="sampleTreeSpecies"
            input={<MaterialInput />}
            inputRef={register()}
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
          >
            {plantLocation.plantedSpecies.map((species: Treemapper.PlantedSpecies, index: number) => {
              return (
                <option key={index} value={species.otherSpecies}>
                  {species.otherSpecies}
                </option>
              );
            })}
          </NativeSelect> */}
          <Controller
            as={
              <MaterialTextField
                label={t('treeSpecies')}
                variant="outlined"
                select
                inputRef={register}
              >
                {plantLocation.plantedSpecies.map(
                  (species: Treemapper.PlantedSpecies, index: number) => {
                    if (plantLocation.plantedSpecies.length === 1) {
                      return (
                        <MenuItem
                          key={index}
                          value={species.otherSpecies}
                          selected={true}
                        >
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    } else if (species.otherSpecies === item.otherSpecies) {
                      return (
                        <MenuItem
                          key={index}
                          value={species.otherSpecies}
                          selected={true}
                        >
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    } else {
                      return (
                        <MenuItem key={index} value={species.otherSpecies}>
                          {species.otherSpecies}
                        </MenuItem>
                      );
                    }
                  }
                )}
              </MaterialTextField>
            }
            name={`sampleTrees[${index}].otherSpecies`}
            defaultValue={item.otherSpecies}
            control={control}
          />
          {/* <SpeciesSelect label={t('treemapper:species')} name={`scientificSpecies`} width='300px' control={control} /> */}
        </div>
      </div>
    </div>
  );
}
