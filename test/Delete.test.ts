import { _Delete } from '../src/action/Delete'
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
test('不带条件删除', () => {
    const sql = _Delete<User>('az_book')
    expect(sql).toBe("DELETE FROM `az_book` ")
})

test('简单删除', () => {
    const sql = _Delete<User>('az_book', {
        where: {
            and: {
                id: 61
            }
        }
    })
    expect(sql).toBe("DELETE FROM `az_book` WHERE `id` = 61")
})

test('或条件', () => {
    const sql = _Delete<User>('az_book', {
        where: {
            and: {
                id: 61
            },
            or: {
                id: 62
            }
        }
    })
    expect(sql).toBe("DELETE FROM `az_book` WHERE (`id` = 61) OR (`id` = 62)")
})


test('意外的查询条件', () => {
    
    try {
        _Delete<User>('az_book', {
            where: {
                and: {
                    id: undefined
                }
            }
        })
        expect(new ExceptionMySQL('意外的查询语句')).toBe('return sql string')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

})