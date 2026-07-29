'use client';

import { Grid, Paper, Typography } from '@mui/material';

import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllAssosiationClass from '@/hooks/AssosiationClass/useGetAllAssosiationClass';
import { IAssosiationClassL } from '@/types/AssosiationClass.types';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { emptyGuid } from '@/utils/guidUtils';

interface ClassEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const ClassEFields = ({ isNew = false }: ClassEFieldsProps) => {
  const { data: assosiationClass, isLoading: assosiationClassIsLoading } =
    useGetAllAssosiationClass<IAssosiationClassL>({
      viewName: 'AssosiationClassL',
    });

  const isLoading = assosiationClassIsLoading;

  if (isLoading) {
    return (
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <CircularProgressCenter />
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Grid
          container
          spacing={1.5}
          alignItems="flex-end"
        >
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlTextField
              id="address"
              name="address"
              label="Address"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="name"
              label="Name"
              options={ClassEnum}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6, lg: 6 }}>
            <ControlDropDown
              name="assosiationClassId"
              label="AssosiationClass"
              options={assosiationClass}
              getOptionLabel={(opt) => opt.id?.toString() ?? ''}
              required
              rules={{
                validate: (record) => (record && record !== emptyGuid) || 'AssosiationClass - обязательное поле.',
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ClassEFields;
