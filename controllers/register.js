const handleRegister =  (req, res, db, bcrypt) => {
    // destructuring
    const {email, password, name} = req.body;
    if ( !email || !password || !name ){
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction( trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail  => {
            return trx('users')
            .insert({
                email: loginEmail[0],
                joined: new Date(),
                name: name
            })
            .returning('*')
            .then(user => {
                res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(error => {
        res.status(400).json('unable to register');
    });
}
module.exports = {
    handleRegister: handleRegister
}