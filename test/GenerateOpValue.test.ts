import { generateOpValue } from '../src/core/GenerateOpValue'
import { ExceptionMySQL } from '../src/Error'
const toValue = <T> (input: any): input is T => { return true }
test(`= | <> 操作符`, () => {
    expect(generateOpValue('=', null).toString()).toBe(['IS', 'NULL'].toString())
    expect(generateOpValue('=', 1).toString()).toBe(['=', 1].toString())
    expect(generateOpValue('<>', null).toString()).toBe(['IS NOT', 'NULL'].toString())
    expect(generateOpValue('<>', '1').toString()).toBe(['<>', '1'].toString())

    try {
        generateOpValue('<>', '')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = undefined
        if (toValue<string>(val)) { generateOpValue('<>', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})