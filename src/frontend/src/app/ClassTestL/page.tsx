'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllClassTest from '@/hooks/ClassTest/useGetAllClassTest';
import useDeleteAllClassTest from '@/hooks/ClassTest/useDeleteAllClassTest';
import { ClassEnum } from '@/enums/ClassEnum.types';
import { tView } from '@/enums/tView.types';
import { IClassTestL } from '@/types/ClassTest.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function ClassTestPageList() {
  const viewName: string = 'ClassTestL';

  const {
    resetAll,
    isReady,
    applyFieldSettings,
    handleRowClickWithState,
    handleCreateButtonWithState,
    updateSettings: {
      updatePerPage,
      updateSorting,
      updateVisibleColumns,
      updateColumnResize,
      updateColumnReorder,
      updateFilter,
    },
    params: { page, perPage, sorting, filter, search, setSearch },
  } = useListState<IClassTestL>('ClassTestPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllClassTest<IClassTestL>({
    viewName,
    perPage,
    page,
    sorting,
    filter,
    search,
    enabled: isReady,
  });

  const handleSuccess = () => {
    showSuccess(`Запись удалена.`);
  };

  const handleError = (error: Error) => {
    showError(`Ошибка при удалении настройки: ${formatError(error)}.`);
  };

  const { deleteAllClassTest } = useDeleteAllClassTest(handleSuccess, handleError);

  const handleDelete = (items: IClassTestL[]) => {
    deleteAllClassTest(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.ClassTestL,
    fileName: 'ClassTestL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'address',
      title: 'Address',
      filter: true,
      type: 'text',
    },
    {
      field: 'name',
      title: 'Name',
      filter: true,
      type: 'enum',
      options: ClassEnum,
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="ClassTestL"
        onRowClick={(item) => handleRowClickWithState(item)}
        onCreateButtonClick={() => handleCreateButtonWithState()}
        onDelete={handleDelete}
        filters={filter}
        setFilters={(v) => updateFilter(v)}
        setGlobalFilter={setSearch}
        totalRecords={count}
        rowsPerPage={perPage}
        page={page}
        setPage={(page, perPage) => updatePerPage(page, perPage)}
        multiSortMeta={sorting}
        setSorting={(columns) => updateSorting(columns)}
        lazyLoad={true}
        onChangeVisibleColumns={(columns) => updateVisibleColumns(fields, columns)}
        onColumnResize={(field, width) => updateColumnResize(field, width)}
        onColumnReorder={(fields) => updateColumnReorder(fields)}
        showResetButton={true}
        onResetSettingsClick={resetAll}
        onExportClick={exportList}
        isLoading={isLoading}
      />
    </Box>
  );
}
