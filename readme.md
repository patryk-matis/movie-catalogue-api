# Movie Catalogue API
Simple movie catalogue API for The Software House

# Example usage
Getting movies:
* `POST /api/movie/get`
* body should contain either `duration` or `genres` or both

Adding movie:
* `POST /api/movie/add`
* body should contain `genres` - string array, `title`, `runtime`, `year`, `director`
* optional: `posterUrl`, `actors` - string, `plot`
![image](https://user-images.githubusercontent.com/13303797/121419096-e5432a80-c96b-11eb-8776-4052216224b0.png)


# Install
Inside the root directory run the following commands:
* `git clone [url of repo]`
* `cd [repo name]`
* `npm install `

# Run
```
npm start
```
