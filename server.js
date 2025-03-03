const app = require('./app');
require("dotenv").config();

dotenv.config()
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
})  