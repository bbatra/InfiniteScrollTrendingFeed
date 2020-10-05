import React from 'react';
import axios from 'axios';

const ITEMS_PER_PAGE = 40;//TODO: abstract better

class TrendingFeedContainer extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      items: [],
      loading: false,
      page: 0,
      prevY: 0,
      hasMoreItems: true,
    }
  }

  getTrendingItems = async (page) => {
    this.setState({loading: true});
    try {
      const result = await axios.get(`/api/trending?page=${page}&limit=${ITEMS_PER_PAGE}`);

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

  handleObserver = (entities, observer) => {
    const y = entities[0].boundingClientRect.y;
    if (this.state.prevY > y && this.state.hasMoreItems) {
      this.getTrendingItems(this.state.page);
    }
    this.setState({ prevY: y });
  }

  componentDidMount(){
    this.getTrendingItems(this.state.page);

    const observerOptions = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0
    }

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
        {this.state.items.map(item => <div style={{height: '30px'}}key={item._id+item.sum}> {item._id} ordered {item.sum} times </div>)}
        <div
          ref={loadingRef => (this.loadingRef = loadingRef)}
          style={loadingCSS}>
          <span style={loadingTextCSS}>Loading...</span>
        </div>
      </div>
    )
  }
}

export default TrendingFeedContainer;
