import { Select } from '../src/action/Select'
/*
const test = (str, cb) => {
    console.log('test:', str)
    cb()
}
const expect = (val) => ({toBe (targer) { console.log(targer === val) }})
*/
type User = {
    id: number
    cover: number
    nickname: string
    extend: string
    delete_date: string
}

test(`常规查询`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                id: 1,
                delete_date: null
            }
        }
    })
    expect(sql).toBe(`SELECT * FROM \`az_user\` WHERE \`id\` = 1 AND \`delete_date\` IS NULL`)
})


test(`常规查询2`, () => {
    const sql = Select<User>('az_user')
    expect(sql).toBe('SELECT * FROM `az_user`')
})


test(`field筛选`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                id: 1,
                delete_date: null
            }
        },
        field: ['id', 'cover', 'delete_date', 'nickname']
    })
    expect(sql).toBe('SELECT `id`,`cover`,`delete_date`,`nickname` FROM `az_user` WHERE `id` = 1 AND `delete_date` IS NULL')
})

test(`防止xss`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                id: 1,
                nickname: '-'
            }
        }
    })
    expect(sql).toBe(`SELECT * FROM \`az_user\` WHERE \`id\` = 1 AND \`nickname\` = '\\-'`)
})

test(`字符串数字转数字`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                id: '1'
            }
        }
    })
    expect(sql).toBe(`SELECT * FROM \`az_user\` WHERE \`id\` = 1`)
})

test(`or查询`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                id: 2
            },
            or: {
                id: '1'
            }
        }
    })
    expect(sql).toBe('SELECT * FROM `az_user` WHERE (`id` = 2) OR (`id` = 1)')
})

test(`limit查询1`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                delete_date: null
            }
        },
        limit: 10
    })
    expect(sql).toBe('SELECT * FROM `az_user` WHERE `delete_date` IS NULL LIMIT 0,10')
})

test(`limit查询2`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                delete_date: null
            }
        },
        limit: [5, 10]
    })
    expect(sql).toBe('SELECT * FROM `az_user` WHERE `delete_date` IS NULL LIMIT 5,10')
})

test(`order查询`, () => {
    const sql = Select<User>('az_user', {
        where: {
            and: {
                delete_date: null
            }
        },
        limit: [5, 10],
        order: ['id', 'DESC']
    })
    expect(sql).toBe('SELECT * FROM `az_user` WHERE `delete_date` IS NULL ORDER BY id DESC LIMIT 5,10')
})