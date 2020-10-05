import db from '../db'
const mongoose = require('mongoose');
import OrderItemsSchema from '../schemas/OrderItems'
const OrderItems = mongoose.model('orderitems', OrderItemsSchema);
import { SEARCH_START_DATE_STRING, TRENDING_HOURS_CUTOFF } from "../../frontend/util/constants";



const getTrendingItems = async (limit, page) => {

  // const currDate = new Date(); //TODO: Use this in production and remove the demo code below
  const currDate = new Date(SEARCH_START_DATE_STRING);//this is the most recent date in our DB items + 1 minute

  const cutoffDate = new Date(currDate);//Items are tr
  cutoffDate.setHours(cutoffDate.getHours() - TRENDING_HOURS_CUTOFF);

  try{

    const aggregatePipeline = [
      { $match: {created: {$gt: cutoffDate}}}, //select orders in the last 48 hours

      {
        $group: {
          '_id': '$itemName',
          'sum': { $sum: '$quantity'}, //total quantity ordered in period
          'mostRecent': {$max: '$created'}, //most recent order for this item
        }
      },
      {
        $project: {
          '_id': '$_id',
          'sum': '$sum',
          'mostRecent': '$mostRecent',
          //Creates a score (heuristic) based on both the total quantity & the recency of order
          //score = Total Quantity / time since last order
          'score': {
            $sum: {
              $divide: [
                '$sum',
                {
                  $subtract: [
                    currDate,
                    '$mostRecent'
                  ]
                }
              ]
            }
          },
        }
      },
      {
        $sort: {
          score: -1,
          _id: 1 //we have to sort by name as well to break ties and keep paginated queries consistent
        }
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

getTrendingItems(200,0)
