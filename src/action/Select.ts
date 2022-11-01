import { withWhere } from "../core/WithWhere"
import { Option } from "./Option"

export const Select = <T>(tableName: string, option: Option<T> = {}) => {
    const { field, where, order, limit } = option
    const sqlSelectFrom = [`SELECT ${field?.map(f => `\`${f}\``) ?? '*'} FROM \`${tableName}\``]
    /** 组合where条件 */
    if (where !== undefined) { sqlSelectFrom.push(withWhere(where.and, where.or, option.join)) }
    /** 排序 */
    if (order !== undefined) { sqlSelectFrom.push(`ORDER BY ${order[0]} ${order[1]}`) }
    /** 行数 */
    if (Array.isArray(limit)) { sqlSelectFrom.push(`LIMIT ${limit}`) }
    if (limit && /^\d+$/.test(limit.toString())) { sqlSelectFrom.push(`LIMIT 0,${limit}`) }
    return sqlSelectFrom.join(' ')
}
