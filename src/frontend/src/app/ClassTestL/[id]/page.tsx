'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ClassTestEFields from '@/modules/FormFields/ClassTestEFields';
import useGetClassTest from '@/hooks/ClassTest/useGetClassTest';
import useUpdateClassTest from '@/hooks/ClassTest/useUpdateClassTest';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IAggregationD } from '@/types/AggregationClass.types';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { IClassTestE } from '@/types/ClassTest.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';

export default function ClassTestPageEdit() {
  const viewName: string = 'ClassTestE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.CLASS_TEST_L);
  };

  const { data, isLoading } = useGetClassTest<IClassTestE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IClassTestE>({
    defaultValues: {
      id: createUuid(),
      address: '',
      name: ClassEnum.class1,
      assosiationClassId: emptyGuid,
      aggregationClass: [] as IAggregationD[],
    },
  });

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateClassTestAsync } = useUpdateClassTest<IClassTestE>(handleSuccess, handleError);

  const handleSave = async (newValue: IClassTestE, close: boolean) => {
    setCloseAfter(close);
    await updateClassTestAsync({ classTest: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.CLASS_TEST_L}${getQueryParamStateId(searchParams)}`);
  };

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset(data);
    }
  }, [data, isLoading, methods]);

  if (isLoading) {
    return <CircularProgressCenter />;
  }

  return (
    <FormProvider {...methods}>
      <DisabledFormProvider disabled={mode === 'readonly'}>
        <Box component="form">
          <EditFormToolbar
            title="ClassTestE"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <ClassTestEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
