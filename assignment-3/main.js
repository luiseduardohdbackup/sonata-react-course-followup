console.log('start');
//import thunk from 'redux-thunk';
// This is:
//     const Component = React.Component;
// The same as below (destructured):
const { Component } = React;
const { Provider, connect } = ReactRedux;
const { bindActionCreators,combineReducers,
    createStore,applyMiddleware,compose } = Redux;
	
//const { thunk } = ReduxThunk;
//const { thunk } = Thunk;
//const { thunk } = thunk;


//https://github.com/anup007np/swapi-react-redux/tree/master/src/reducers
	
const REQUEST_MOVIES = 'REQUEST_MOVIES';
const RECEIVE_MOVIES = 'RECEIVE_MOVIES';
const SEARCH_MOVIES = 'SEARCH_MOVIES';
const HANDLE_SORTING = 'HANDLE_SORTING';
const ERROR = 'ERROR';

//import { REQUEST_MOVIES, RECEIVE_MOVIES, SEARCH_MOVIES, HANDLE_SORTING, ERROR } from './types';
//import axios from 'axios';

const requestMovies = () => {
    return {
        type: REQUEST_MOVIES,
        payload: true
    }
}

const receiveMovies = (json) => {
    return {
        type: RECEIVE_MOVIES,
        payload: json
    }
}

const receiveMoviesError = (err) => {
    return {
        type: ERROR,
        payload: err
    }
}


const handleSearching = (searchText) => {
    return {
        type: SEARCH_MOVIES,
        payload: searchText
    }
}


const handleSorting = (sortKey) => {
    return { 
        type: HANDLE_SORTING,
        payload: sortKey
    };
}

const fetchMovies = () => {
    return (dispatch) => {
        dispatch(requestMovies());
        return axios
            .get('https://star-wars-api.herokuapp.com/films')
            .then(response => {
                dispatch(receiveMovies(response.data));
            })
            .catch ( err => {
                dispatch(receiveMoviesError(err))
            })
    }
}
// components // SortBy.jsx
const SortBy = ({ onSortByChange })=> {
    return(
        <div className="col-md-2">
            <select className="form-control" id="ControlSelect" onChange={onSortByChange}>
                <option>Sort by...</option>
                <option value="episode">Episode</option>
                <option value="year">Year</option>
            </select>
        </div>
    )
}

// components // Search.jsx
const Search = ({ onInputChange }) => {
    return(
        <div className="col-md-10">
            <input type="text" className="form-control"  onChange={onInputChange} placeholder="Type movie title to filter..."/>
        </div>
    )
}


//swapi-react-redux/src/reducers/initialState.js
const initialState = {
    movies: {
        movieList: [],
        searchText: null,
        sortBy: null,
        loading: false,
        error: null
    }
};

//swapi-react-redux/src/reducers/moviesReducer.js
function movieReducer(state = initialState.movies, action) {
    switch(action.type) {
        case REQUEST_MOVIES:
            return {
                ...state,
                loading: true
            }
        case RECEIVE_MOVIES:
            return {
                ...state,
                loading: false,
                movieList: action.payload
            }
        case ERROR:
            return {
                ...state,
                error: action.payload
            }
        case HANDLE_SORTING:
            return {
                ...state,
                sortBy: action.payload
            }
        case SEARCH_MOVIES:
            return {
                ...state,
                searchText: action.payload
            }
        default :
            return state;
    }
}


// components // MovieList.jsx
const MovieList = (props) => {
    return (
        <div className="card">
            <div className="card-body">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">Episode</th>
                            <th scope="col">Title</th>
                            <th scope="col">Release Date</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        { props.movieList.map((movie) =>
                            (
                                <tr key={movie.id}>
                                    <td>{movie.fields.episode_id}</td>
                                    <td>{movie.fields.title}</td>
                                    <td>{movie.fields.release_date}</td>
                                    <td><button type="button" id={movie.id} className="btn btn-info" onClick={props.onClickDetail}>View Detail</button></td>
                                </tr>
                            )
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}


// components // MovieDetail.jsx
const MovieDetail = (movieDetailList) => {
    return (
        Object.values(movieDetailList).map((item) => {
            return item.map(t => {
                return (
                    <div className="card" key={t.id}>
                        <div className="card-header">
                            <span className="bold">Movie description</span>
                        </div>
                        <div className="card-body">
                            <h5 className="card-title">{ t.fields.title }</h5>
                            <p className="card-text">{ t.fields.opening_crawl }</p>
                            <p>Director: { t.fields.director }</p>
                            <p>Producer: { t.fields.producer }</p>
                            <p>Release Date: { t.fields.release_date }</p>
                        </div>
                    </div>
                )
            })
        })
    )
}


//swapi-react-redux/src/reducers/index.js
const rootReducer = combineReducers({
    movies: movieReducer
})

//
function createThunkMiddleware(extraArgument) {
	  return function (_ref) {
	    var dispatch = _ref.dispatch,
	        getState = _ref.getState;
	    return function (next) {
	      return function (action) {
	        if (typeof action === 'function') {
	          return action(dispatch, getState, extraArgument);
	        }

	        return next(action);
	      };
	    };
	  };
	}

var thunk = createThunkMiddleware();
//thunk.withExtraArgument = createThunkMiddleware;

//swapi-react-redux/src/store/index.js

const middleware = [thunk];
//const middleware = [];

/* Create a function called configureStore */
 function configureStore() {
	 return createStore(rootReducer)
	 /*
    return createStore(
        //combineReducers(rootReducer),
		movieReducer,
        compose(
            applyMiddleware(...middleware),
            window.__REDUX_DEVTOOLS_EXTENSION__ &&  window.__REDUX_DEVTOOLS_EXTENSION__()
        )
    );
	*/
}

// Lib
const getFilteredMovieList = (sortKey, movies, searchText) => {
    var updatedMovieList = movies;
    if(searchText){
        updatedMovieList = movies.filter((item => item.fields.title.toLowerCase().search(searchText.toLowerCase()) !== -1));
    }

    if (sortKey === 'year') {
        return updatedMovieList.sort((a, b) => new Date(a.fields.release_date) - new Date(b.fields.release_date));
      } else if (sortKey === 'episode') {
        return updatedMovieList.sort((a, b) => a.fields.episode_id - b.fields.episode_id);
      } else {
        return updatedMovieList;
      }
}

const getMovieDetail = (movieId, movies) => {
    return movies.filter(x => x.id === Number(movieId));
}


// components // containers //  

class MoviesComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            movieDetailList: [],
            isDetail: false
        };
        this.returnMovieList = this.returnMovieList.bind(this);
        //this.handleViewDetail = this.handleViewDetail.bind(this);
    }

    componentDidMount() {
        //this.props.dispatch(fetchMovies());
    }

    returnMovieList() {
        // Retrieve movielist from the store and sort the result
         const { sortKey, movieList, searchText } = this.props;
         return getFilteredMovieList(sortKey, movieList, searchText);
    }

    handleViewDetail(event) {
        const movieId = event.target.id;

        const { movieList } = this.props;

        let movieDetail = getMovieDetail(movieId, movieList)

        this.setState({
            movieDetailList: movieDetail,
            isDetail: true
        });
    }

    renderMovieDetail() {
        const MovieDetailComponent = () => {
            return (
                <div className="card">
                    <div className="card-header">
                        <span className="bold">Movie description</span>
                    </div>
                    <div className="card-body">
                        <p className="card-text">No movie selected.</p>
                    </div>
                </div>
            )
        };

        return (
            <div className="col-6">
                { this.state.isDetail ? <MovieDetail movieDetailList={this.state.movieDetailList} /> : <MovieDetailComponent /> }
            </div>
        )
    }

    render() {
        const { error, loading } = this.props;

        if (error) {
            return (
                <div class="alert alert-warning" role="alert">
                    Error! {error.message}
                </div>
            )
        }

        if (loading) {
            return (
                <div>
                    <span class="sr-only">Loading...</span>
                </div>
            )
        }

        return (
            <div className="row">
                <div className="col-6">
                    <MovieList movieList={this.returnMovieList()} onClickDetail={this.handleViewDetail} />
                </div>
               { this.renderMovieDetail() }
            </div>
        )
    }
}

function moviesMapStateToProps(state) {
	//debugger;
    return {
        movieList : state.movies.movieList,
        sortKey : state.movies.sortBy,
        loading: state.movies.loading,
        error: state.movies.error,
        searchText : state.movies.searchText,
    }
}


//const Movies =  
const Movies = connect(moviesMapStateToProps, null) (MoviesComponent);



// components // containers

//import SortBy from '../SortBy';
//import Search from '../Search';

//import { handleSorting, handleSearching } from '../../actions/';

class HeadersComponent extends Component {
    constructor(props) {
        super(props);
        this.handleSortByChange = this.handleSortByChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleSortByChange(event) {
        const value = event.target.value;
        const { onSortByChange } = this.props;
        onSortByChange(value);
    }

    handleInputChange(event) {
        const value = event.target.value;
        const { onInputChange } = this.props;
        onInputChange(value);
    }

  render() {
    return (
        <div className="headerBox highlight">
            <div className="row">
                <SortBy onSortByChange={this.handleSortByChange}/>
                <Search onInputChange={this.handleInputChange}/>
            </div>
        </div>
    )
  }
}

function headersMapStateToProps(state) {
	//debugger;
    return {
        movieList : state.movies.movieList,
        loading: state.movies.loading,
        error: state.movies.error
    }
}

function mapDispatchToProps(dispatch) {
    return {
        onSortByChange: (value) => {
            dispatch(handleSorting(value));
        },
        onInputChange: (name,value) => {
            dispatch(handleSearching(name,value));
        }
    }
}

//const 
const Headers =  connect(headersMapStateToProps, mapDispatchToProps)(HeadersComponent);

class App extends Component {
  render() {
    return (
      <div className="container">
        <div className="row">
        <h1 className="center">A SWAPI + REACT + REDUX PROJECT</h1>
        </div>
        <Headers />
        <Movies />
      </div>
    );
  }
}


const store = configureStore();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>, 
    document.getElementById('app')
);

/*
ReactDOM.render(
      <Provider store={store}>
        <AppContainer />
      </Provider>,
      document.getElementById('app')
);
*/

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();