/**
 * Created by Joseph on 5/11/17.
 */
import * as Actions from "../actions"
import * as ActionsHandlers from "./actionHandlers"

const initialState = {
    response: { success: "", message: ""},
    state: "waiting",
    login: { success: "", message: ""},
    loginState: "waiting",
    isAuthenticated: false,
    user: {}
};

export default function activityReducer (state = initialState, action) {
    switch(action.type) {
        // set current user
        case Actions.authActions.SET_CURRENT_USER:
            return ActionsHandlers.authActionsHandlers.handleSetCurrentUser(state, action.user);

        // reduce login actions
        case Actions.fetchUserActions.GENERATE_USER:
            return ActionsHandlers.fetchUserActionsHandlers.handleFetchUser(state, action.payload);
        case Actions.fetchUserActions.FETCH_USER_SUCCESS:
            return ActionsHandlers.fetchUserActionsHandlers.handleFetchUserSuccess(state, action.payload);
        case Actions.fetchUserActions.FETCH_USER_FAILURE:
            return ActionsHandlers.fetchUserActionsHandlers.handleFetchUserFailure(state, action.payload);

        /* reduce group assignment actions */
        case Actions.generateUserActions.GENERATE_USER:
            return ActionsHandlers.generateUserActionsHandlers.handleGenerateUser(state, action.payload);
        case Actions.generateUserActions.GENERATE_USER_SUCCESS:
            return ActionsHandlers.generateUserActionsHandlers.handleGenerateUserSuccess(state, action.payload);
        case Actions.generateUserActions.GENERATE_USER_FAILURE:
            return ActionsHandlers.generateUserActionsHandlers.handleGenerateUserFailure(state, action.payload);
        default:
            return state;
    }
};
