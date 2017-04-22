// @flow

export type User = {
  id: string,
  laundries: string[]
}
export type Laundry = {
  id: string,
  timezone: string,
  owners: string[],
  machines: string[],
  rules: {
    timeLimit?: {
      from: {
        hour: number,
        minute: number
      },
      to: {
        hour: number,
        minute: number
      }
    }
  }
}
export type Machine = {
  name: string,
  broken: boolean
}

export type Col<L> = {
  [string]: L
}

export type Booking = {
  id: string,
  machine: string,
  from: string,
  to: string,
  owner: string
}
