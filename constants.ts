export const SHEET_TO_READ = [
  {
    INDEX: 1,
    NAME: "TG&DBSheet",
  },
  {
    INDEX: 2,
    NAME: "AllTGSheet",
  },
  {
    INDEX: 3,
    NAME: "AllDDTSheet",
  },
  {
    INDEX: 4,
    NAME: "AllLabelSheet",
  },
];

export const TABLES = [
  { TABLE: "t-PG", FIELDS: [{ PG: "PG" }] },
  {
    TABLE: "t-Row",
    FIELDS: [
      { ROW: "Row" },
      { PG: "PG" },
      { ROWID: "RowID" },
      { ROW_LEVEL: "Row-Level" },
      { PARENT_ROW: "Parent-Row" },
      { SIBLING_ROW: "Sibling-Row" },
      { ROW_TYPE: "Row-Type" },
    ],
  },
  {
    TABLE: "t-Col",
    FIELDS: [
      { COL: "Col" },
      { PG: "PG" },
      { COL_NAME: "Col-Name" },
      { DATA_TYPE: "Data-Type" },
      { DDT_SOURCE: "DDT-Source" },
    ],
  },
  {
    TABLE: "t-Share",
    FIELDS: [{ SHARE: "Share" }],
  },
  {
    TABLE: "t-Cell",
    FIELDS: [
      { CELL: "Cell" },
      { ROW: "Row" },
      { COL: "Col" },
      { CELL_OF_ITEMS: "Cell-#of-Items" },
    ],
  },
  {
    TABLE: "t-Item",
    FIELDS: [
      { ITEM: "Item" },
      { CELL: "Cell" },
      { DATA: "Data" },
      { INHERIT: "Inherit" },
    ],
  },
  {
    TABLE: "t-Data",
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
    ],
  },
  {
    TABLE: "t-Format",
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
      { ROW: "Row" },
    ],
  },
];

export const ONLY_PRIMARY_KEY_INSETION = "default";

export const ID = {
  INITIAL_ROWID: 1000000001,
  ALL_DDT_ID: 3000000002,
  ALL_LABEL_ID: 3000000003,
};

export const ROW_LEVEL = [0, 1, 2, 3, 4, 5, 6];

export const VARIABLE = {
  ONE: 1,
  EMPTY_STRING: "",
  STAR: "*",
  STRING_TYPE: "string",
  DEFAULT_PG_EXPAND: 99,
  SEMICOLON: ";",
  ROUND_BRACKET: "(",
};

export const PG_URL = `'{"${VARIABLE.ONE}" : "https://our_domain/PG ID/PG Name"}'`;

export const SPLIT_COMMA_SEMICOLON_REGEX = /[,;]/;

export const DEFAULT_LANGUAGE = {
  ENGLISH: "English",
};
export const Seprator = {
  SEMICOLON: "; ",
};
export const STATUS = {
  HIERARCHY: "Nested",
  MANDATORY: "Mandatory",
  SHARE: "Share",
  MANDATOR_COLUMN: "Item# ≥ 1",
  CALC: "Calc",
};
export const BOOLEAN_VALUE = {
  YES: "yes",
  NO: "No",
  TRUE: true,
  FALSE: false,
  TRUE_CAPS: "True",
  FALSE_CAPS: "False",
};
export const PG_NAME = {
  PG_LIST: "PG List",
  ALL_DDT: "All DDTs",
  ALL_LABEL: "All Labels",
  ALL_USER: "All Users",
  ALL_UNITS: "All Units",
  ALL_CATEGORIES: "All Categories",
  ALL_USERS: "All Users",
};
export const COLUMN_TYPE = {
  INITIAL: "Initial",
  ADDITIONAL: "Additional",
};

export const DATATYPE = {
  // ROWID: "Row-ID",
  // USERID: "User-ID",
  ROW_ID: "Row-ID",
  USER_ID: "User-ID",
  DDT: "DDT",
  TEXT: "Text",
  // MLTEXT: "ML-Text",
  ML_TEXT: "ML-Text",
  FORMULA: "Formula",
  URL: "URL",
  VALUE_TYPE: "Value Type",
  // VALUETYPE: "Value Type",
  BOOL: "Bool",
  DATETIME: "DateTime",
  COLOR: "Color",
  INT: "Int",
  BIGINT: "BigInt",
  PGID: "PG-ID",
  TG_TYPES: "TG Types",
  EDITIONS: "Editions",
  STATUSES: "Statuses",
  ROW_TYPES: "Row Types",
  DATA_TYPES: "Data Types",
};

export const ROWS = {
  ROW: "Row*",
  ROWID: "RowID*",
  SHARE: "Share",
  PARENT_ROW: "Parent-Row",
  ROW_LEVEL: "Row-Level",
  ROW_DATA: "Row-Data",
  PG: "PG",
  PGID: "PG ID*",
  PG_NAME: "PG Name*",
  PG_URL: "PG URL*",
  PG_COMMENT: "PG Comment",
  ROW_AUDIT_TRAIL: "Row Audit-Trail*",
  DEFAULT_JSONB_VALUE: "{}",
  DDT_DATA: "DDT Data*",
  LABEL_DATA: "Label Data*",
  VALUE_DEFAULT: "Value Default",
  ROW_COMMENT: "Row Comment",
  DDT_DEFAULT: "DDT Default",
  PG_TYPE: "PG Type*",
  PG_EDITION: "PG Edition*",
  PG_OWNER: "PG Owner*",
  ROW_TYPE: "Row Type",
  ROW_STATUS: "Row Status",
  VALUE_TYPE: "Value Type",
  DDT_SOURCE: "DDT Source",
  PG_STATUS: "PG Status",
  VALUE_FORMAT: "Value Format",
  UNIT_DATA: "Unit Data*",
};

export const COLUMNS = {
  ROW: "Row",
  ROWID: "RowID",
  PG: "PG",
  PGID: "PG ID",
  PG_URL: "PG URL",
  COL: "Col",
  COL_NAME: "Col-Name",
  PG_HIERARCHY_COL: "PG-Hierarchy-Col",
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
};

export const OTHER_COLUMNS = {
  PARENT_PG: "parentPG",
  PARENT_ROW: "parentRow",
  ROW_LEVEL: "rowLevel",
  SIBLING_ROW: "siblingRow",
  SIBLING_ID: "siblingID",
  PG_TYPE: "PG Type",
};

export const TABLE_WITH_COLUMN = {
  T_COL_COL_NAME: "t-Col.Col-Name",
  T_COL_DATA_TYPE: "t-Col.Data-Type",
  T_COL_DDT_SOURCE: "t-Col.DDT-Source",
};

export const MESSAGE = {
  JSON_FILE_CREATED: "JSON File generated successfully",
  AUTHENTICATED_SUCCESSFULLY: "Successfully authenticated",
  BAD_REQUEST: "Bad Request",
};

export const API = {
  GET_TG_BY_ID: "/:id",
  GET_ALL_DDT: "/getAllDDT",
};

export const LABEL = {
  USER_PROFILE_LABEL: "User-Profile Labels",
};
