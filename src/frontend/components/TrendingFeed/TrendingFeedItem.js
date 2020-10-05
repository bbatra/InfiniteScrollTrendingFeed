import React from 'react';
import { formatTimeAgo } from "../../util/time";
import { SEARCH_START_DATE_STRING } from "../../util/constants";

class TrendingFeedItem extends React.Component{
  render(){
    const { sum, name, mostRecent } = this.props;

    // For the purpose of this demo, we use a fix starting date
    const timeDiffFromStart = new Date(SEARCH_START_DATE_STRING) - new Date(mostRecent);

    // Time ago works based off current date
    // so we'll use relative difference along with today's date for demo values to look right
    const timeFormatted = formatTimeAgo(new Date() - timeDiffFromStart);

    return (
      <div
        style={{
          display: 'flex',
          flexFlow: 'row',
          padding: 20,
          border: `1px solid silver`
        }}
      >
        <div style={{width: 400}}>{name}</div>
        <div style={{width: 400}}> {sum} purchased recently </div>
        <div>ordered  {timeFormatted} </div>
      </div>
    )
  }
}

export default TrendingFeedItem;