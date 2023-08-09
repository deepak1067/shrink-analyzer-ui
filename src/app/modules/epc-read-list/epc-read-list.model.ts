export interface EPCReadList {
    "Event Time": string;
    "Exit Event ID": string;
    "POS Transaction ID": string;
    "EPC": string;
    "Site Code": string;
    "Site Name"?: string;
    "Read Point": string;
    "Last Read Time": string;
    "Product Code": string;
    [product_attributes: string]: any;
  }