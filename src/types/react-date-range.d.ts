declare module "react-date-range" {
  export interface Range {
    startDate: Date
    endDate: Date
    key: string
  }

  export interface RangeKeyDict {
    [key: string]: Range
  }

  export const DateRange: React.FC<any>
}
