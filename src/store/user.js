export default {
    namespaced: true,
    state: {
        firstName: null,
        lastName: null,
        username: null,
        email: null,
        token : null,
        rights: []
    },
    getters: {
        fullName: state => state.firstName + ' ' + state.lastName,
        username: state => state.username,
        email: state => state.email,
        token: state => state.token,
        rights: state => state.rights
    },
    actions: {
        // updateToken({state, dispatch, commit}, token) {
        //     window.localStorage.setItem('token', token)
        // }
    },
    mutations: {
        updateUserInfo(state, userInfo) {
            state.username = userInfo.username
            //
        }
    }
}
