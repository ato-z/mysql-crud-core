import { Insert } from '../src/action/Insert'
import { ExceptionMySQL } from '../src/Error'
/*
const test = (str, cb) => {
    console.log('test:', str)
    cb()
}
const expect = (val) => ({toBe (targer) { console.log(targer === val) }})*/

type User = {
    id?: number
    cover: number
    nickname: string
    extend: string
    create_date: string
    delete_date?: string
    update_date?: string
}

test('单条数据插入', () => {
    const sql = Insert<User>('az_user', {
        cover: 1,
        nickname: '昵称',
        extend: '无',
        create_date: '2022-11-02 10:00:00'
    })
    expect(sql).toBe("INSERT INTO `az_user` (`cover`,`nickname`,`extend`,`create_date`) VALUES (1,'昵称','无','2022\\-11\\-02 10:00:00')")
})

test('字符串数字', () => {
    const sql = Insert<User>('az_user', {
        cover: '1' as unknown as number,
        nickname: '昵称',
        extend: '无',
        create_date: '2022-11-02 10:00:00'
    })
    expect(sql).toBe("INSERT INTO `az_user` (`cover`,`nickname`,`extend`,`create_date`) VALUES (1,'昵称','无','2022\\-11\\-02 10:00:00')")
})

test('xss注入', () => {
    const sql = Insert<User>('az_user', {
        cover: '1' as unknown as number,
        nickname: '昵--称',
        extend: '无',
        create_date: '2022-11-02 10:00:00'
    })
    expect(sql).toBe("INSERT INTO `az_user` (`cover`,`nickname`,`extend`,`create_date`) VALUES (1,'昵\\-\\-称','无','2022\\-11\\-02 10:00:00')")
})

test('多条插入', () => {
    const sql = Insert<User>('az_user', [
        {
            cover: 1,
            nickname: '昵--称',
            extend: '无',
            create_date: '2022-11-02 10:00:00'
        },
        {
            cover: 1,
            nickname: '昵--称',
            extend: '无',
            create_date: '2022-11-02 10:00:00'
        }
    ])
    expect(sql).toBe("INSERT INTO `az_user` (`cover`,`nickname`,`extend`,`create_date`) VALUES (1,'昵\\-\\-称','无','2022\\-11\\-02 10:00:00'),(1,'昵\\-\\-称','无','2022\\-11\\-02 10:00:00')")
})

test('多条插入, 数据不一致', () => {
    try {
        const sql = Insert<User>('az_user', [
            {
                cover: 1,
                nickname: '昵--称',
                extend: '无',
                create_date: '2022-11-02 10:00:00'
            },
            {
                cover: 1,
                nickname: '昵--称',
                extend: '无',
                create_date: '2022-11-02 10:00:00',
                update_date: '2022-11-02 10:00:00'
            }
        ])
        expect(new ExceptionMySQL('多条插入, 数据不一致')).toBe('')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        const sql = Insert<User>('az_user', [
            {
                cover: 1,
                nickname: '昵--称',
                extend: '无',
                create_date: '2022-11-02 10:00:00',
                update_date: '2022-11-02 10:00:00'
            },
            {
                cover: 1,
                nickname: '昵--称',
                extend: '无',
                create_date: '2022-11-02 10:00:00',
                delete_date: '2022-11-02 10:00:00'
            }
        ])
        expect(new ExceptionMySQL('多条插入, 数据不一致')).toBe('')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})

test('传入非对象数据', () => {
    try {
        Insert<User>('az_user', '' as unknown as User)
        expect(new ExceptionMySQL('多条插入, 数据不一致')).toBe('')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }

    try {
        Insert<User>('az_user', null as unknown as User)
        expect(new ExceptionMySQL('多条插入, 数据不一致')).toBe('')
    } catch (err) {
        expect(err instanceof ExceptionMySQL).toBe(true)
    }
})
