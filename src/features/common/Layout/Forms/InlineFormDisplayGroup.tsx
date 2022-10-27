import { styled } from '@mui/material';
import { ReactElement, ReactNode } from 'react';

const InlineFormGroup = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  columnGap: 16,
  rowGap: 24,
  alignItems: 'flex-start',
  flexWrap: 'wrap',
  '&.InlineFormGroup--other': {
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
  '& .MuiTextField-root': {
    flex: 1,
    minWidth: 180,
  },
});

interface Props {
  type?: 'field' | 'other'; //Use type='other' to specify inline groups that do not contain only text field elements
  children: ReactNode;
}

const InlineFormDisplayGroup = ({
  type = 'field',
  children,
}: Props): ReactElement => {
  return (
    <InlineFormGroup
      className={
        type === 'field' ? 'InlineFormGroup--fields' : 'InlineFormGroup--other'
      }
    >
      {children}
    </InlineFormGroup>
  );
};

export default InlineFormDisplayGroup;
