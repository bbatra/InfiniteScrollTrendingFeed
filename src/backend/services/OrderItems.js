import db from '../db'
const mongoose = require('mongoose');
import OrderItemsSchema from '../schemas/OrderItems'
const OrderItems = mongoose.model('orderitems', OrderItemsSchema);

const RESULTS_PER_PAGE = 40;
const TRENDING_HOURS_CUTOFF = 48;//how many hours back we need to look for trending items

const getTrendingItems = async (limit, page) => {
  // const currDate = new Date();
  const currDate = new Date('2020-03-09T06:03:00.000Z');//this is the most recent date in our DB items

  const cutoffDate = new Date(currDate);
  cutoffDate.setHours(cutoffDate.getHours() - TRENDING_HOURS_CUTOFF);

  try{

    const aggregatePipeline = [
      { $match: {created: {$gt: cutoffDate}}}, //select orders in the last 48 hours

      {
        $group: {
          '_id': '$itemName',
          'sum': { $sum: '$quantity'}, //total quantity ordered in period
          'mostRecent': {$max: '$created'} //most recent order for this item
          //TODO: create a score that takes both the order time and quantity into account
          //eg. use formula like (quantity * (TRENDING_HOURS_CUTOFF - hoursSinceOrder)
        }
      },
      {
        $sort: { sum: -1, _id: 1}//you have to sort by name as well to break ties and keep paginated queries consistent
        //TODO: change this to sort by the score once it is implemented
      }
    ]

    if(limit){
      aggregatePipeline.push({
        $limit: limit + (limit * page) + 1 //we grab one extra item so we can check if there are more items in the next page
      })
    }

    if(page && limit){
      aggregatePipeline.push({
        $skip: limit * page
      })
    }
    console.log(aggregatePipeline);

    const results = await db.aggregate(aggregatePipeline, OrderItems);
    const hasMore = !!results[limit]
    return {
      hasMore: !!results[limit], // if there is a limit+1th item, another query is still possible
      items: hasMore ? results.slice(0,-1) : results //remove last item if the extra was found
    }
  }
  catch(e){
    console.error('[ERROR] OrderItemsService > getTrendingItems ', e);
    return {
      error: e
    }
  }


}

export default {
  getTrendingItems
}

