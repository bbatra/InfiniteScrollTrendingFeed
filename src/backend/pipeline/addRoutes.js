const app = require('./addMiddleware.js');
import viewController from '../controllers/Views'
import TrendingController from '../controllers/Trending';

app.get('/', viewController.render);
app.get('/api/trending', TrendingController.getTrendingItems)

module.exports = app;
