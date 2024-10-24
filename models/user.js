const db = require('../config/config');
const crypto = require('crypto');

const User = {};

User.getAll = () => {
    const sql = `
    SELECT
        *
    FROM
        users
     `;

     return db.manyOrNone(sql);
}

User.findByEmail = (email) => {
    const sql = `
    SELECT
    U.id, 
    U.email,
    U.name, 
    U.lastname,
    U.image, 
    U.phone, 
    U.pw,
    U.session_token,
	json_agg(
		json_build_object(
			'id', R.id,
			'name', R.name,
			'image', R.image,
			'route', R.route
		)
	) AS roles
    FROM users AS U
        INNER JOIN user_has_role AS UHR
        ON UHR.id_user = U.id
        INNER JOIN roles AS R
        ON R.id = UHR.id_rol
        WHERE U.email = $1
        GROUP BY U.id
    `
    return db.oneOrNone(sql, email);
}


    User.findByUserId = (id) => {
        const sql = `
        SELECT
        U.id, 
        U.email,
        U.name, 
        U.lastname,
        U.image, 
        U.phone, 
        U.pw,
        U.session_token,
        json_agg(
            json_build_object(
                'id', R.id,
                'name', R.name,
                'image', R.image,
                'route', R.route
            )
        ) AS roles
        FROM users AS U
            INNER JOIN user_has_role AS UHR
            ON UHR.id_user = U.id
            INNER JOIN roles AS R
            ON R.id = UHR.id_rol
            WHERE U.id = $1
            GROUP BY U.id
        `
        return db.oneOrNone(sql, id);
    }


User.create = (user) => {

    const myPasswordHashed = crypto.createHash('md5').update(user.pw).digest('hex');
    user.pw = myPasswordHashed;
    const sql = `
    INSERT INTO
        users(
            email,
            name,
            lastname,
            phone,
            image,
            pw,
            created_at,
            updated_at   
        )
    VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        user.pw,
        new Date(),
        new Date()
    ])
}

User.findById = (id, callback) =>{
    const sql = `SELECT id, email, name, lastname, image, phone, pw, session_token
FROM users 
WHERE id = $1`;

return db.oneOrNone(sql, id).then(user => {callback(null, user);})
}

User.update = (user) => {
    const sql = `
    UPDATE
        users
    SET 
        name = $2,
        lastname = $3,
        phone = $4,
        image = $5,
        updated_at = $6
    WHERE 
        id = $1
    `;

    return db.none(sql, [
        user.id,
        user.name,
        user.lastname,
        user.phone,
        user.image,
        new Date()
    ]);
}

User.updateToken = (id,token) => {
    const sql = `
    UPDATE
        users
    SET 
        session_token = $2
    WHERE 
        id = $1
    `;

    return db.none(sql, [
        id,
        token
      
    ]);
}


User.isPwMatch = (userPw, hash) => {
    const myPasswordHashed = crypto.createHash('md5').update(userPw).digest('hex');
    if(myPasswordHashed === hash){
        return true;
    }
    return false;
}
module.exports = User;