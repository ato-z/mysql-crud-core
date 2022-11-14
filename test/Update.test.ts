import { Update } from '../src/action/Upadte'
import { ExceptionMySQL } from '../src/Error'

/*const test = (str: string, cb: () => void) => {
    console.log('test:', str)
    cb()
}
const expect = (val: unknown) => ({toBe (targer: unknown) { console.log(targer === val) }})*/

type User = {
    id: number
    cover: number
    nickname: string
    extend: string
    delete_date: string
}

test('空条件', () => {
    const sql = Update<User>('az_book', {
        nickname: '测试'
    })
    expect(sql).toBe("UPDATE `az_book` SET `nickname`='测试' ")
})

test('常规更新', () => {
    const sql = Update<User>('az_book', {
        nickname: '测试-...'
    }, {
        where: {
            and: {
                id: ['>', 60]
            }
        }
    })
    expect(sql).toBe("UPDATE `az_book` SET `nickname`='测试\\-...' WHERE `id` > 60")
})


test('或条件', () => {
    const sql = Update<User>('az_book', {
        nickname: '测试2'
    }, {
        where: {
            and: {
                id: 61
            },
            or: {
                id: 62
            }
        }
    })
    expect(sql).toBe("UPDATE `az_book` SET `nickname`='测试2' WHERE (`id` = 61) OR (`id` = 62)")
})

test('排序+条目', () => {
    const sql = Update<User>('az_book', {
        nickname: '测试3.'
    }, {
        where: {
            and: {
                delete_date: null
            }
        },
        order: ['id', 'DESC'],
        limit: 2
    })
    expect(sql).toBe("UPDATE `az_book` SET `nickname`='测试3.' WHERE `delete_date` IS NULL ORDER BY id DESC LIMIT 2")
})

test('异常', () => {
    try {
        Update<User>('az_book', { nickname: undefined })
        expect(new ExceptionMySQL('空值 undefined')).toBe('return sql string')

    } catch (err: unknown) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})