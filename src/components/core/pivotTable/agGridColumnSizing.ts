// (C) 2007-2020 GoodData Corporation
import cloneDeep = require("lodash/cloneDeep");
import { Execution, AFM } from "@gooddata/typings";
import {
    getAttributeLocators,
    getIdsFromUri,
    getLastFieldId,
    getLastFieldType,
    getParsedFields,
    getTreeLeaves,
    getColumnIdentifierFromDef,
    getColumnIdentifier,
    isMeasureColumn,
    isMeasureColumnReadyToRender,
    getMeasureFormat,
    isSomeTotal,
} from "./agGridUtils";
import {
    FIELD_SEPARATOR,
    FIELD_TYPE_ATTRIBUTE,
    FIELD_TYPE_MEASURE,
    ID_SEPARATOR,
    VALUE_CLASS,
    HEADER_LABEL_CLASS,
    DEFAULT_FONT,
    ROW_SUBTOTAL_CLASS,
} from "./agGridConst";
import { assortDimensionHeaders, identifyResponseHeader } from "./agGridHeaders";
import invariant = require("invariant");

import {
    IAttributeColumnWidthItem,
    IAbsoluteColumnWidth,
    IMeasureColumnWidthItem,
    isMeasureLocatorItem,
    isAttributeColumnWidthItem,
    ColumnWidthItem,
    isMeasureColumnWidthItem,
    IResizedColumns,
    ColumnWidth,
    isAbsoluteColumnWidth,
} from "../../../interfaces/PivotTable";
import { IGridHeader, IGridRow } from "./agGridTypes";
import { ColumnApi, Column, GridApi, ColDef } from "ag-grid-community";
import {
    ResizedColumnsStore,
    IResizedColumnsCollection,
    IWeakMeasureColumnWidthItemsMap,
} from "./ResizedColumnsStore";
import { getMeasureCellFormattedValue } from "../../../helpers/tableCell";

export const MIN_WIDTH = 60;
export const AUTO_SIZED_MAX_WIDTH = 500;
export const MANUALLY_SIZED_MAX_WIDTH = 2000;
const SORT_ICON_WIDTH = 12;

/*
 * All code related to column resizing the ag-grid backed Pivot Table is concentrated here
 */

export const convertColumnWidthsToMap = (
    columnWidths: ColumnWidthItem[],
    executionResponse: Execution.IExecutionResponse,
    widthValidator: (width: ColumnWidth) => ColumnWidth = defaultWidthValidator,
): IResizedColumnsCollection => {
    if (!columnWidths || !executionResponse) {
        return {};
    }
    const { dimensions } = executionResponse;

    const columnWidthsMap: IResizedColumnsCollection = {};
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders(dimensions);
    columnWidths.forEach((columnWidth: ColumnWidthItem) => {
        if (isAttributeColumnWidthItem(columnWidth)) {
            const [field, width] = getAttributeColumnWidthItemFieldAndWidth(columnWidth, attributeHeaders);
            columnWidthsMap[field] = {
                width: widthValidator(width),
            };
        }
        if (isMeasureColumnWidthItem(columnWidth)) {
            const [field, width] = getMeasureColumnWidthItemFieldAndWidth(columnWidth, measureHeaderItems);

            const locator: AFM.IMeasureLocatorItem = columnWidth.measureColumnWidthItem.locators.filter(
                isMeasureLocatorItem,
            )[0];
            const measureIdentifier = locator ? locator.measureLocatorItem.measureIdentifier : undefined;
            columnWidthsMap[field] = {
                width: widthValidator(width),
                measureIdentifier,
            };
        }
    });
    return columnWidthsMap;
};

const getAttributeColumnWidthItemFieldAndWidth = (
    columnWidthItem: IAttributeColumnWidthItem,
    attributeHeaders: Execution.IAttributeHeader[],
): [string, IAbsoluteColumnWidth] => {
    const localIdentifier = columnWidthItem.attributeColumnWidthItem.attributeIdentifier;

    const attributeHeader = attributeHeaders.find(
        header => header.attributeHeader.localIdentifier === localIdentifier,
    );
    invariant(attributeHeader, `Could not find attributeHeader with localIdentifier "${localIdentifier}"`);

    const field = identifyResponseHeader(attributeHeader);
    return [field, columnWidthItem.attributeColumnWidthItem.width];
};

const getMeasureColumnWidthItemFieldAndWidth = (
    columnWidthItem: IMeasureColumnWidthItem,
    measureHeaderItems: Execution.IMeasureHeaderItem[],
): [string, ColumnWidth] => {
    const keys: string[] = [];
    columnWidthItem.measureColumnWidthItem.locators.forEach(locator => {
        if (isMeasureLocatorItem(locator)) {
            const measureColumnWidthHeaderIndex = measureHeaderItems.findIndex(
                measureHeaderItem =>
                    measureHeaderItem.measureHeaderItem.localIdentifier ===
                    locator.measureLocatorItem.measureIdentifier,
            );
            invariant(
                measureColumnWidthHeaderIndex !== -1,
                `Could not find measureHeader with localIdentifier "${
                    locator.measureLocatorItem.measureIdentifier
                }"`,
            );
            keys.push(`m${ID_SEPARATOR}${measureColumnWidthHeaderIndex}`);
        } else {
            const key = `a${ID_SEPARATOR}${getIdsFromUri(locator.attributeLocatorItem.element).join(
                ID_SEPARATOR,
            )}`;
            keys.push(key);
        }
    });
    const field = keys.join(FIELD_SEPARATOR); // check if keys is empty than *
    return [field, columnWidthItem.measureColumnWidthItem.width];
};

const getSizeItemByColId = (
    execution: Execution.IExecutionResponses,
    colId: string,
    width: ColumnWidth,
): ColumnWidthItem => {
    const { dimensions } = execution.executionResponse;
    const fields = getParsedFields(colId);
    const lastFieldType = getLastFieldType(fields);
    const lastFieldId = getLastFieldId(fields);
    const searchDimensionIndex = lastFieldType === FIELD_TYPE_MEASURE ? 1 : 0;
    const { attributeHeaders, measureHeaderItems } = assortDimensionHeaders([
        dimensions[searchDimensionIndex],
    ]);

    if (lastFieldType === FIELD_TYPE_ATTRIBUTE) {
        for (const header of attributeHeaders) {
            if (getIdsFromUri(header.attributeHeader.uri)[0] === lastFieldId) {
                const attributeIdentifier = header.attributeHeader.localIdentifier;
                if (isAbsoluteColumnWidth(width)) {
                    return {
                        attributeColumnWidthItem: {
                            width,
                            attributeIdentifier,
                        },
                    };
                } else {
                    invariant(false, `width value for attributeColumnWidthItem has to be number ${colId}`);
                }
            }
        }
        // check only column attribute without measure
        const { attributeHeaders: columnAttributeHeaders } = assortDimensionHeaders([dimensions[1]]);

        const EMPTY_MEASURE_FIELD: string[] = [];
        const attributeLocators = getAttributeLocators(
            [...fields, EMPTY_MEASURE_FIELD],
            columnAttributeHeaders,
        );
        if (attributeLocators) {
            return {
                measureColumnWidthItem: {
                    width,
                    locators: [...attributeLocators],
                },
            };
        }

        invariant(false, `could not find attribute header matching ${colId}`);
    } else if (lastFieldType === FIELD_TYPE_MEASURE) {
        const headerItem = measureHeaderItems[parseInt(lastFieldId, 10)];
        const attributeLocators = getAttributeLocators(fields, attributeHeaders);

        return {
            measureColumnWidthItem: {
                width,
                locators: [
                    ...attributeLocators,
                    {
                        measureLocatorItem: {
                            measureIdentifier: headerItem.measureHeaderItem.localIdentifier,
                        },
                    },
                ],
            },
        };
    }
    invariant(false, `could not find header matching ${colId}`);
};

export const getColumnWidthsFromMap = (
    map: IResizedColumnsCollection,
    execution: Execution.IExecutionResponses,
): ColumnWidthItem[] => {
    return Object.keys(map).map((colId: string) => {
        const { width } = map[colId];
        const sizeItem = getSizeItemByColId(execution, colId, width);
        invariant(sizeItem, `unable to find size item by filed ${colId}`);
        return sizeItem;
    });
};

export const getWeakColumnWidthsFromMap = (map: IWeakMeasureColumnWidthItemsMap): ColumnWidthItem[] => {
    return Object.keys(map).map((measureIdentifier: string) => {
        return map[measureIdentifier];
    });
};

export const defaultWidthValidator = (width: ColumnWidth): ColumnWidth => {
    if (isAbsoluteColumnWidth(width)) {
        return {
            ...width,
            value: Math.min(Math.max(width.value, MIN_WIDTH), MANUALLY_SIZED_MAX_WIDTH),
        };
    }
    return width;
};

export const enrichColumnDefinitionsWithWidths = (
    columnDefinitions: IGridHeader[],
    resizedColumnsStore: ResizedColumnsStore,
    autoResizedColumns: IResizedColumns,
    defaultColumnWidth: number,
    isGrowToFitEnabled: boolean,
    growToFittedColumns: IResizedColumns = {},
): IGridHeader[] => {
    const result = cloneDeep(columnDefinitions);
    const leaves = getTreeLeaves(result);
    leaves.forEach((columnDefinition: IGridHeader) => {
        if (columnDefinition) {
            const columnId = getColumnIdentifierFromDef(columnDefinition);
            const manualSize = resizedColumnsStore.getManuallyResizedColumn(columnDefinition);
            const autoResizeSize = autoResizedColumns[columnId];

            columnDefinition.maxWidth = MANUALLY_SIZED_MAX_WIDTH;

            if (manualSize) {
                columnDefinition.width = manualSize.width;
                columnDefinition.suppressSizeToFit = !manualSize.allowGrowToFit;
            } else {
                columnDefinition.suppressSizeToFit = false;
                columnDefinition.width = autoResizeSize ? autoResizeSize.width : defaultColumnWidth;
                if (isGrowToFitEnabled) {
                    const growToFittedColumn =
                        growToFittedColumns[getColumnIdentifierFromDef(columnDefinition)];

                    if (growToFittedColumn) {
                        columnDefinition.width = growToFittedColumn.width;
                        if (growToFittedColumn.width > MANUALLY_SIZED_MAX_WIDTH) {
                            columnDefinition.maxWidth = undefined;
                        }
                    }
                }
            }
        }
    });
    return result;
};

export const syncSuppressSizeToFitOnColumns = (
    resizedColumnsStore: ResizedColumnsStore,
    columnApi: ColumnApi,
) => {
    if (!columnApi) {
        return;
    }

    const columns = columnApi.getAllColumns();

    columns.forEach(col => {
        const resizedColumn = resizedColumnsStore.getManuallyResizedColumn(col);
        resizedColumn
            ? (col.getColDef().suppressSizeToFit = !resizedColumn.allowGrowToFit)
            : (col.getColDef().suppressSizeToFit = false);
    });
};

export const isColumnAutoResized = (autoResizedColumns: IResizedColumns, resizedColumnId: string) =>
    resizedColumnId && autoResizedColumns[resizedColumnId];

export const resetColumnsWidthToDefault = (
    columnApi: ColumnApi,
    columns: Column[],
    resizedColumnsStore: ResizedColumnsStore,
    autoResizedColumns: IResizedColumns,
    defaultWidth: number,
) => {
    columns.forEach(col => {
        const id = getColumnIdentifier(col);
        if (resizedColumnsStore.isColumnManuallyResized(col)) {
            const manuallyResizedColumn = resizedColumnsStore.getManuallyResizedColumn(col);
            columnApi.setColumnWidth(col, manuallyResizedColumn.width);
        } else if (isColumnAutoResized(autoResizedColumns, id)) {
            columnApi.setColumnWidth(col, autoResizedColumns[id].width);
        } else {
            columnApi.setColumnWidth(col, defaultWidth);
        }
    });
};

export const resizeAllMeasuresColumns = (
    columnApi: ColumnApi,
    resizedColumnsStore: ResizedColumnsStore,
    column: Column,
) => {
    const columnWidth = column.getActualWidth();
    const allColumns = columnApi.getAllColumns();

    allColumns.forEach(col => {
        if (isMeasureColumn(col)) {
            columnApi.setColumnWidth(col, columnWidth);
        }
    });
    resizedColumnsStore.addAllMeasureColumn(columnWidth, allColumns);
};

export const resizeWeakMeasureColumns = (
    columnApi: ColumnApi,
    resizedColumnsStore: ResizedColumnsStore,
    column: Column,
) => {
    const allColumns = columnApi.getAllColumns();
    resizedColumnsStore.addWeekMeasureColumn(column);
    allColumns.forEach(col => {
        const weakColumnWidth = resizedColumnsStore.getMatchedWeakMeasuresColumnWidth(col);
        if (isMeasureColumn(col) && weakColumnWidth) {
            columnApi.setColumnWidth(col, weakColumnWidth.measureColumnWidthItem.width.value);
            col.getColDef().suppressSizeToFit = true;
        }
    });
};

export const getAllowGrowToFitProp = (allowGrowToFit: boolean) => (allowGrowToFit ? { allowGrowToFit } : {});

/**
 * Custom implementation of columns autoresizing according content
 */

const collectMaxWidth = (
    context: CanvasRenderingContext2D,
    text: string,
    group: string,
    hasSort: boolean = false,
    maxWidths: Map<string, number>,
) => {
    const width = hasSort
        ? context.measureText(text).width + SORT_ICON_WIDTH
        : context.measureText(text).width;

    const maxWidth = maxWidths.get(group);
    // console.log(text, width, maxWidth);

    if (maxWidth === undefined || width > maxWidth) {
        maxWidths.set(group, width);
    }
};

const collectMaxWidthCached = (
    context: CanvasRenderingContext2D,
    text: string,
    group: string,
    maxWidths: Map<string, number>,
    widthsCache: Map<string, number>,
) => {
    const cachedWidth = widthsCache.get(text);

    let width;

    if (cachedWidth === undefined) {
        width = context.measureText(text).width;
        widthsCache.set(text, width);
    } else {
        // console.log("cache hit");
        width = cachedWidth;
    }

    const maxWidth = maxWidths.get(group);
    // console.log(text, width, maxWidth);

    if (maxWidth === undefined || width > maxWidth) {
        maxWidths.set(group, width);
    }
};

const valueFormatter = (
    text: string,
    colDef: IGridHeader,
    execution: Execution.IExecutionResponses,
    separators: any,
) => {
    return isMeasureColumnReadyToRender({ value: text }, execution)
        ? getMeasureCellFormattedValue(text, getMeasureFormat(colDef, execution), separators)
        : null;
};

const calculateColumnWidths = (config: any) => {
    console.time("Column widths calculation");
    const { context } = config;

    const maxWidths = new Map<string, number>();

    if (config.measureHeaders) {
        context.font = config.headerFont;

        config.columnDefs.forEach((column: IGridHeader) => {
            collectMaxWidth(context, column.headerName, column.field, !!column.sort, maxWidths);
        });
    }

    config.rowData.forEach((row: IGridRow) => {
        context.font = isSomeTotal(row.type) ? config.totalFont : config.rowFont;
        config.columnDefs.forEach((column: IGridHeader) => {
            const text = row[column.field];
            const formattedText =
                isMeasureColumn(column) && valueFormatter(text, column, config.execution, config.separators);
            const textForCalculation = formattedText || text;
            if (config.cache) {
                collectMaxWidthCached(context, textForCalculation, column.field, maxWidths, config.cache);
            } else {
                collectMaxWidth(context, textForCalculation, column.field, false, maxWidths);
            }
        });
    });

    const updatedColumnDefs = config.columnDefs.map((cd: IGridHeader) => {
        // console.log("calculated max width", maxWidths.get(cd.field))
        const newWidth = Math.ceil(maxWidths.get(cd.field) + config.padding);
        return {
            ...cd,
            width: Math.min(Math.max(MIN_WIDTH, newWidth), AUTO_SIZED_MAX_WIDTH),
        };
    });

    console.timeEnd("Column widths calculation");

    return updatedColumnDefs;
};

export const autoresizeAllColumns = (
    columnDefs: ColDef[],
    rowData: IGridRow[],
    gridApi: GridApi,
    columnApi: ColumnApi,
    execution: Execution.IExecutionResponses,
    options: {
        measureHeaders: boolean;
        headerFont: string;
        totalFont: string;
        rowFont: string;
        padding: number;
        separators: any;
        useWidthsCache: boolean;
    },
) => {
    console.time("Resize all columns (including widths calculation)");

    if (gridApi && columnApi) {
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        const updatedColumDefs = calculateColumnWidths({
            context,
            columnDefs,
            rowData,
            execution,
            measureHeaders: options.measureHeaders,
            headerFont: options.headerFont,
            totalFont: options.totalFont,
            rowFont: options.rowFont,
            padding: options.padding,
            separators: options.separators,
            cache: options.useWidthsCache ? new Map() : null,
        });

        // Setting width by setColumnWidth has the advantage of preserving column
        // changes done by user such as sorting or filters. The disadvantage is that
        // initial resize might be slow if the grid was scrolled towards later columns
        // before resizing was invoked (bug in the gird?).
        // Resize by gridApi.setColumnDefs(updatedColumDefs) or setColumnDefs(updatedColumDefs)
        // should be faster but columns settings could be reset (mind deltaColumnMode)...
        const autoResizedColumns = {};
        updatedColumDefs.forEach((columnDef: ColDef) => {
            // console.log(columnDef.field, columnDef.width);
            columnApi.setColumnWidth(columnDef.field, columnDef.width);
            autoResizedColumns[getColumnIdentifier(columnDef)] = {
                width: columnDef.width,
            };
        });
        console.timeEnd("Resize all columns (including widths calculation)");
        return autoResizedColumns;
    }
};

const getTableFont = (containerRef: HTMLDivElement, className: string) => {
    const element = containerRef.getElementsByClassName(className)[0];
    let font = DEFAULT_FONT;
    if (element) {
        font = window.getComputedStyle(element).font;
    }
    return font;
};

export const getTableFonts = (containerRef: HTMLDivElement) => {
    // TODO INE: All fonts are gotten from first column and its header and first cell. Once we will have font different for each cell/header/row this will not work
    const headerFont = getTableFont(containerRef, HEADER_LABEL_CLASS);
    const rowFont = getTableFont(containerRef, VALUE_CLASS);
    const rowSubtotalFont = getTableFont(containerRef, ROW_SUBTOTAL_CLASS);
    return { headerFont, rowFont, rowSubtotalFont };
};
