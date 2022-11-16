import { auditService } from '../_services';

const state = {
    all: {}
};

const actions = {
    getAll({ commit }) {
        commit('getAllRequest');

        auditService.getAll()
            .then(
                audits  => commit('getAllSuccess', audits ),
                error => commit('getAllFailure', error)
            );
    }
};

const mutations = {
    getAllRequest(state) {
        state.all = { loading: true };
    },
    getAllSuccess(state, audits ) {
        state.all = { items: audits  };
    },
    getAllFailure(state, error) {
        state.all = { error };
    }
};

export const audits = {
    namespaced: true,
    state,
    actions,
    mutations
};
