'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import ClassEFields from '@/modules/FormFields/ClassEFields';
import useGetClass from '@/hooks/Class/useGetClass';
import useUpdateClass from '@/hooks/Class/useUpdateClass';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { IClassE } from '@/types/Class.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function ClassPageEdit() {
  const viewName: string = 'ClassE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.CLASS_L);
  };

  const { data, isLoading } = useGetClass<IClassE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IClassE>({
    defaultValues: {
      id: createUuid(),
      address: '',
      name: ClassEnum.class1,
      assosiationClassAssosiationName: '',
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

  const { updateClassAsync } = useUpdateClass<IClassE>(handleSuccess, handleError);

  const handleSave = async (newValue: IClassE, close: boolean) => {
    setCloseAfter(close);
    await updateClassAsync({ class: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.CLASS_L}${getQueryParamStateId(searchParams)}`);
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
            title="ClassE"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <ClassEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
