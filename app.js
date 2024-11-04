const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Use tracking routes
require("./routes/router")(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
