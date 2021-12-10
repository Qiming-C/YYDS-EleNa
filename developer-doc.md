# Developer Document

This documentation is for people who are interested in the implementation of this program without spend time looking into the source code

## Architecture Diagram

**We are using client-server architecture and N-tier architecture**

![image-20211205234345792](https://tva1.sinaimg.cn/large/008i3skNgy1gx40iok8xgj314u0iuq5b.jpg)

The basic structure of this app is client sending http request to server, server then process the request sending back the appropriate response. So this allows the backend server to be deployed standalone as api server.

For backend, we use n-tier layer architecture with the **presentation layer**(our controller), the **business layer**(our services), and the **data access layer** (our map model)

## Design Element



### Front end

For our front end, we use plain HTML/CSS with JavaScript. The program is a map of elevation gain Web-based application. We use Leaflet in our project which is the open-source JavaScript library for mobile-friendly and website-friendly interactive maps. Our program can provide a web mapping service. 

#### Map coordinate positioning

Users click the map on the website to locate the specific points for outset and destination. We get the coordinate by the map's event listener function that comes from the Leaflet's library. 

#### Reverse Geocoding

After getting the coordinates, we use the reverse geocoding API to get detailed information. It uses the coordinate to find the closest suitable "Open Street Map(OSM)" object and return its address information. 

The main format of the reverse API is:
```javascript
https://nominatim.openstreetmap.org/reverse?lat=<value>&lon=<value>&<params>
```
The lat and lon are latitude and longitude of a coordinate in projection. The return result contains an osm-id that we need in our project.

#### Error Catching

The program has several error-catching. It will check the input data is in the correct format, correct area, correct return status. For example, the coordinate is not the number, the coordinate is located out of bound, the backend return status's code is not 200, etc. In these conditions, the web will pop up a window as a warning and reminder in three seconds.

#### Fetch data to Backend

Collect the user input data and the OSM data, fetch them to the back end API to find the possible route. Then waiting for the back-end data return to render the route and route info into the message box if the return data is in success code status.

#### The Map in Web

For the map, we generate the different layers in the map to provide excellent visual effects. For example, a layer with the red line box appears in our map to bound the service area in the UMass Amherst, a layer with outset's marker and destination's marker that generating when the user clicks any location on the map, a layer for the route that rendering based on the API return data.

#### The UI in Web

For the UI, we customize the left sidebar and right sidebar to provide the user's friendly UI. The left sidebar will collect the user input data that include the coordinate, expectation of distance gain, travel mode, etc. Then the information box will display the searching result with the route's distance, elevation gain, the real percentage of distance increase, number of stops, etc. The right sidebar will display group info, project description, programmer info. Users can click on the Github Icon direct to the programmer personal github page. It is able to hide when the web browser is lower than in a specific width.

### Back end

For our back end, we are using express to set up the routing. The n-tier layer architecture allows us to have better scalability. The ability to upgrade and change independent layers does not affect other layers. We have **controller layer** that is receiving the http request, then pass down to corresponding **service layer** which do the business logic using the **data access layer** in this case is the map data set we generate for vehicle and pedestrian.

#### Graph component

We are using openStreetMap(OSM) Api to get the boundary box in UMASS Amherst Area. The response will get us the `xml` format of nodes and edges. We convert the xml file into json file. Then parse into graph data structure. In our graph, it is directed weight graph. Since road could be one way or both way. We store two types of map from OSM API. One for vehicle, one for pedestrian. Then we use [Harversine formula](https://en.wikipedia.org/wiki/Haversine_formula) to compute the distance between two nodes. For the **elevation gain ** of each node, we use [open-elevation api](https://open-elevation.com/) . In terms of computing elevation gain among the paths, we only consider uphill elevation gain, ignoring the downhill elevation gain. Because if we are considering downhill elevation gain. We can go opposite direction to achieve the lower elevation gain instead of toward to destination. We want to have path that is not intentionally detour, but giving a path that is not getting away from the destination.

##### Caching the graph

When the server is running, we will generate the vehicle map data set and walk map data set. This allows us construct the graph before user interaction happens, and give ability to run the A\* algorithm and DFS algorithm as well as computing the distance between edges, and the elevation gain of each node .

#### Path Finding Algorithm

##### 1. All possible paths

We implemented the **DFS** for finding all the possible paths between two nodes with options argument.

```javascript
function DFSUtils(source, target, isVisited, pathList, final, maxLength)
```

This will return a list of paths from source node to target node with statistical data such as, elevation gain, total distance, number of nodes.

##### 2. Shortest path

Then we use [ngraph.path](https://github.com/anvaka/ngraph.path) to run the A\* algorithm to find the shortest path then we compute the distance and the elevation gain in our own implementation. We implemented three different heuristic functions to compare the difference which are Manhattan distance, Euclidean distance, and Haversine formula. If no heuristic function is passed in. The **A\*** will run as **Dijkstra** algorithm.

##### 3. Process the request

Finally, we compare the shortest path with list of possible paths by accepting the percentage of shortest path(from 0-1, 0 mean the max/min elevation gain need to be under the distance of shortest path, 1 mean the max/min elevation gain can be considered under 2 times of shortest distance path), and the option of minimum elevation gain or maximum elevation gain.

> For example, if there is shortest distance of 100 meters, the percentage is set to 1. The algorithm can consider all possible paths with up to 200 meters consideration when finding the maximum/minimum elevation gain.

Error handling is also being handled, when parsing the request or couldn't find the path between 2 nodes. The response will send 400 status code.

## Test

For testing, we using **Behavior Driven Development** style for writing the test suites. The testing framework we are using is called [mocha](https://mochajs.org/) with assertion library [chai](https://www.chaijs.com/api/assert/). To ensure our test suites are well written and tested. We also include the [istanbul](https://istanbul.js.org/) which is javascript test coverage package. This allows us to make sure we at least hitting 90% of line coverage and 80% of branch coverage. Currently, we have all test suites passed 98% line coverage and branch coverage except the `heuristic.js` because there are two heuristic function we are only used for expeirmental which will mention in the evaluation section.

![image-20211207223011832](https://tva1.sinaimg.cn/large/008i3skNgy1gx69mp1of3j31tm0u0djk.jpg)

## Api documentation

As developer, the api documentation will greatly helpful for other developer knows how each endpoint is used and handled. We use [swagger ui](https://www.npmjs.com/package/swagger-ui-express) to generate a Api documentation which user can simulate the request without open up the frontend page.

![image-20211207222943673](https://tva1.sinaimg.cn/large/008i3skNgy1gx69ma17x4j31t70u00vl.jpg)

## Experimental Evaluation

### A\* algorithm heuristic function

We have compared three heuristic functions to see how close to the optimal. When the `Manhattan distance` heuristic function is used for A*, the result is not achieved to be optimal. Because it requires the graph to be perfectly align the grid, which mean it will work optimally when the graph can only go four directions (left, right,down, up). When the `Euclidean distance` heuristic function is used, the result is optimal comparing with the google map result. Because the Euclidean distance formula is also called **Pythagorean distance**. Which we can move not only four directions but also diagonally. This can be implied in our graph, since each node is represented as (longitude, latitude) pair. Lastly, we also implemented the `haversine formula` as heuristic function for `A star`. This give us the same result as Euclidean distance, since it computes the great-circle distance between two points on earth given by their *longitudes* and *latitudes\* . This will more predictable and accraucy for our A start function.

### DFS scalability issue

We also encounter issue when running DFS for walking data set. We realize that finding all the simple paths is essential NP-hard problem. The DFS will works fine if the node in the map is spare and less. However, in our walking data set, we have over 3200 nodes in the UMASS. This will cause DFS to run forever since the time complexity will be exponential growth. In this case, we decide if two nodes 's distance is over 500m or the number of node of shortest path is over 20. We will return the shortest path instead of letting user wait forever to get the response.

DFS works well in our car data set with over 1000 nodes. But we still add the constraint to it to prevent going too deep in the recursive call. We pass one more argument of `maxDepth` to allow the DFS only go `maxDepth` depth. And we only need 1000 possible paths, if we have 1000 possible paths in the call stack, we will terminate the DFS.

> We intensively test the request by using Postman, then compare with result with different percentage limit with max/min elevation gain choice, it works well when it comes to render the path. We can see many different path among two points when altering the percentage of shortest path

### A \* performance

The performance of this algorithm is extremely fast, because the implementation of heap of changing prioirty takes only O(log n ) time. The algorithm reveal the nodes during its exploration as much as possible, this is solved by recycling the nodes when needed. The author of `ngraph.path` also compare the performance of New York City with 700,000 more edges and 260,000 more nodes.

| Algorithm | Average | Median | Min | Max   |
| --------- | ------- | ------ | --- | ----- |
| A\*       | 55ms    | 38ms   | 0ms | 356ms |
| Dijkstra  | 264ms   | 258ms  | 0ms | 782ms |

We find out that with help of heuristic functions, the A\* will give us the optimal result much faster than the Dijkstra.
