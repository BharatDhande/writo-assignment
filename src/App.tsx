import React, { useState } from 'react';
import './App.css'; // Ensure you have your styles here

interface Column {
  name: string;
  type: 'string' | 'number';
}

function App() {
  const [columns, setColumns] = useState<Column[]>([]);
  const [rows, setRows] = useState<(string | number)[][]>([]);
  const [newColumnName, setNewColumnName] = useState<string>('');
  const [filterValue, setFilterValue] = useState<string>('');
  const [filterColumnIndex, setFilterColumnIndex] = useState<number | null>(null);
  const [sortColumnIndex, setSortColumnIndex] = useState<number | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

  const handleAddColumn = (type: 'string' | 'number') => {
    if (newColumnName.trim()) {
      setColumns([...columns, { name: newColumnName, type }]);
      setRows(rows.map(row => [...row, type === 'string' ? '' : 0])); // Initialize with empty value
      setNewColumnName(''); // Clear the input field
    }
  };

  const handleAddRow = () => {
    const newRow = columns.map(col => (col.type === 'string' ? '' : 0));
    setRows([...rows, newRow]);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string | number) => {
    const updatedRows = [...rows];
    updatedRows[rowIndex][colIndex] = value;
    setRows(updatedRows);
  };

  const handleFilter = () => {
    if (filterColumnIndex !== null) {
      const filteredRows = rows.filter(row => row[filterColumnIndex]?.toString() === filterValue);
      setRows(filteredRows);
    }
  };

  const handleSort = () => {
    if (sortColumnIndex !== null) {
      const sortedRows = [...rows].sort((a, b) => {
        const aValue = a[sortColumnIndex];
        const bValue = b[sortColumnIndex];

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : 1;
        } else {
          return aValue > bValue ? -1 : 1;
        }
      });
      setRows(sortedRows);
    }
  };

  return (
    <div className="App">
      <div className="table-container">
        <h1>Dynamic Table</h1>

        {/* Input for Column Name */}
        <input
          type="text"
          value={newColumnName}
          onChange={(e) => setNewColumnName(e.target.value)}
          placeholder="Enter column name"
        />

        {/* Add Column Buttons */}
        <div className="add-column">
          <button onClick={() => handleAddColumn('string')}>Add String Column</button>
          <button onClick={() => handleAddColumn('number')}>Add Number Column</button>
        </div>

        {/* Add Row Button */}
        <button className="add-row" onClick={handleAddRow}>Add Row</button>

        {/* Filter Section */}
        <div className="filter-section">
          <input
            type="text"
            value={filterValue}
            onChange={(e) => setFilterValue(e.target.value)}
            placeholder="Filter value"
          />
          <select onChange={(e) => setFilterColumnIndex(parseInt(e.target.value))}>
            <option value="">Select column to filter</option>
            {columns.map((col, index) => (
              <option key={index} value={index}>{col.name}</option>
            ))}
          </select>
          <button onClick={handleFilter}>Filter Rows</button>
        </div>

        {/* Sort Section */}
        <div className="sort-section">
          <select onChange={(e) => setSortColumnIndex(parseInt(e.target.value))}>
            <option value="">Select column to sort</option>
            {columns.map((col, index) => (
              <option key={index} value={index}>{col.name}</option>
            ))}
          </select>
          <select onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}>
            <option value="">Select order</option>
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
          <button onClick={handleSort}>Sort Rows</button>
        </div>

        {/* Render Table */}
        {columns.length > 0 ? (
          <table className="dynamic-table">
            <thead>
              <tr>
                {columns.map((col, index) => (
                  <th key={index}>{col.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {columns.map((col, colIndex) => (
                    <td key={colIndex}>
                      <input
                        type={col.type === 'string' ? 'text' : 'number'}
                        value={row[colIndex] || ''}
                        onChange={(e) =>
                          handleCellChange(rowIndex, colIndex, col.type === 'number' ? +e.target.value : e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No columns added yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;
