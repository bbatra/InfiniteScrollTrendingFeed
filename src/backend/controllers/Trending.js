import OrderItemsService from '../services/OrderItems';

const getTrendingItems = async (req, res) => {
  //do stuff
  let { page, limit } = req.query;
  try{
    //clean the params and parse to ints
    limit = limit ? JSON.parse(limit): undefined;
    page = page ? JSON.parse(page): undefined;

    const result = await OrderItemsService.getTrendingItems(limit, page);
    if(result.error){
      res.send(500)
    }
    else {
      res.send(result);
    }
  }
  catch(e){
    res.send(500);
    console.error('[ERROR] TrendingController > getTrendingItems : ', e);
  }
}

export default {
  getTrendingItems
}