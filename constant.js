"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INITIAL_COLUMNS = exports.DDT_OBJECT = exports.OTHERS = exports.ACTIONS = exports.NOTIFY = exports.ROW_TYPE = exports.LABEL = exports.API = exports.MESSAGE = exports.TABLE_WITH_COLUMN = exports.COLUMNS_CAPITAL = exports.OTHER_COLUMNS = exports.COLUMNS = exports.ROWS = exports.DATATYPE = exports.COLUMN_TYPE = exports.PG_NAME = exports.BOOLEAN_VALUE = exports.MANDATORY_COLUMNS = exports.STATUS = exports.Seprator = exports.DEFAULT_LANGUAGE = exports.REGEX = exports.PG_URL = exports.VARIABLE = exports.ROW_LEVEL = exports.ID = exports.ONLY_PRIMARY_KEY_INSETION = exports.TABLES = exports.SHEET_TO_READ = void 0;
exports.SHEET_TO_READ = [
    {
        INDEX: 1,
        NAME: "PG&DBSheet",
    },
    {
        INDEX: 2,
        NAME: "AllPGSheet",
    },
    {
        INDEX: 3,
        NAME: "AllDDTSheet",
    },
    {
        INDEX: 4,
        NAME: "AllLabelSheet",
    },
    {
        INDEX: 7,
        NAME: "AllUnitSheet",
    },
];
exports.TABLES = [
    { TABLE: "t-PG", FIELDS: [{ PG: "PG" }] }, //0
    {
        TABLE: "t-Row", //1
        FIELDS: [
            { ROW: "Row" },
            { PG: "PG" },
            { ROWID: "RowID" },
            { ROW_LEVEL: "Row-Level" },
            { PARENT_ROW: "Parent-Row" },
            { SIBLING_ROW: "Sibling-Row" },
            { SHARE: "Share" },
            { INHERIT: "Inherit" },
            { ROW_TYPE: "Row-Type" },
        ],
    },
    {
        TABLE: "t-Col", //2
        FIELDS: [
            { COL: "Col" },
            { PG: "PG" },
            { COL_NAME: "Col-Name" },
            { DATA_TYPE: "Data-Type" },
            { DDT_SOURCE: "DDT-Source" },
        ],
    },
    {
        TABLE: "t-Share", //3
        FIELDS: [{ SHARE: "Share" }],
    },
    {
        TABLE: "t-Cell", //4
        FIELDS: [
            { CELL: "Cell" },
            { ROW: "Row" },
            { COL: "Col" },
            { CELL_OF_ITEMS: "Cell-#of-Items" },
        ],
    },
    {
        TABLE: "t-Item", //5
        FIELDS: [
            { ITEM: "Item" },
            { CELL: "Cell" },
            { DATA: "Data" },
            { INHERIT: "Inherit" },
        ],
    },
    {
        TABLE: "t-Data", //6
        FIELDS: [
            { DATA: "Data" },
            { DATA_TYPE: "Data-Type" },
            { ROW_DATA: "Row-Data" },
            { DATETIME_DATA: "DateTime-Data" },
            { COLOR_DATA: "Color-Data" },
            { INT_DATA: "Int-Data" },
            { BIGINT_DATA: "BigInt-Data" },
            { NUM_DATA: "Num-Data" },
            { JSON_DATA: "JSON-Data" },
            { QTY_DATA: "Qty-Data" },
            { UNIT_DATA: "Unit-Data" },
            { STD_QTY_DATA: "Std-Qty-Data" },
            { STD_UNIT_DATA: "Std-Unit-Data" },
            { DATA_RANGE: "Data-Range" },
            { FOREIGN_DATA: "Foreign-Data" },
        ],
    },
    {
        TABLE: "t-Format", //7
        FIELDS: [
            { FORMAT: "Format" },
            { COL: "Col" },
            { COL_ORDER: "Col-Order" },
            { COL_MIN_WIDTH: "Col-Min-Width" },
            { STATUS: "Status" },
            { CALCULATED: "Calculated" },
            { CALC_FORMULA: "Calc-Formula" },
            { DELETED: "Deleted" },
            { PG: "PG" },
            { PG_NESTED_COL: "PG-Nested-Col" },
            { PG_EXPAND: "PG-Expand" },
            { ITEM: "Item" },
            { ITEM_ORDER: "Item-Order" },
            { CELL: "Cell" },
            { DEFAULT: "Default" },
            { LANGUAGE: "Language" },
            { DATA: "Data" },
            { PG_FREEZE_COL: "PG-Freeze-Col" },
            { PG_LEVEL_SET: "PG-Level-Set" },
            { PG_SEARCH_SET: "PG-Search-Set" },
            { PG_SORT: "PG-Sort" },
            { PG_FILTER: "PG-Filter" },
            { ROW: "Row" },
            { SHOWSET_TICK: "ShowSet-Tick" },
            { SHARE: "Share" },
            { UNIT: "Unit" },
            { FONT_STYLE: "Font-Style" },
            { VALID_FORMAT: "Valid-Format" },
            { COMMENT: "Comment" },
            { AUDIT_TRAIL: "Audit-Trail" },
            { DELETED_BY: "Deleted-By" },
            { DELETED_AT: "Deleted-At" },
            { FORMULA: "Formula" },
        ],
    },
    {
        TABLE: "t-Tx", //8
        FIELDS: [
            { TX: "Tx" },
            { TX_TYPE: "Tx-Type" },
            { TX_OBJECTS: "Tx-Objects" },
            { TX_USER: "Tx-User" },
            { TX_DATETIME: "Tx-DateTime" },
            { TX_XID: "Tx-XID" },
        ],
    },
];
exports.ONLY_PRIMARY_KEY_INSETION = "default";
exports.ID = {
    INITIAL_ROWID: 1000000001,
    ALL_DDT_ID: 3000000002,
    ALL_LABEL_ID: 3000000003,
    ALL_UNIT_ID: 3000000005,
};
exports.ROW_LEVEL = [0, 1, 2, 3, 4, 5, 6];
exports.VARIABLE = {
    ONE: 1,
    EMPTY_STRING: "",
    STAR: "*",
    STRING_TYPE: "string",
    DEFAULT_PG_EXPAND: 99,
    SEMICOLON: ";",
    ROUND_BRACKET: "(",
    TEN: 10,
    START_CURLEY_BRACKET: "{",
    END_CURLEY_BRACKET: "}",
    COMMA: ",",
    ITEM_WITH_SAME_DATA: "checkOtherItemUsesSameData",
    SQL_TRANSACTION_ID: "txid_current()",
};
exports.PG_URL = "'{\"".concat(exports.VARIABLE.ONE, "\" : \"https://our_domain/PG ID/PG Name\"}'");
exports.REGEX = {
    SPLIT_COMMA_SEMICOLON: /[,;]/,
    SPLIT_SEMICOLON: /[;]/,
    CONVERT_OBJ_TO_INT: /[{}]/g,
};
exports.DEFAULT_LANGUAGE = {
    ENGLISH: "English",
};
exports.Seprator = {
    SEMICOLON: "; ",
};
exports.STATUS = {
    HIERARCHY: "Nested",
    MANDATORY: "Mandatory",
    SHARE: "Share",
    MANDATOR_COLUMN: "Item# ≥ 1",
    CALC: "Calc",
    HIDDEN: "Hidden",
    INHERIT: "Inherit",
};
exports.MANDATORY_COLUMNS = {
    ONE_ITEM: "Item# = 1",
    MORE_THAN_ONE_ITEM: "Item# ≥ 1",
    TWO_ITEMS: "Item# = 2",
    MORE_THAN_TWO_ITEMS: "Item# ≥ 2",
};
exports.BOOLEAN_VALUE = {
    YES: "Yes",
    NO: "No",
    TRUE: true,
    FALSE: false,
    TRUE_CAPS: "True",
    FALSE_CAPS: "False",
};
exports.PG_NAME = {
    PG_LIST: "PG List",
    ALL_DDT: "All DDTs",
    ALL_LABEL: "All Labels",
    ALL_USER: "All Users",
    ALL_UNITS: "All Units",
    ALL_CATEGORIES: "All Categories",
    ALL_USERS: "All Users",
    ALL_PG: "All PG",
};
exports.COLUMN_TYPE = {
    INITIAL: "Initial",
    ADDITIONAL: "Additional",
};
exports.DATATYPE = {
    ROW_ID: "Row-ID",
    USER_ID: "User-ID",
    DDT: "DDT",
    TEXT: "Text",
    ML_TEXT: "ML-Text",
    FORMULA: "Formula",
    URL: "URL",
    VALUE_TYPE: "Value Type",
    BOOL: "Bool",
    DATETIME: "DateTime",
    COLOR: "Color",
    INT: "Int",
    BIGINT: "BigInt",
    PGID: "PG-ID",
    PG_TYPES: "PG Types",
    EDITIONS: "Editions",
    STATUSES: "Statuses",
    ROW_TYPES: "Row Types",
    DATA_TYPES: "Data Types",
    NUM: "Num",
    VALID_FORMAT: "Valid-Format",
    CATEGORY_ID: "Category-ID",
    PRODUCT_ID: "Product-ID",
    SEARCH_SET_ID: "Search-Set-ID",
    LEVEL_SET_ID: "Level-Set-ID",
    COL_ID: "Col-ID",
    CELL_ID: "Cell-ID",
    ITEM_ID: "Item-ID",
    DATA_ID: "Data-ID",
    FORMAT_ID: "Format-ID",
    FONT_STYLE: "Font-Style",
    JSON: "JSON",
    VALUE_DATA_TYPE: "Value Data-Type",
    AMOUNT: "Amount",
    UNIT: "Unit",
    PERCENTAGE: "Percentage",
};
exports.ROWS = {
    ROW: "Row*",
    ROWID: "RowID*",
    SHARE: "Share",
    PARENT_ROW: "Parent-Row",
    ROW_LEVEL: "Row-Level",
    ROW_DATA: "Row-Data",
    PG: "PG",
    PGID: "PG ID*",
    PG_NAME: "PG Name*",
    PG_URL: "PG URL",
    PG_COMMENT: "PG Comment",
    ROW_AUDIT_TRAIL: "Row Audit-Trail*",
    DEFAULT_JSONB_VALUE: "{}",
    DDT_DATA: "DDT Data*",
    LABEL_DATA: "Label Data*",
    VALUE_DEFAULT: "Value Default",
    ROW_COMMENT: "Row Comment",
    DDT_DEFAULT: "DDT Default?",
    PG_TYPE: "PG Type",
    PG_EDITION: "PG Edition*",
    PG_OWNER: "PG Owner*",
    ROW_TYPE: "Row Type",
    ROW_STATUS: "Row Status",
    VALUE_TYPE: "Value Type",
    DDT_SOURCE: "DDT Source",
    PG_STATUS: "PG Status",
    PG_SEO: "PG SEO",
    VALUE_FORMAT: "Value Format",
    VALUE_DATA_TYPE: "Value Data-Type",
    VALUE_DDT_SOURCE: "Value DDT-Source",
    VALUE_DEFAULT_DATA: "Value Default-Data",
    VALUE_STATUS: "Value Status",
    VALUE_FORMULA: "Value Formula",
    UNIT_DATA: "Unit Data*",
    UNIT_FACTOR: "Unit Factor",
};
exports.COLUMNS = {
    ROW: "Row",
    ROWID: "RowID",
    PG: "PG",
    PGID: "PG ID",
    PG_URL: "PG URL",
    COL: "Col",
    COL_NAME: "Col-Name",
    PG_HIERARCHY_COL: "PG-Nested-Col",
    PG_FREEZE_COL: "PG-Freeze-Col",
    BIGINT_DATA: "BigInt-Data",
    JSON_DATA: "JSON-Data",
    BOOL_DATA: "Bool-Data",
    DATA_TYPE: "Data-Type",
    DDT_SOURCE: "DDT-Source",
    DEFAULT: "Default",
    COL_MIN_WIDTH: "Col-Min-Width",
    DATA_FORMULA: "Data-Formula",
    FONT_STYLE: "Font-Style",
    COMMENT: "Comment",
    AUDIT_TRAIL: "Audit-Trail",
    CALCULATED: "Calculated",
    CALC_FORMULA: "Calc-Formula",
    STATUS: "Status",
    ITEM: "Item",
    ITEM_ORDER: "Item-Order",
    VALUE: "value",
    _CHILDREN: "_children",
    _1: "_1",
    _2: "_2",
    _3: "_3",
    _4: "_4",
    _5: "_5",
    _6: "_6",
    PG_EXPAND: "PG-Expand",
    PG_LEVEL_SET: "PG-Level-Set",
    PG_SEARCH_SET: "PG-Search-Set",
    PG_SORT: "PG-Sort",
    PG_FILTER: "PG-Filter",
    CELL: "Cell",
    CELL_OF_ITEMS: "Cell-#of-Items",
    item: "item",
    DATA: "Data",
    DATETIME_DATA: "DateTime-Data",
    COL_ORDER: "Col-Order",
    FORMAT: "Format",
    FORMULA: "Formula",
    NUM_DATA: "Num-Data",
    DELETED: "Deleted",
};
exports.OTHER_COLUMNS = {
    PARENT_PG: "parentPG",
    PARENT_ROW: "parentRow",
    ROW_LEVEL: "rowLevel",
    SIBLING_ROW: "siblingRow",
    SIBLING_ID: "siblingID",
    PG_TYPE: "PG Type",
};
exports.COLUMNS_CAPITAL = {
    ROW: "ROW",
    COL: "COL",
    PG: "PG",
    COL_NAME: "COL_NAME",
    PG_NESTED_COL: "PG_NESTED_COL",
    PG_FREEZE_COL: "PG_FREEZE_COL",
    PG_EXPAND: "PG_EXPAND",
    PG_LEVEL_SET: "PG_LEVEL_SET",
    PG_SEARCH_SET: "PG_SEARCH_SET",
    PG_SORT: "PG_SORT",
    PG_FILTER: "PG_FILTER",
    BIGINT_DATA: "BIGINT_DATA",
    JSON_DATA: "JSON_DATA",
    BOOL_DATA: "BOOL_DATA",
    DATA_TYPE: "DATA_TYPE",
    DDT_SOURCE: "DDT_SOURCE",
    DEFAULT: "DEFAULT",
    COL_MIN_WIDTH: "COL_MIN_WIDTH",
    DATA_FORMULA: "DATA_FORMULA",
    FONT_STYLE: "FONT_STYLE",
    COMMENT: "COMMENT",
    AUDIT_TRAIL: "AUDIT_TRAIL",
    CALCULATED: "CALCULATED",
    CALC_FORMULA: "CALC_FORMULA",
    STATUS: "STATUS",
    CELL: "CELL",
    CELL_OF_ITEMS: "CELL_OF_ITEMS",
    DATA: "DATA",
    PARENT_ROW: "PARENT_ROW",
    ROW_LEVEL: "ROW_LEVEL",
    ITEM: "ITEM",
    ITEM_ORDER: "ITEM_ORDER",
    UNIT: "UNIT",
    LANGUAGE: "LANGUAGE",
    ROW_DATA: "ROW_DATA",
    DATETIME_DATA: "DATETIME_DATA",
    COLOR_DATA: "COLOR_DATA",
    INT_DATA: "INT_DATA",
    NUM_DATA: "NUM_DATA",
    COL_ORDER: "COL_ORDER",
    FORMAT: "FORMAT",
    ROW_TYPE: "ROW_TYPE",
    SIBLING_ROW: "SIBLING_ROW",
    QTY_DATA: "QTY_DATA",
    UNIT_DATA: "UNIT_DATA",
    STD_QTY_DATA: "STD_QTY_DATA",
    STD_UNIT_DATA: "STD_UNIT_DATA",
    FOREIGN_DATA: "FOREIGN_DATA",
    SHOWSET_TICK: "SHOWSET_TICK",
    DELETED_BY: "DELETED_BY",
    DELETED_AT: "DELETED_AT",
    FORMULA: "FORMULA",
};
exports.TABLE_WITH_COLUMN = {
    T_COL_COL_NAME: "t-Col.Col-Name",
    T_COL_DATA_TYPE: "t-Col.Data-Type",
    T_COL_DDT_SOURCE: "t-Col.DDT-Source",
};
exports.MESSAGE = {
    JSON_FILE_CREATED: "JSON File generated successfully",
    AUTHENTICATED_SUCCESSFULLY: "Successfully authenticated",
    BAD_REQUEST: "Bad Request",
    DUPLICATE_COLUMN_NAME: "was rejected because a duplicate exists in the [Object]",
    HAS_BEEN_ACTIONED: "has been [Actioned]",
    SUCCESSFULLY_INSERTED_COLUMNS: "Successfully inserted column!",
    SUCCESSFULLY_UPDATED_COLUMNS: "Successfully updated column!",
    WAS_NOT_FOUND: "was not found in the [Object]",
    NOTIFY_ACTION_REASON: "[Notify]  [Action] [Reason].",
    DATA_REQUIRED: "Data is required in this (mandatory) cell",
    ORPHAN_ROWS: "was rejected because it may generate Orphan Row(s)",
};
exports.API = {
    GET_PG_BY_ID: "/:id",
    GET_ALL_DDT: "/getAllDDT",
};
exports.LABEL = {
    USER_PROFILE_LABEL: "User-Profile Labels",
};
exports.ROW_TYPE = {
    SECTION_HEAD: "section-head",
};
exports.NOTIFY = {
    ALERT: "Alert!",
    ERROR: "Error!",
    NOTICE: "Notice:",
    SUCCESS: "Success!",
};
exports.ACTIONS = {
    ADD: {
        ACTION: "Add",
        OBJECTS: {
            ADDED: "Added",
        },
    },
    EDIT: {
        ACTION: "Edit",
        OBJECTS: {
            EDITED: "Edited",
        },
    },
    FORMAT: {
        ACTION: "Format",
        OBJECTS: {
            FORMATTED: "Formatted",
        },
    },
    VIEW: {
        ACTION: "View",
        OBJECTS: {
            VIEWED: "Viewed",
        },
    },
    DELETE: {
        ACTION: "Delete",
        OBJECTS: {
            DELETED: "Deleted",
        },
    },
    RECOVER: {
        ACTION: "Recover",
        OBJECTS: {
            RECOVERED: "Recovered",
        },
    },
    LIST: {
        ACTION: "List",
        OBJECTS: {
            LISTED: "Listed",
        },
    },
    AUTHENTICATE: {
        ACTION: "Authenticate",
        OBJECTS: {
            AUTHENTICATED: "Authenticated",
        },
    },
    LOGIN: {
        ACTION: "Log-in",
        OBJECTS: {
            LOGGEDIN: "Logged-in",
        },
    },
    LOGOUT: {
        ACTION: "Log-out",
        OBJECTS: {
            LOGGEDOUT: "Logged-out",
        },
    },
    EXECUTE: {
        ACTION: "Execute",
        OBJECTS: {
            EXECUTED: "Executed",
        },
    },
    SAVE: {
        ACTION: "Save",
        OBJECTS: {
            SAVED: "Saved",
        },
    },
    CANCEL: {
        ACTION: "Cancel",
        OBJECTS: {
            CANCELLED: "Cancelled",
        },
    },
};
exports.OTHERS = {
    BEGIN: "BEGIN",
    COMMIT: "COMMIT",
    ROLLBACK: "ROLLBACK",
    ARRAY: "ARRAY",
    JSONB: "::jsonb",
    UPDATED: "updated",
    INSERTED: "inserted",
    INSETED_AT: "insertedAt",
    INSERTED_BY: "insertedBy",
    TABLE_NAME: "tableName",
    ID: "id",
    RETURNING: "RETURNING",
    OBJECT: "[Object]",
    ACTIONED: "[Actioned]",
};
exports.DDT_OBJECT = [
    {
        PAGE: "Page",
        OBJECTS: {
            PAGE_NAME: "Page Name",
            EDITION: "Edition",
            EDITION_PAGE: "Edition Page",
        },
    },
    {
        COLUMN: "Column",
        OBJECTS: { COLUMN_NAME: "Column Name" },
    },
    {
        ROW: "Row",
        OBJECTS: {
            LOCAL_ROW: "Local Row",
            SHARED_ROW: "Shared Row",
            INHERITED_ROW: "Inherited Row",
        },
    },
    { CELL: "Cell" },
    {
        ITEM: "Item",
        OBJECTS: {
            LOCAL_ITEM: "Local Item",
            SHARED_ITEM: "Shared Item",
            INHERITED_ITEM: "Inherited Item",
        },
    },
    {
        DATA: "Data",
        OBJECTS: {
            LOCAL_DATA: "Local Data",
            SHARED_DATA: "Shared Data",
            DEFAULT_DATA: "Default Data",
        },
    },
    { AUDIT_TRAIL: "Audit-Trail" },
    {
        USER: "User",
        OBJECTS: {
            USER_ID: "User ID",
            USER_PROFILE: "User Profile",
            SOCIAL_ID: "Social ID",
        },
    },
    { SYSTEM: "System" },
    { RECYCLE_BIN: "Recycle Bin" },
];
exports.INITIAL_COLUMNS = [
    exports.ROWS.ROW,
    exports.ROWS.ROWID,
    exports.ROWS.SHARE,
    exports.TABLES[1].FIELDS[7].INHERIT,
    exports.ROWS.ROW_TYPE,
    exports.ROWS.ROW_STATUS,
    exports.ROWS.ROW_COMMENT,
    exports.ROWS.ROW_AUDIT_TRAIL,
];
