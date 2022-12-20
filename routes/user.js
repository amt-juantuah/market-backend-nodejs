const router = require('express').Router();

router.get('/gettest', (req, res) => {
    res.send('user test successful');
});

router.post('/posttest', (req, res) => {
    const username = req.body.username;
    res.send(username);
})

module.exports = router