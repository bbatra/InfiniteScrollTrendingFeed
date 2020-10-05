/**
 * Created by bharatbatra on 11/10/17.
 */
  // Import the "app" object that has been "decorated" by the
  // steps in the "pipeline" folder
const app = require('./pipeline/finalStep.js');
const config = require('config');
const port = config.PORT || 3030;

app.listen(port, () => {
  console.log('Server listening on port', port);
});