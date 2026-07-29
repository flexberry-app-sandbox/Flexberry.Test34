'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AggregationEFields from '@/modules/FormFields/AggregationEFields';
import useGetAggregationClass from '@/hooks/AggregationClass/useGetAggregationClass';
import useUpdateAggregationClass from '@/hooks/AggregationClass/useUpdateAggregationClass';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IAggregationE } from '@/types/AggregationClass.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function AggregationClassPageEdit() {
  const viewName: string = 'AggregationE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.AGGREGATION_L);
  };

  const { data, isLoading } = useGetAggregationClass<IAggregationE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IAggregationE>({
    defaultValues: {
      id: createUuid(),
      aggregationAtr: '',
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

  const { updateAggregationClassAsync } = useUpdateAggregationClass<IAggregationE>(handleSuccess, handleError);

  const handleSave = async (newValue: IAggregationE, close: boolean) => {
    setCloseAfter(close);
    await updateAggregationClassAsync({ aggregationClass: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AGGREGATION_L}${getQueryParamStateId(searchParams)}`);
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
            title="AggregationE"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <AggregationEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
