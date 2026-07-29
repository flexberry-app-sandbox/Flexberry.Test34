'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ClassTestEFields from '@/modules/FormFields/ClassTestEFields';
import useCreateClassTest from '@/hooks/ClassTest/useCreateClassTest';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { IAggregationD } from '@/types/AggregationClass.types';
import { IClassTestE } from '@/types/ClassTest.types';

export default function ClassTestPageNew() {
  const viewName: string = 'ClassTestE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IClassTestE>({
    defaultValues: {
      id: createUuid(),
      address: '',
      name: ClassEnum.class1,
      assosiationClassId: emptyGuid,
      aggregationClass: [] as IAggregationD[],
    },
  });

  const handleSuccess = (newRecord: IClassTestE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.CLASS_TEST_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createClassTestAsync } = useCreateClassTest<IClassTestE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.CLASS_TEST_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="ClassTestE"
          onSave={async (newValue: IClassTestE, close: boolean) => {
            setCloseAfter(close);
            await createClassTestAsync({ classTest: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <ClassTestEFields isNew />
      </Box>
    </FormProvider>
  );
}
