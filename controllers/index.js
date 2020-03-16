exports.index = (res) => {
    res.render('index', {
    title: 'Home',
    active: { home: true }
    });
};