import { configureStore, combineReducers, createReducer } from '@reduxjs/toolkit';

const initialState = {
    username: null,
    uid: null,
    avatar: 'https://miro.medium.com/max/720/1*W35QUSvGpcLuxPo3SRTH4w.png',
    userPosts: []
}

const reducer = {
    CURRENT_USER: (state, {payload}) => {
        console.log("reducer --->", payload);
        return {
        ...state,
        username: payload.username,
        uid: payload.uid,
        avatar: payload.avatar,
        userPosts: payload.userPosts,
    }
    },
    USER_SIGNOUT: () => initialState,
};

const user =createReducer(initialState, reducer);


const rootReducer = combineReducers({
    user
});

export const store = configureStore({reducer: rootReducer, });