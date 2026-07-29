'use client';

import React, { useState } from 'react';
import { Box } from '@mui/material';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ClassEFields from '@/modules/FormFields/ClassEFields';
import useCreateClass from '@/hooks/Class/useCreateClass';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import { ROUTES_CONFIG } from '@/config/routes.config';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid, emptyGuid } from '@/utils/guidUtils';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { IClassE } from '@/types/Class.types';

export default function ClassPageNew() {
  const viewName: string = 'ClassE';

  const searchParams = useSearchParams();
  const router = useRouter();
  const [closeAfter, setCloseAfter] = useState(false);
  const { showError, showSuccess } = useNotification();

  const methods = useForm<IClassE>({
    defaultValues: {
      id: createUuid(),
      address: '',
      name: ClassEnum.class1,
      assosiationClassId: emptyGuid,
    },
  });

  const handleSuccess = (newRecord: IClassE) => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    } else {
      router.push(`${ROUTES_CONFIG.CLASS_L}/${newRecord.id}${getQueryParamStateId(searchParams)}`);
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { createClassAsync } = useCreateClass<IClassE>(handleSuccess, handleError);

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.CLASS_L}${getQueryParamStateId(searchParams)}`);
  };

  return (
    <FormProvider {...methods}>
      <Box component="form">
        <EditFormToolbar
          title="ClassE"
          onSave={async (newValue: IClassE, close: boolean) => {
            setCloseAfter(close);
            await createClassAsync({ class: newValue, viewName: viewName });
          }}
          onTransition={handleTransition}
        />
        <ClassEFields isNew />
      </Box>
    </FormProvider>
  );
}
