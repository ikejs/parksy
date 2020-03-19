exports.index = (req, res) => {
    res.render('index', {
        title: 'Home',
        nav: true,
        active: { home: true }
    });
};