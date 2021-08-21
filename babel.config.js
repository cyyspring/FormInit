module.exports = {
    presets: [
        [
            "@babel/preset-env",
            // {
            //     "modules": "amd", 
            //     "useBuiltIns": "usage", 
            //     targets: { chrome: 44 },
            //     "corejs": 3, 
            //   }
        ]
    ],
    plugins: [
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        [
            "@babel/plugin-transform-modules-commonjs",
          
          ]
      ]
}

