'use client';
import React, { useState } from 'react';
import {
  Button,
  Chip,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Input,
  Link,
  Pagination,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  User,
} from '@nextui-org/react';
import { columns, statusOptions, users } from '@/app/data';
import { ChevronDownIcon } from '../../../../public/icons/ChevronDownIcon';
import { SearchIcon } from '../../../../public/SearchIcon';
import { dateFormatter } from '@/utils/dateFormatter';
import { UserIcon } from '../../../../public/icons/UserIcon';
import { FiEdit2 } from 'react-icons/fi';
import { PlusIcon } from '../../../../public/icons/PlusIcon';
import { sanityClient } from '../../../../sanityClient';
import { ToastContainer } from 'react-toastify';
import toastify from '@/helpers/toastify';
import 'animate.css/animate.min.css';
import 'react-toastify/dist/ReactToastify.css';
import { AiOutlineDelete } from 'react-icons/ai';
import confetti from 'canvas-confetti';
import Swal from 'sweetalert2';

const statusColorMap = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
};

const INITIAL_VISIBLE_COLUMNS = [
  'name',
  'createdAt',
  'status',
  'isPublished',
  'actions',
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function splitStringOnCase(inputString) {
  return inputString.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase();
}

export default function IncompleteMangaList({ data }) {
  const [forceReRender, setForceReRender] = useState(false);
  const [filterValue, setFilterValue] = React.useState('');
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
  const [visibleColumns, setVisibleColumns] = React.useState(
    new Set(INITIAL_VISIBLE_COLUMNS)
  );
  const [statusFilter, setStatusFilter] = React.useState('all');
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [sortDescriptor, setSortDescriptor] = React.useState({
    column: 'age',
    direction: 'ascending',
  });
  const [page, setPage] = React.useState(1);

  const hasSearchFilter = Boolean(filterValue);

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns;

    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.uid)
    );
  }, [visibleColumns]);

  // this headerColumns is replacement of headerColumns
  const headerColumn = React.useMemo(() => {
    return Array.from(visibleColumns).map((x) => {
      return {
        name: splitStringOnCase(x),
        uid: x,
        sortable: true,
      };
    });
  }, [visibleColumns]);

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...data];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.title.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    if (
      statusFilter !== 'all' &&
      Array.from(statusFilter).length !== statusOptions.length
    ) {
      filteredUsers = filteredUsers.filter((user) =>
        Array.from(statusFilter).includes(user.status)
      );
    }

    return filteredUsers;
  }, [users, filterValue, statusFilter]);

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage]);

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === 'descending' ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  console.log('re render', forceReRender);

  const renderCell = React.useCallback((manga, columnKey) => {
    const cellValue = manga[columnKey];

    switch (columnKey) {
      case 'name':
        const name = (
          <p>
            {manga.title} -{' '}
            <span className="font-bold text-green-500 text-[15px]">
              {manga.chapters.length}
            </span>
          </p>
        );
        return (
          <Link href={`/sanity/manga/edit/${manga._id}`} target="_blank">
            <User
              avatarProps={{ radius: 'lg', src: manga.coverImage }}
              description={manga.rating}
              name={name}
            />
          </Link>
        );
      case 'createdAt':
        return (
          <div className="flex flex-col">
            <p className="text-bold text-small capitalize">
              {dateFormatter(manga.createdAt)}
            </p>
          </div>
        );
      case 'status':
        return (
          <Button color="success" size="sm" variant="flat">
            {cellValue}
          </Button>
        );
      case 'isPublished':
        const handlePublish = async () => {
          const isPublished = manga.isPublished;
          await sanityClient
            .patch(manga._id)
            .set({
              isPublished: isPublished ? false : true,
            })
            .commit();
          toastify(
            `${isPublished ? 'error' : 'success'}`,
            `Successfully ${isPublished ? 'Unpublished' : 'Published'}`
          );
          setForceReRender(!forceReRender);
        };

        return (
          <Button
            color={manga.isPublished ? 'success' : 'danger'}
            size="sm"
            variant="flat"
            onClick={handlePublish}
            className="w-[75px]"
          >
            {manga.isPublished ? 'Published' : 'Draft'}
          </Button>
        );
      case 'actions':
        const handleDelete = async () => {
          Swal.fire({
            title: 'Do you want to Delete the Manga?',
            showDenyButton: true,
            confirmButtonText: 'Yes',
            denyButtonText: `No`,
          }).then(async (result) => {
            /* Delete the manga from sanity */
            const query = await sanityClient.delete(manga._id);
            console.log('result', query);
            handleConfetti();
            toastify('success', `Successfully Deleted`);

            if (result.isConfirmed) {
              Swal.fire('Saved!', '', 'success');
            } else if (result.isDenied) {
              Swal.fire('Manga Not Deleted', '', 'info');
            }
          });
        };

        return (
          <div className="relative flex justify-center items-center gap-2">
            <Button
              size="sm"
              color="danger"
              variant="bordered"
              startContent={<AiOutlineDelete size={18} />}
              onClick={handleDelete}
            >
              Delete
            </Button>
            <Link href={`/sanity/manga/edit/${manga._id}`} target="_blank">
              <Button
                size="sm"
                color="success"
                variant="bordered"
                startContent={<FiEdit2 />}
              >
                Edit
              </Button>
            </Link>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      setPage(page + 1);
    }
  }, [page, pages]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = React.useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const onSearchChange = React.useCallback((value) => {
    if (value) {
      setFilterValue(value);
      setPage(1);
    } else {
      setFilterValue('');
    }
  }, []);

  const onClear = React.useCallback(() => {
    setFilterValue('');
    setPage(1);
  }, []);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <ToastContainer />
        <div className="flex justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Search by name..."
            startContent={<SearchIcon />}
            value={filterValue}
            onClear={() => onClear()}
            onValueChange={onSearchChange}
            size="sm"
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Status
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={statusFilter}
                selectionMode="multiple"
                onSelectionChange={setStatusFilter}
              >
                {statusOptions.map((status) => (
                  <DropdownItem key={status.uid} className="capitalize">
                    {capitalize(status.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDownIcon className="text-small" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.uid} className="capitalize">
                    {capitalize(column.name)}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
            <Button color="primary" endContent={<PlusIcon />}>
              Add New
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">
            Total {data.length} Mangas
          </span>
          <label className="flex items-center text-default-400 text-small">
            Rows per page:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [
    filterValue,
    statusFilter,
    visibleColumns,
    onRowsPerPageChange,
    users.length,
    onSearchChange,
    hasSearchFilter,
  ]);

  const bottomContent = React.useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {selectedKeys === 'all'
            ? 'All items selected'
            : `${selectedKeys.size} of ${filteredItems.length} selected`}
        </span>
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={pages}
          onChange={setPage}
        />
        <div className="hidden sm:flex w-[30%] justify-end gap-2">
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onPreviousPage}
          >
            Previous
          </Button>
          <Button
            isDisabled={pages === 1}
            size="sm"
            variant="flat"
            onPress={onNextPage}
          >
            Next
          </Button>
        </div>
      </div>
    );
  }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

  const handleConfetti = () => {
    var count = 200;
    var defaults = {
      origin: { y: 0.7 },
    };

    function fire(particleRatio, opts) {
      confetti({
        ...defaults,
        ...opts,
        particleCount: Math.floor(count * particleRatio),
      });
    }

    fire(0.25, {
      spread: 26,
      startVelocity: 55,
    });
    fire(0.2, {
      spread: 60,
    });
    fire(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });
    fire(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  };

  return (
    <Table
      aria-label="Example table with custom cells, pagination and sorting"
      isHeaderSticky
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: 'max-h-[382px]',
      }}
      selectedKeys={selectedKeys}
      selectionMode="multiple"
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}
      onCellAction={(key) => console.log('key', key)}
    >
      <TableHeader columns={headerColumn}>
        {(column) => (
          <TableColumn
            key={column.uid}
            align="center"
            allowsSorting={column.sortable}
            style={{ textAlign: 'center' }}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No Mangas found'} items={sortedItems}>
        {(item) => (
          <TableRow key={item._id}>
            {(columnKey) => (
              <TableCell>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
