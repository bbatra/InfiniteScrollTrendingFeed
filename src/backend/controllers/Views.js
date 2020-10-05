/**
 * Created by bharatbatra on 11/10/17.
 */
import renderHTML from '../views/indexHTML.js';
import renderReactAppAsString from '../views/reactApp';
import OrderItemsService from '../services/OrderItems';

function render(req, res, next) {

  const layoutOptions = {
    bundleJS: 'static/scripts/web-bundle.js'
  };

  //ANY CLIENT SIDE CONFIG GOES HERE
  const clientConfig = {};

  //TODO: enable if you want Server Side Rendering for your react app
  // const stringifiedApp = renderReactAppAsString();
  const stringifiedApp = "";
  const fullHTML = renderHTML(layoutOptions, stringifiedApp, clientConfig);

  res.send(fullHTML);
}

export default {
  render
}

