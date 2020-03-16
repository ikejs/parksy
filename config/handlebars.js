const exphbs = require("express-handlebars");

hbs = exphbs.create({
    defaultLayout: 'main',
    helpers: {
        // add helpers
    }
  });

  export default handlebarsConfig;
