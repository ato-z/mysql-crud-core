import { WhereParmaValue } from "../core/ParseWhereParams"

export interface SelectOption<T> {
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

export interface UpdateOption<T> extends SelectOption<T> {
    limit?: number
}

export interface DeleteOption<T> extends SelectOption<T> {
    limit?: number
}
