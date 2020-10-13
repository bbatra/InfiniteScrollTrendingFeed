import React from 'react';
import axios from 'axios';
import TrendingFeedItem from './TrendingFeedItem';
import { RESULTS_PER_PAGE } from "../../util/constants";

class TrendingFeedContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      loading: false,
      page: 0,//page number from Db results
      prevY: 0,//tracks position of bottom most row in view
      hasMoreItems: true,//whether the DB has more data we can query for
    }
  }

  getTrendingItems = async (page) => {
    this.setState({loading: true});
    try {
      const result = await axios.get(`/api/trending?page=${page}&limit=${RESULTS_PER_PAGE}`);

      if(result.data && result.data.items){
        this.setState({
          items: [...this.state.items, ...result.data.items],
          hasMoreItems: result.data.hasMore,
          page: this.state.page + 1
        })
      }

    }
    catch(e){
      console.error('[ERROR] TrendingFeedContainer > getTrendingItems : ', e);
      //TODO: throw error message as toast / retry / handle gracefully
    }
    finally{
      this.setState({loading: false});
    }
  }

  handleObserver = (entities) => {
    const y = entities[0].boundingClientRect.y;

    //make sure to only call server when scrolling down, and not while scrolling up
    if (this.state.prevY > y && this.state.hasMoreItems) {
      this.getTrendingItems(this.state.page);
    }
    this.setState({ prevY: y });
  }

  componentDidMount(){
    this.getTrendingItems(this.state.page);

    const observerOptions = {
      root: null,//i.e. viewport is the root object to observe
      threshold: 1.0//invokes callback when 100% of the target is visible within the viewport
    };

    this.observer = new IntersectionObserver(this.handleObserver, observerOptions);
    this.observer.observe(this.loadingRef);
  }

  render(){

    const loadingCSS = {
      height: '100px',
      margin: '30px'
    };

    const loadingTextCSS = { display: this.state.loading ? "block" : "none" };

    return (
      <div>
        {
          this.state.items.map(item => <TrendingFeedItem
                                          name={item._id}
                                          sum={item.sum}
                                          mostRecent={item.mostRecent}
                                          key={item._id + item.mostRecent}
                                        />)
        }
        <div
          ref={ (loadingRef) => this.loadingRef = loadingRef }
          style={loadingCSS}
        >
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    )
  }
}

export default TrendingFeedContainer;
