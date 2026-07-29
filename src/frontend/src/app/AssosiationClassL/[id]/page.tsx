'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AssosiationClassEFields from '@/modules/FormFields/AssosiationClassEFields';
import useGetAssosiationClass from '@/hooks/AssosiationClass/useGetAssosiationClass';
import useUpdateAssosiationClass from '@/hooks/AssosiationClass/useUpdateAssosiationClass';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IAssosiationClassE } from '@/types/AssosiationClass.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function AssosiationClassPageEdit() {
  const viewName: string = 'AssosiationClassE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.ASSOSIATION_CLASS_L);
  };

  const { data, isLoading } = useGetAssosiationClass<IAssosiationClassE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IAssosiationClassE>({
    defaultValues: {
      id: createUuid(),
      assosiationName: '',
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

  const { updateAssosiationClassAsync } = useUpdateAssosiationClass<IAssosiationClassE>(handleSuccess, handleError);

  const handleSave = async (newValue: IAssosiationClassE, close: boolean) => {
    setCloseAfter(close);
    await updateAssosiationClassAsync({ assosiationClass: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.ASSOSIATION_CLASS_L}${getQueryParamStateId(searchParams)}`);
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
            title="AssosiationClassE"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <AssosiationClassEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
