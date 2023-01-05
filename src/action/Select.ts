import { withWhere } from "../core/WithWhere"
import { SelectOption } from "./Option"

export const Select = <T>(tableName: string, option: SelectOption<T> = {}) => {
    const { field = '*', where, order, limit } = option
    const fieldProp = field instanceof Array ? field?.map(f => `\`${f}\``) : field
    const sqlSelectFrom = [`SELECT ${fieldProp} FROM \`${tableName}\``]
    /** 组合where条件 */
    if (where !== undefined) { sqlSelectFrom.push(withWhere(where.and, where.or, option.join)) }
    /** 行数 */
    if (Array.isArray(limit)) { sqlSelectFrom.push(`LIMIT ${limit}`) }
    if (limit && /^\d+$/.test(limit.toString())) { sqlSelectFrom.push(`LIMIT 0,${limit}`) }
    /** 排序 */
    if (order !== undefined) { sqlSelectFrom.push(`ORDER BY ${order[0]} ${order[1]}`) }
    return sqlSelectFrom.join(' ')
}
