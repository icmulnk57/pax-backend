const express = require('express');
const cors = require('cors');  
const app = express();
const PORT = 3000;

app.use(cors());  // Enable CORS for all origins
app.use(express.json());

const cookieParser = require('cookie-parser');
app.use(cookieParser());

// Use tracking routes
require("./routes/router")(app);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
