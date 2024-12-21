import { SetStateAction, useEffect, useState, ElementType } from "react";
import styled from "styled-components";
import Entries from "../components/Entries";
import EntriesFooter from "../components/EntriesFooter";
import Sort from "../components/Sort";
import SearchBar from "../components/SearchBar";

const StyledTable = styled.table`
  // Ajoutez ici vos styles
`;

const StyledThead = styled.thead`
  // Ajoutez ici vos styles
`;

const StyledTbody = styled.tbody`
  // Ajoutez ici vos styles
`;

const StyledTr = styled.tr`
  // Ajoutez ici vos styles
`;

const StyledTh = styled.th`
  // Ajoutez ici vos styles
`;

const StyledTd = styled.td`
  // Ajoutez ici vos styles
`;

export interface IDataTableProps<T extends object> {
  data: T[];
  title?: string;
  columnOrder?: string[];
  columnTitle?: string[];
  entries?: boolean;
  sort?: boolean;
  searchBar?: boolean;
  styleDataTable?: ElementType;
  styleToolsBar?: ElementType;
  styleTableContainer?: ElementType;
  styleTable?: ElementType;
  styleThead?: ElementType;
  styleTbody?: ElementType;
  styleTr?: ElementType;
  styleEntries?: ElementType;
  styleEntriesFooter?: ElementType;
  stylePrevNext?: ElementType;
  stylePage?: ElementType;
}

export function DataTable<T extends object>({
  data,
  title,
  columnOrder,
  columnTitle,
  entries,
  sort,
  searchBar,
  styleDataTable: Container = "div" as ElementType,
  styleToolsBar: ToolsBar = "div" as ElementType,
  styleTableContainer: TableWrapper = "div" as ElementType,
}: Readonly<IDataTableProps<T>>) {
  const [nbrEntries, setNbrEntries] = useState<string>("10");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [newData, setNewData] = useState<T[]>(data);
  const [newFilterData, setNewFilterData] = useState<T[]>(data);
  const [visibleData, setVisibleData] = useState<T[]>(
    data.slice(0, Number(nbrEntries))
  );

  useEffect(() => {
    if (data) {
      setNewData(data);
      setNewFilterData(data);
      setVisibleData(data.slice(0, Number(nbrEntries)));
    }
  }, [data, nbrEntries]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * Number(nbrEntries);
    const endIndex = startIndex + Number(nbrEntries);
    const tableData = newData.slice(startIndex, endIndex);
    setVisibleData(tableData);
  }, [currentPage, data, nbrEntries, newData]);

  const handleEntriesChange = (newEntries: SetStateAction<string>) => {
    setNbrEntries(newEntries);
    setCurrentPage(1);
  };

  const handleChangePage = (newPage: SetStateAction<number>) => {
    setCurrentPage(newPage);
  };

  const handleFilterData = (value: SetStateAction<T[]>) => {
    setNewData(value);
  };

  const handleSearchData = (value: SetStateAction<T[]>) => {
    setNewData(value);
    setNewFilterData(value);
  };

  if (!data || data.length === 0 || data === undefined) {
    return <p>Aucune donnée à afficher.</p>;
  }

  let columns = Object.keys(data[0]);
  if (columnOrder !== undefined) {
    columns = columnOrder;
  }

  return (
    <Container as={Container}>
      {title && <h2>{title}</h2>}
      <ToolsBar as={ToolsBar}>
        {entries && <Entries onEntriesChange={handleEntriesChange} />}
        {searchBar && (
          <SearchBar<T> data={data} onChangeData={handleSearchData} />
        )}
      </ToolsBar>

      <TableWrapper as={TableWrapper}>
        <StyledTable id="main-table">
          <StyledThead>
            {columnTitle && (
              <StyledTr>
                {columnTitle.map((column, index) => {
                  if (sort === true) {
                    return (
                      <Sort<T>
                        key={index}
                        data={newData}
                        originData={newFilterData}
                        onChangeData={handleFilterData}
                        element={column}
                        keyIndex={index}
                        dataColumn={columns}
                      />
                    );
                  } else {
                    return <StyledTh key={index}>{column}</StyledTh>;
                  }
                })}
              </StyledTr>
            )}
          </StyledThead>
          <StyledTbody>
            {visibleData.map((rowData, rowIndex) => (
              <StyledTr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <StyledTd key={colIndex}>
                    {String(rowData[column as keyof T])}
                  </StyledTd>
                ))}
              </StyledTr>
            ))}
          </StyledTbody>
        </StyledTable>
      </TableWrapper>

      {entries && (
        <EntriesFooter
          entries={nbrEntries}
          total={newData.length}
          page={currentPage}
          onChangePage={handleChangePage}
        />
      )}
    </Container>
  );
}
