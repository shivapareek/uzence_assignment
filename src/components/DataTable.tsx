import React, { useState, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2, Database } from 'lucide-react';

interface Column<T> {
  key: string;
  title: string;
  dataIndex: keyof T;
  sortable?: boolean;
  width?: string;
  render?: (value: T[keyof T], record: T, index: number) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  loading?: boolean;
  selectable?: boolean;
  onRowSelect?: (selectedRows: T[]) => void;
  rowKey?: keyof T | ((record: T) => string | number);
  emptyStateText?: string;
  className?: string;
}

type SortDirection = 'asc' | 'desc' | null;

interface SortState {
  key: string | null;
  direction: SortDirection;
}

const DataTable = <T extends Record<string, any>>({
  data,
  columns,
  loading = false,
  selectable = false,
  onRowSelect,
  rowKey = 'id',
  emptyStateText = 'No data available',
  className = '',
}: DataTableProps<T>) => {
  const [sortState, setSortState] = useState<SortState>({ key: null, direction: null });
  const [selectedRows, setSelectedRows] = useState<Set<string | number>>(new Set());

  // Get row key for a record
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] ?? index;
  };

  // Sort data based on current sort state
  const sortedData = useMemo(() => {
    if (!sortState.key || !sortState.direction) return data;

    const column = columns.find(col => col.key === sortState.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.dataIndex];
      const bValue = b[column.dataIndex];

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return sortState.direction === 'asc' ? -1 : 1;
      if (bValue == null) return sortState.direction === 'asc' ? 1 : -1;

      // Compare values
      let comparison = 0;
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }

      return sortState.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortState, columns]);

  // Handle column sorting
  const handleSort = (column: Column<T>) => {
    if (!column.sortable) return;

    setSortState(prev => {
      if (prev.key !== column.key) {
        return { key: column.key, direction: 'asc' };
      }
      if (prev.direction === 'asc') {
        return { key: column.key, direction: 'desc' };
      }
      if (prev.direction === 'desc') {
        return { key: null, direction: null };
      }
      return { key: column.key, direction: 'asc' };
    });
  };

  // Handle row selection
  const handleRowSelect = (recordKey: string | number, record: T) => {
    const newSelectedRows = new Set(selectedRows);
    
    if (newSelectedRows.has(recordKey)) {
      newSelectedRows.delete(recordKey);
    } else {
      newSelectedRows.add(recordKey);
    }
    
    setSelectedRows(newSelectedRows);
    
    // Call onRowSelect with actual records
    const selectedRecords = sortedData.filter((record, index) => 
      newSelectedRows.has(getRowKey(record, index))
    );
    onRowSelect?.(selectedRecords);
  };

  // Handle select all
  const handleSelectAll = () => {
    if (selectedRows.size === sortedData.length) {
      // Deselect all
      setSelectedRows(new Set());
      onRowSelect?.([]);
    } else {
      // Select all
      const allKeys = new Set(sortedData.map((record, index) => getRowKey(record, index)));
      setSelectedRows(allKeys);
      onRowSelect?.(sortedData);
    }
  };

  const isAllSelected = selectedRows.size === sortedData.length && sortedData.length > 0;
  const isIndeterminate = selectedRows.size > 0 && selectedRows.size < sortedData.length;

  // Render sort icon
  const renderSortIcon = (column: Column<T>) => {
    if (!column.sortable) return null;

    const isActive = sortState.key === column.key;
    
    return (
      <div className="ml-1 flex flex-col">
        <ChevronUp 
          className={`h-3 w-3 ${isActive && sortState.direction === 'asc' ? 'text-blue-600' : 'text-gray-400'}`}
        />
        <ChevronDown 
          className={`h-3 w-3 -mt-1 ${isActive && sortState.direction === 'desc' ? 'text-blue-600' : 'text-gray-400'}`}
        />
      </div>
    );
  };

  // Empty state
  const renderEmptyState = () => (
    <tr>
      <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-500">
          <Database className="h-12 w-12" />
          <p className="text-lg font-medium">{emptyStateText}</p>
          <p className="text-sm">No records to display at this time.</p>
        </div>
      </td>
    </tr>
  );

  // Loading state
  const renderLoadingState = () => (
    <tr>
      <td colSpan={columns.length + (selectable ? 1 : 0)} className="px-6 py-12 text-center">
        <div className="flex flex-col items-center justify-center space-y-3 text-gray-500">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <p className="text-lg font-medium">Loading...</p>
          <p className="text-sm">Please wait while we fetch your data.</p>
        </div>
      </td>
    </tr>
  );

  return (
    <div className={`overflow-hidden border border-gray-200 rounded-lg ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {selectable && (
                <th className="px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={input => {
                      if (input) input.indeterminate = isIndeterminate;
                    }}
                    onChange={handleSelectAll}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map(column => (
                <th
                  key={column.key}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100 select-none' : ''
                  }`}
                  onClick={() => handleSort(column)}
                  style={{ width: column.width }}
                  role={column.sortable ? 'button' : undefined}
                  tabIndex={column.sortable ? 0 : undefined}
                  onKeyDown={column.sortable ? (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSort(column);
                    }
                  } : undefined}
                  aria-sort={
                    sortState.key === column.key
                      ? sortState.direction === 'asc' ? 'ascending' : 'descending'
                      : 'none'
                  }
                >
                  <div className="flex items-center justify-between">
                    <span>{column.title}</span>
                    {renderSortIcon(column)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              renderLoadingState()
            ) : sortedData.length === 0 ? (
              renderEmptyState()
            ) : (
              sortedData.map((record, index) => {
                const recordKey = getRowKey(record, index);
                const isSelected = selectedRows.has(recordKey);
                
                return (
                  <tr
                    key={recordKey}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${
                      isSelected ? 'bg-blue-50' : ''
                    }`}
                  >
                    {selectable && (
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleRowSelect(recordKey, record)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          aria-label={`Select row ${index + 1}`}
                        />
                      </td>
                    )}
                    {columns.map(column => {
                      const cellValue = record[column.dataIndex];
                      const displayValue = column.render
                        ? column.render(cellValue, record, index)
                        : cellValue;
                      
                      return (
                        <td
                          key={`${recordKey}-${column.key}`}
                          className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                        >
                          {displayValue}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Table footer with selection info */}
      {selectable && selectedRows.size > 0 && !loading && (
        <div className="bg-blue-50 px-6 py-3 border-t border-blue-200">
          <div className="flex items-center justify-between">
            <span className="text-sm text-blue-700">
              {selectedRows.size} of {sortedData.length} rows selected
            </span>
            <button
              onClick={() => {
                setSelectedRows(new Set());
                onRowSelect?.([]);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Demo Component
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
  score: number;
}

const DataTableDemo = () => {
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const sampleData: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-08-15',
      score: 95
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'User',
      status: 'active',
      lastLogin: '2024-08-14',
      score: 87
    },
    {
      id: 3,
      name: 'Bob Wilson',
      email: 'bob@example.com',
      role: 'Editor',
      status: 'inactive',
      lastLogin: '2024-08-10',
      score: 76
    },
    {
      id: 4,
      name: 'Alice Brown',
      email: 'alice@example.com',
      role: 'User',
      status: 'active',
      lastLogin: '2024-08-16',
      score: 92
    },
    {
      id: 5,
      name: 'Charlie Davis',
      email: 'charlie@example.com',
      role: 'Admin',
      status: 'active',
      lastLogin: '2024-08-13',
      score: 88
    }
  ];

  const columns: Column<User>[] = [
    {
      key: 'name',
      title: 'Name',
      dataIndex: 'name',
      sortable: true,
      width: '200px'
    },
    {
      key: 'email',
      title: 'Email',
      dataIndex: 'email',
      sortable: true,
      width: '250px'
    },
    {
      key: 'role',
      title: 'Role',
      dataIndex: 'role',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'Admin' ? 'bg-purple-100 text-purple-800' :
          value === 'Editor' ? 'bg-blue-100 text-blue-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'status',
      title: 'Status',
      dataIndex: 'status',
      sortable: true,
      width: '120px',
      render: (value) => (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
          value === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value}
        </span>
      )
    },
    {
      key: 'score',
      title: 'Score',
      dataIndex: 'score',
      sortable: true,
      width: '100px',
      render: (value) => (
        <div className="flex items-center">
          <span className="mr-2">{value}</span>
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full"
              style={{ width: `${value}%` }}
            />
          </div>
        </div>
      )
    },
    {
      key: 'lastLogin',
      title: 'Last Login',
      dataIndex: 'lastLogin',
      sortable: true,
      width: '150px'
    }
  ];

  const handleLoadingDemo = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">DataTable Component</h1>
        <p className="text-gray-600">Feature-rich data table with sorting, selection, and loading states</p>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleLoadingDemo}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Loading...' : 'Demo Loading State'}
          </button>
          <span className="text-sm text-gray-600">
            Selected: {selectedUsers.length} users
          </span>
        </div>
      </div>

      {/* Main DataTable */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Interactive Data Table</h2>
        <DataTable
          data={sampleData}
          columns={columns}
          loading={loading}
          selectable
          onRowSelect={setSelectedUsers}
          rowKey="id"
        />
      </div>

      {/* Selected Users Display */}
      {selectedUsers.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Selected Users</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="space-y-2">
              {selectedUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between text-sm">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-gray-600">{user.email}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State Demo */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">Empty State</h2>
        <DataTable
          data={[]}
          columns={columns}
          emptyStateText="No users found"
        />
      </div>

      {/* Different Features Demo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Non-selectable Table</h3>
          <DataTable
            data={sampleData.slice(0, 3)}
            columns={columns.slice(0, 4)}
            selectable={false}
          />
        </div>

        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Custom Rendering</h3>
          <DataTable
            data={[
              { id: 1, product: 'iPhone 14', price: 999, stock: 50, category: 'Electronics' },
              { id: 2, product: 'MacBook Pro', price: 2399, stock: 25, category: 'Computers' },
              { id: 3, product: 'AirPods Pro', price: 249, stock: 0, category: 'Audio' }
            ]}
            columns={[
              {
                key: 'product',
                title: 'Product',
                dataIndex: 'product',
                sortable: true
              },
              {
                key: 'price',
                title: 'Price',
                dataIndex: 'price',
                sortable: true,
                render: (value) => `${value.toLocaleString()}`
              },
              {
                key: 'stock',
                title: 'Stock',
                dataIndex: 'stock',
                sortable: true,
                render: (value) => (
                  <span className={`font-medium ${
                    value === 0 ? 'text-red-600' : 
                    value < 30 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {value === 0 ? 'Out of Stock' : `${value} units`}
                  </span>
                )
              }
            ]}
          />
        </div>
      </div>

      {/* Features Overview */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Features Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Sorting</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Click column headers to sort</li>
              <li>• Three-state sorting (asc/desc/none)</li>
              <li>• Visual sort indicators</li>
              <li>• Keyboard navigation support</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Selection</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Individual row selection</li>
              <li>• Select all functionality</li>
              <li>• Indeterminate state support</li>
              <li>• Selection feedback</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">States & Features</h4>
            <ul className="text-gray-600 space-y-1">
              <li>• Loading state with spinner</li>
              <li>• Empty state with icon</li>
              <li>• Custom cell rendering</li>
              <li>• Responsive design</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataTableDemo;