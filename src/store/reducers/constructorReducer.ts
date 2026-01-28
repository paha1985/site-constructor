import { ConstructorState } from "../../types";
import { createComponent } from "../..//utils/createComponent";

export const initialSiteData = {
  id: "site_1",
  name: "Мой сайт",
  status: "draft", 
  createdAt: new Date().toISOString(), 
  updatedAt: new Date().toISOString(),
  settings: {
    backgroundColor: "#ffffff",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  components: [
    createComponent("header", {
      text: "Добро пожаловать!",
      level: 1,
    }),
    createComponent("paragraph", {
      text: "Это ваш новый сайт. Начните редактирование!",
    }),
    createComponent("button", {
      text: "Начать",
    }),
  ],
};

// Гарантируем, что initialSiteData существует и имеет правильную структуру
const validatedInitialSiteData = initialSiteData || {
  id: "site_1",
  name: "Мой сайт",
  status: "draft", 
  createdAt: new Date().toISOString(), 
  updatedAt: new Date().toISOString(), 
  settings: {
    backgroundColor: "#ffffff",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  components: [],
};

const initialState: ConstructorState = {
  site: validatedInitialSiteData,
  selectedComponentId: null,
  isPreviewMode: false,
  loading: false,
  error: null,
};

type ConstructorAction = 
  | { type: 'ADD_COMPONENT'; payload: any }


const constructorReducer = (state = initialState, action: ConstructorAction): ConstructorState => {
  console.log(state);
  switch (action.type) {
    case "ADD_COMPONENT":
      return {
        ...state,
        site: {
          ...state.site,
          components: [...(state.site?.components || []), action.payload],
        },
      };

    default:
      return state;
  }
};

export default constructorReducer;
