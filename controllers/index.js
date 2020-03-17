exports.index = (req, res) => {
    res.render('index', {
        title: 'Home',
        active: { home: true }
    });
};