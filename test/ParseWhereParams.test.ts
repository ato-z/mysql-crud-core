import { parseWhereParams } from '../src/core/ParseWhereParams'
import { ExceptionMySQL } from '../src/Error'

test(`\`id\` = 1 AND \`delete_time\` IS NULL`, () => {
    const where = parseWhereParams({
        id: 1,
        delete_time: null
    })
    expect(where).toBe(`\`id\` = 1 AND \`delete_time\` IS NULL`)
})


test(`\`age\` > 18 AND \`num\` >= 18 AND \`num2\` < 20 AND \`num3\` <= 30 AND \`num4\` <> 66`, () => {
    const where = parseWhereParams({
        age: ['>', 18],
        num: ['>=', 18],
        num2: ['<', '20' as unknown as number],
        num3: ['<=', '30' as unknown as number],
        num4: ['<>', 66]
    })
    expect(where).toBe(`\`age\` > 18 AND \`num\` >= 18 AND \`num2\` < 20 AND \`num3\` <= 30 AND \`num4\` <> 66`)
})

test(`\`title\` LIKE %name`, () => {
    const where = parseWhereParams({
        title: ['LIKE', '%name']
    })
    expect(where).toBe(`\`title\` LIKE '%name'`)
})

test(`\`id\` IN (1,2,3,4,5,7) AND \`id2\` NOT IN (1,2,3,4,5,7) AND \`delete_time\` IS NULL`, () => {
    const where = parseWhereParams({
        id: ['IN', [1, 2, 3, 4, '5', '7']],
        id2: ['NOT IN', [1, 2, 3, 4, '5', '7']],
        delete_time: null
    })
    expect(where).toBe(`\`id\` IN (1,2,3,4,5,7) AND \`id2\` NOT IN (1,2,3,4,5,7) AND \`delete_time\` IS NULL`)
})

test(`\`val\` BETWEEN 1 AND 7 AND \`val2\` BETWEEN 1 AND 7`, () => {
    const where = parseWhereParams({
        val: ['BETWEEN', [7, 1]],
        val2: ['BETWEEN', ['7' as unknown as number, 1]]
    })
    expect(where).toBe(`\`val\` BETWEEN 1 AND 7 AND \`val2\` BETWEEN 1 AND 7`)
})

test(`错误判断`, () => {
    try {
        parseWhereParams({ val: '' })
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        parseWhereParams({ val: undefined as unknown as string })
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        parseWhereParams({ val1: [] as unknown as string })
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        parseWhereParams({ val2: ['IN', '1,23' as unknown as string[]] })
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        parseWhereParams({ val: ['>', '1,2,3' as unknown as number] })
        expect('NaN 判断').toBe(true)
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        parseWhereParams({ val: ['>', NaN] })
        expect('NaN 判断').toBe(true)
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})