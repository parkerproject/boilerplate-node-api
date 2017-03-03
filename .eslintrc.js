module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": [
        "import"
    ],
    "globals": {
      __DEV__: true,
      __PRODUCTION__: true,
      __CLIENT__: true
    },
    "rules":{
        "no-console":0
    },
    "parserOptions":{
     "ecmaFeatures":{
       "experimentalObjectRestSpread" :true
     }
   }
};
