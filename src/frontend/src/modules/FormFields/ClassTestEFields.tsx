'use client';

import { Grid, Paper, Typography } from '@mui/material';
import { useFieldArray, useFormContext } from 'react-hook-form';

import ControlDataTableEditor, { ControlColumnEditor, OptionsEnum } from '@/components/DataTableEditor';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import ControlDropDown from '@/components/DropDown';
import ControlTextField from '@/components/TextField';
import useGetAllAssosiationClass from '@/hooks/AssosiationClass/useGetAllAssosiationClass';
import { IClassTestE } from '@/types/ClassTest.types';
import { IAssosiationClassL } from '@/types/AssosiationClass.types';
import { IAggregationD as IAggregationClassAggregationD } from '@/types/AggregationClass.types';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

interface ClassTestEFieldsProps {
  /**
   * Флаг формы создания.
   * @default false
   */
  isNew?: boolean;
}

const ClassTestEFields = ({ isNew = false }: ClassTestEFieldsProps) => {
  const { data: assosiationClass, isLoading: assosiationClassIsLoading } =
    useGetAllAssosiationClass<IAssosiationClassL>({
      viewName: 'AssosiationClassL',
    });

  const { control: classTestEControl, getValues } = useFormContext<IClassTestE>();

  const {
    fields: aggregationClassFields,
    append: appendAggregationClass,
    remove: removeAggregationClass,
  } = useFieldArray({
    control: classTestEControl,
    name: 'aggregationClass',
  });

  const aggregationClassColumns: ControlColumnEditor<
    IAggregationClassAggregationD,
    OptionsEnum,
    { id: NonEmptyString }
  >[] = [
    {
      field: 'aggregationAtr',
      title: 'AggregationAtr',
      editor: 'text',
    },
  ];

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
      <Paper sx={{ px: 3.75, py: 2.5, mt: 2 }}>
        <Typography
          variant="h6"
          component="span"
        >
          AggregationClass
        </Typography>
        <Grid
          container
          spacing={1.5}
        >
          <Grid size={12}>
            <ControlDataTableEditor
              data={aggregationClassFields}
              name="aggregationClass"
              columns={aggregationClassColumns}
              onCreate={() => {
                appendAggregationClass({
                  id: createUuid(),
                  aggregationAtr: '',
                });
              }}
              onDelete={(selected) => {
                const indexesToRemove = selected
                  .map((selectedId) => aggregationClassFields.findIndex((field) => field.id === selectedId))
                  .filter((index) => index !== -1);
                removeAggregationClass(indexesToRemove);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default ClassTestEFields;
