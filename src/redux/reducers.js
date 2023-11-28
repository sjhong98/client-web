const initialState = {
    login: false,
    newUser: false,
    isLoading: false,
    email: "",
    patientDid: "",
    patientName: "",
    patientRecord: {},
    patientJwt: "",
    jwtObj: [],
    patientInfo: {},
    patientVc: [],
}

const dataReducer = (state = initialState, action) => {
    switch(action.type) {

        case 'SET_PATIENT_INFO' :
            return {
                ...state,
                patientInfo: action.payload,
            }

        case 'SET_PATIENT_VC' :
            return {
                ...state,
                patientVc: action.payload,
            }

        case 'SET_PATIENT_JWT' :
            return {
                ...state,
                patientJwt: action.payload,
            }

        case 'SET_LOGIN' :
            return {
                ...state,
                groupMember: action.payload,
            }

        case 'SET_NEW_USER' :
            return {
                ...state,
                newUser: action.payload,
            }

        case 'SET_IS_LOADING' :
            return {
                ...state,
                isLoading: action.payload,
            }

        case 'SET_EMAIL' : 
            return {
                ...state,
                email: action.payload,
            }

        case 'SET_PATIENT_DID' :
            return {
                ...state,
                patientDid: action.payload,
            }

        case 'SET_PATIENT_NAME' :
            return {
                ...state,
                patientName: action.payload,
            }
        
        case 'SET_PATIENT_RECORD' :
            return {
                ...state,
                patientRecord: action.payload,
            }

        case 'SET_JWT_OBJ' :
            return {
                ...state,
                jwtObj: action.payload,
            }
        
        default :
            return state;
    }
}

export default dataReducer;