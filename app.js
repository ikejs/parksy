// import config files
require('./config/dotenv');
require('./config/mongodb');
require('./config/express');
require('./config/errorHandler');
require('./config/routes');


app.listen(process.env.PORT || 5000);
