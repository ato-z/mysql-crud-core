import { ExceptionMySQL } from "../Error"

export const filterSqlVal = (val: unknown, key: string): string => {
    if (val === undefined) throw new ExceptionMySQL(`${key} 值不能为 undefined`)
    if (typeof val === 'string') {
        val = val.replace(/-/g, '\\-')
        val = /^\d+$/.test(val as string) ? val : `'${val}'`
    }
    return val as string
}
