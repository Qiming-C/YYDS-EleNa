# YYDS-Elevation Gain Navigation 

Elena is an app for computing the elevation gain in map navigation that runs on Express Server. You can select the start and end points and then calculate the minimum elevation gain or maximum elevation gain by limiting the percentage of the shortest path. The app is used by runners, bikers, walkers and drivers. Users have different options to decide if they want to find a smoother path or a steeper path.

## Build

MAKE SURE you in the  **`Backend`** folder



Use `npm` to install all necessary dependencies

```shell
npm install
```



## Bounding Box 

Due to the computation power limit, this app is restricted to be UMASS Amherst area. If you want to change the boundary.  Go to `enum.js` where you can specify the boundary as `left,bottom,right,top` 

As example here 

```javascript
const UMA_BOX = [-72.5381, 42.375, -72.5168, 42.398];
const CAR_HIGHWAY = [
  "primary",
  "motorway",
  "secondary",
  "tertiary",
  "unclassified",
  "residential",
  "trunk",
  "service",
  "road",
  "primary_link",
  "trunk_link",
  "secondary_link",
  "tertiary_link",
];

const CAR_settings = {
  // Define my settings
  bbox: UMA_BOX,
  highways: CAR_HIGHWAY,
  timeout: 2000000000,
  maxContentLength: 3000000000,
};
```



## Run the server



```shell
npm start
```

Once log shows data is loaded,  you can open index.html via `frondend` folder to make request


## Api doc

More conveniently, we also use swagger to generate our api documentation, once the server is up. 

Visit `localhost:3000/api-docs` to see the api doc and test it out 



## Run the test

We provide two commands to run the test suites which produce the line coverage report power by [Istanbul](https://www.npmjs.com/package/nyc). 



```
npm run coverage-html
```

This command will run the test suites and generate the report in `coverage` folder.

```
npm run coverage-text
```

This command will run the test suites and generate the report in the console with plain text



## Contributor 

| Avatars | Name | GitHub |
| ------------- | ------------- | ------------- |
| <img src="https://avatars.githubusercontent.com/u/70599965?v=4" width="120" height="120" /> | Jiafeng Li        | [Jiafeng-Li95](https://github.com/Jiafeng-Li95) |
| <img src="https://avatars.githubusercontent.com/u/63128458?v=4" width="120" height="120" /> | Shing Hong Lau | [hilshong2580](https://github.com/hilshong2580) |
| <img src="https://avatars.githubusercontent.com/u/49624964?v=4" width="120" height="120" /> | Qiming Chen | [Qiming-C](https://github.com/Qiming-C) |



## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)

