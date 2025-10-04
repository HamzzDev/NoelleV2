let handler = m => m

handler.all = async function (m, { isPrems }) {
    let user = global.db.data.users[m.sender]

    // Batasi hanya health
    if ((user.health * 1) > 100) {
        user.health = 100
    } else if ((user.health * 1) < 0) {
        user.health = 0
    }

    // Hilangkan semua batasan lain (unlimited)
    if ((user.money * 1) < 0) {
        user.money = 0
    }
    if ((user.exp * 1) < 0) {
        user.exp = 0
    }
    if ((user.limit * 1) < 0) {
        user.limit = 0
    }
    if ((user.bank * 1) < 0) {
        user.bank = 0
    }
}

export default handler