import { WhereParmaValue } from "../core/ParseWhereParams"

export type SelectOption<T> = {
    where?: {
        and?: {
            [P in keyof T]?: WhereParmaValue
        },
        or?: {
            [P in keyof T]?: WhereParmaValue
        }
    },
    field?: (keyof T & string)[],
    join?: 'AND'|'OR',
    order?: [keyof T & string, 'DESC'|'ASC'],
    limit?: number | [number, number]
}
