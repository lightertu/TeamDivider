import {injectReducer} from '../../store/reducers'
import UserIsAuthenticated from "../UserIsAuthenticated"

export default (store) => ({
    path: 'dashboard',
    /*  Async getComponent is only invoked when route matches   */
    getComponent (nextState, cb) {
        /*  Webpack - use 'require.ensure' to create a split point
         and embed an async module loader (jsonp) when bundling   */
        require.ensure([], (require) => {
            /*  Webpack - use require callback to define
             dependencies for bundling   */
            const Dashboard = require('./containers/DashboardContainer').default;
            const securedDashboard = UserIsAuthenticated(Dashboard);
            const reducer = require('./modules/reducer/reducer').default;

            /*  Add the reducer to the store on key 'counter'  */
            injectReducer(store, {key: 'dashboard', reducer});

            /*  Return getComponent   */
            cb(null, securedDashboard)

            /* Webpack named bundle   */
        }, 'dashboard')
    }
})
