/* eslint-disable @typescript-eslint/no-unused-vars */
import { OP, OPKeys } from '../enum'
import { ExceptionMySQL } from '../Error'

type isNull = null | 'null' | 'NULL' | 'Null'
type isValue = isNull | (string | number)[] | string | number

const MissOP = (op: string, value: isValue): never => {
    throw new ExceptionMySQL(`${op} 运算符不支持 "${typeof value}" 类型数据`)
}

/** 等于操作 */
const OpEQ = (op: OP['EQ'] | OP['NEQ'], value: string | number | null) => {
    if (value === null) return [op === OP.EQ ? 'IS' : 'IS NOT', 'NULL']
    if (typeof value === 'number' || typeof value === 'string') return [op, value]
    return MissOP(op, value)
}

/** 大于等于 小于等于 */
const OpDiff = (op: OP['GT'] | OP['EGT'] | OP['LT'] | OP['ELT'], value: number | string) => {
    if (typeof value === 'number' || typeof value === 'string') return [op, value]
    return MissOP(op, value)
}

/** IN 查询 */
const OpIn = (op: OP['IN'] | OP['NOT_IN'], value: Array<string|number> | string): [OP['IN'] | OP['NOT_IN'], string] => {
    if (Array.isArray(value)) return OpIn(op, `(${value.join(',')})`)
    if (typeof value === 'string') return [op, value]
    return MissOP(op, value)
}

/** 区间查询 */
const OpBeteen = (op: OP['BETWEEN'], value: Array<string|number> | string): [OP['BETWEEN'], string] => {
    if (Array.isArray(value)) return OpBeteen(op, value.slice(0, 2).join(' AND '))
    if (typeof value === 'string') return [op, value]
    return MissOP(op, value)
}

/** 其他查询 */
const OpOther = (op: OP, value: isValue) => [op, value]

const OpMethod = {
    [OP.EQ]: OpEQ,
    [OP.NEQ]: OpEQ,
    [OP.GT]: OpDiff,
    [OP.EGT]: OpDiff,
    [OP.LT]: OpDiff,
    [OP.ELT]: OpDiff,
    [OP.IN]: OpIn,
    [OP.NOT_IN]: OpIn,
    [OP.BETWEEN]: OpBeteen,
    [OP.NOT_BETWEEN]: OpBeteen
}

/**
 * 根据操作符，映射处理对应的值。比如 = null => IS NULL
 * @param {OP} op 
 * @param {unknown} value 
 * @returns [操作符, 值]
 */
export const generateOpValue = (op: OPKeys, value: isValue): [OPKeys, string | number] => {
    if (value === '') throw new ExceptionMySQL(`value 不能为空字符串`)
    const cb = Reflect.get(OpMethod, op) ?? OpOther
    if (/string|number|/.test(typeof value) || Array.isArray(value)) return Reflect.apply(cb, null, [op, value])
    throw new ExceptionMySQL(`value 不能为 ${typeof value}`)
}
