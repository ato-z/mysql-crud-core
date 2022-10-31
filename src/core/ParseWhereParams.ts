import { OP } from "../enum"
import { ExceptionMySQL } from "../Error"
import { generateOpValue } from "./GenerateOpValue"
export type WhereParma = {
    [prop: string]: string | number | null |
    [OP['IN'] | OP['NOT_IN'], Array<(string|number)>] |
    [OP['BETWEEN'] | OP['NOT_BETWEEN'], [number, number]] | 
    [OP['LIKE'], string] |
    [OP['EGT'] | OP['ELT'] | OP['GT'] | OP['LT'] | OP['NEQ'], number] |
    [OP['EQ'], string | number | null]
}

/**
 * 将对象转化成sql查询可用的字符串
 * @param   {object} where 需要转换的条件 
 * @returns {string} 转化后的字符串
 * ```
 * const quest = {
 *  id: 1,
 *  delete_time: null
 * }
 * parseWhereToString(quest) => '`id` = 1 AND `delete_time` = null'
 * ```
 */
export const parseWhereParams = (where: WhereParma, joinMode: 'AND' | 'OR' = 'AND') => {
    const lis = Object.entries(where)
    const whereSQL = lis.map(li => {
        const [left, right] = li
        const key = `\`${left}\``
        let operative, value
        if (Array.isArray(right)) [operative, value] = right
        else [operative, value] = [OP['EQ'], right]
        if (value !== value && isNaN(value as unknown as number)) throw new ExceptionMySQL(`${key}: 不能为 NaN`)
        if (value === undefined) throw new ExceptionMySQL(`${key}: 不能为 undefined`)
        if (value?.toString() === '') throw new ExceptionMySQL(`${key}: 不能为空`)
        if ((operative === OP['IN'] || operative === OP['NOT_IN'] || operative === OP['BETWEEN'] || operative === OP['NOT_BETWEEN']) && Array.isArray(value) === false) throw new ExceptionMySQL(`当 ${key} 为${OP['IN']}|${OP['NOT_IN']}|${OP['BETWEEN']}|${OP['NOT_BETWEEN']}时, 值必须为一个数组`)

        try {
            [operative, value] = generateOpValue(operative, value)
        } catch (err: any) {
            throw new ExceptionMySQL(`${key}: ${err?.message}`)
        }
        
        return `${key} ${operative} ${value}`
    }).join(` ${joinMode} `)

    return whereSQL
}

