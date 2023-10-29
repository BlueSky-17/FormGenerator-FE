export const initialState = {
    name: '',
    description: '',
    modal: '',
    isOpen: false
};

export const actions = {
    SET_NAME: 'set_name',
    SET_DESCRIPTION: 'set_descripton',
    SET_MODAL: 'set_modal',
    ADD_FORM: 'add_form',
};

export const setName = payload => {
    return {
        type: actions.SET_NAME,
        payload
    }
}

export const setDescription = payload => {
    return {
        type: actions.SET_DESCRIPTION,
        payload
    }
}

export const setModal = payload => {
    return {
        type: actions.SET_MODAL,
        payload
    }
}

export const reducer = (state, action) => {
    switch (action.type) {
        case actions.SET_NAME:
            return {
                ...state,
                name: action.payload
            };
        case actions.SET_DESCRIPTION:
            return {
                ...state,
                description: action.payload
            };
        case actions.SET_MODAL:
            return {
                ...state,
                modal: action.payload.modal,
                isOpen: action.payload.isOpen
            };
        default:
            throw new Error('Invalid action')
    }
};