declare module "react-date-range" {
  export interface Range {
    startDate: Date
    endDate: Date
    key: string
  }

  export type RangeKeyDict = Record<string, Range>

  export const DateRange: React.FC<any>
}
