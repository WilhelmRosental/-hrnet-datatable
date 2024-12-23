import { MouseEvent, useState } from "react";
import styled from "styled-components";

interface IFilterProps<T extends object> {
  data: T[];
  originData: T[];
  onChangeData: (value: T[]) => void;
  element: string;
  keyIndex: number;
  dataColumn: string[];
}

interface SortableThProps {
  $isActive: boolean;
}

const SortableTh = styled.th<SortableThProps>`
  cursor: pointer;
  padding: 12px 4px;
  text-align: center;
  background-color: ${({ $isActive }) =>
    $isActive ? "#f1f1f1" : "transparent"};
  &:hover {
    background-color: #e0e0e0;
  }
`;

/**
 * Composant gérant le tri d'une colonne d'un tableau de données.
 * @template T - Type générique représentant la structure des données.
 * @param {T[]} data - Données courantes affichées.
 * @param {T[]} originData - Données d'origine avant filtrage.
 * @param {(value: T[]) => void} onChangeData - Fonction de rappel pour renvoyer les données triées.
 * @param {string} element - Nom d'affichage de la colonne.
 * @param {number} keyIndex - Index de la colonne.
 * @param {string[]} dataColumn - Tableau des clés de colonnes.
 */
export default function Sort<T extends object>({
  data,
  originData,
  onChangeData,
  element,
  keyIndex,
  dataColumn,
}: Readonly<IFilterProps<T>>) {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | "none">("none");
  const [indicator, setIndicator] = useState("");

  const handleSortChange = () => {
    switch (sortOrder) {
      case "asc":
        return "desc";
      case "desc":
        return "none";
      case "none":
        return "asc";
      default:
        return "none";
    }
  };

  const clickForFilter = (columnName: MouseEvent<HTMLTableCellElement>) => {
    const stateOrder = handleSortChange();
    setSortOrder(stateOrder);
    getSortIndicator(stateOrder);

    const cellElement = columnName.currentTarget.cellIndex;
    const indexFilter = dataColumn[cellElement] as keyof T;

    let sortedData: T[] = [...data];

    switch (stateOrder) {
      case "asc":
        sortedData.sort((a, b) => {
          const valueA = a[indexFilter] as string;
          const valueB = b[indexFilter] as string;
          return valueA.localeCompare(valueB);
        });
        break;
      case "desc":
        sortedData.sort((a, b) => {
          const valueA = a[indexFilter] as string;
          const valueB = b[indexFilter] as string;
          return valueB.localeCompare(valueA);
        });
        break;
      default:
        sortedData = originData;
    }

    onChangeData(sortedData);
  };

  const getSortIndicator = (stateOrder: "asc" | "desc" | "none") => {
    switch (stateOrder) {
      case "asc":
        setIndicator("↑");
        break;
      case "desc":
        setIndicator("↓");
        break;
      default:
        setIndicator("");
    }
  };

  return (
    <SortableTh
      $isActive={sortOrder !== "none"}
      key={keyIndex}
      onClick={(e) => clickForFilter(e)}
    >
      {element} {indicator}
    </SortableTh>
  );
}
