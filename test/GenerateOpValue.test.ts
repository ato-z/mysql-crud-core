import { generateOpValue } from '../src/core/GenerateOpValue'
import { ExceptionMySQL } from '../src/Error'
const toValue = <T> (input: any): input is T => { return true }
test(`= | <> 操作符合法值`, () => {
    expect(generateOpValue('=', null).toString()).toBe(['IS', 'NULL'].toString())
    expect(generateOpValue('=', 1).toString()).toBe(['=', 1].toString())
    expect(generateOpValue('<>', null).toString()).toBe(['IS NOT', 'NULL'].toString())
    expect(generateOpValue('<>', '1').toString()).toBe(['<>', '1'].toString())
})

test(`= | <> 操作符非法值`, () => {
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

    try {
        const val = []
        if (toValue<string>(val)) { generateOpValue('<>', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = {}
        if (toValue<string>(val)) { generateOpValue('<>', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})

test(`< | > | <= | >= 操作符合法值`, () => {
    expect(generateOpValue('>', 9).toString()).toBe(['>', '9'].toString())
    expect(generateOpValue('<', '1').toString()).toBe(['<', 1].toString())
    expect(generateOpValue('<=', 666).toString()).toBe(['<=', '666'].toString())
    expect(generateOpValue('>=', 777).toString()).toBe(['>=', '777'].toString())
})

test(`< | > | <= | >= 操作符非法值`, () => {
    try {
        generateOpValue('>', '')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = undefined
        if (toValue<string>(val)) { generateOpValue('>', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = []
        if (toValue<string>(val)) { generateOpValue('<', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = {}
        if (toValue<string>(val)) { generateOpValue('<>', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})

test(`in 操作符合法值`, () => {
    expect(generateOpValue('IN', [1,2,3]).toString()).toBe(['IN', '(1,2,3)'].toString())
    expect(generateOpValue('IN', '(1,2,3)').toString()).toBe(['IN', '(1,2,3)'].toString())
    expect(generateOpValue('NOT IN', [1,2,3]).toString()).toBe(['NOT IN', '(1,2,3)'].toString())
    expect(generateOpValue('NOT IN', '(1,2,3)').toString()).toBe(['NOT IN', '(1,2,3)'].toString())
})
test(`in 操作符非法值`, () => {
    try {
        generateOpValue('IN', '')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
    
    try {
        const val = []
        if (toValue<string>(val)) { generateOpValue('IN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = {}
        if (toValue<string>(val)) { generateOpValue('IN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = new Map()
        if (toValue<string>(val)) { generateOpValue('IN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})

test(`BETWEEN 操作符合法值`, () => {
    expect(generateOpValue('BETWEEN', [1,2,3]).toString()).toBe(['BETWEEN', '1 AND 2'].toString())
    expect(generateOpValue('BETWEEN', '1 AND 2').toString()).toBe(['BETWEEN', '1 AND 2'].toString())
    expect(generateOpValue('NOT BETWEEN', [9, 1]).toString()).toBe(['NOT BETWEEN', '1 AND 9'].toString())
    expect(generateOpValue('NOT BETWEEN', ['9', 1]).toString()).toBe(['NOT BETWEEN', '1 AND 9'].toString())
})

test(`BETWEEN 操作符非法值`, () => {
    try {
        generateOpValue('BETWEEN', '')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
    
    try {
        const val = []
        if (toValue<string>(val)) { generateOpValue('BETWEEN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = {}
        if (toValue<string>(val)) { generateOpValue('BETWEEN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = new Map()
        if (toValue<string>(val)) { generateOpValue('BETWEEN', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})

test(`LIKE 操作符合法值`, () => {
    expect(generateOpValue('LIKE', '%title').toString()).toBe(['LIKE', '%title'].toString())
    expect(generateOpValue('LIKE', '%title%').toString()).toBe(['LIKE', '%title%'].toString())
})

test(`LIKE 操作符非法值`, () => {
    try {
        generateOpValue('LIKE', '')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
    
    try {
        const val = [{}, {}, {}]
        if (toValue<string>(val)) { generateOpValue('LIKE', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const val = {}
        if (toValue<string>(val)) { generateOpValue('LIKE', val) }
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})
