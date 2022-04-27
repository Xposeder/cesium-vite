module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:vue/vue3-essential"
    ],
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "globals": {
        Cesium: 'readonly',
        defineProps: 'readonly'
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
}
