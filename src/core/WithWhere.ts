import { parseWhereParams, WhereParma } from "./ParseWhereParams"

/**
 * where条件组合
 * @param whereAnd 
 * @param whereOR 
 * @param join 
 * @returns 
 */
export const withWhere = (whereAnd?: WhereParma, whereOR?: WhereParma, join?: 'AND'|'OR'): string => {
    const whereContainer = []
    if (whereAnd) { whereContainer.push(parseWhereParams(whereAnd, 'AND')) }
    if (whereOR) { whereContainer.push(parseWhereParams(whereOR, 'OR')) }
    if (whereContainer.length === 1) {
        return 'WHERE '.concat(whereContainer[0])
    }
    if (whereContainer.length === 2) {
        return 'WHERE '.concat(whereContainer.map(sql => `(${sql})`).join(` ${join ?? 'OR'} `))
    }
    return ''
}
