'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AggregationEFields from '@/modules/FormFields/AggregationEFields';
import useCreateAgregationClass from '@/hooks/AgregationClass/useCreateAgregationClass';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';
import { IAggregationE } from '@/types/AgregationClass.types';

export default function AgregationClassPageNew() {
  const viewName: string = 'AggregationE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IAggregationE>({
    defaultValues: {
      id: createUuid(),
      aggregation: '',
    },
  });

  const handleSuccess = (newRecord: IAggregationE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.AGGREGATION_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createAgregationClassAsync } = useCreateAgregationClass<IAggregationE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AGGREGATION_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="AggregationE"
          onSave={async (newValue: IAggregationE, close: boolean) => {
            setCloseAfter(close);
            await createAgregationClassAsync({ agregationClass: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <AggregationEFields isNew />
      </Box>
    </FormProvider>
  );
}
