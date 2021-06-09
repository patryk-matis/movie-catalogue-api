const router = require('express').Router();
const fs = require('fs');
const {randomMovie, isUrl} = require('../methods/movieMethods');

router.post('/get', async (req,res) => {
    try{
        const {duration, genres} = req.body;
        const rawdata = fs.readFileSync('./data/db.json');
        let moviefile = JSON.parse(rawdata);
        let filteredMovies = moviefile.movies, movieId;
        let sortedArray = [];
        let numOfMatched;

        if (duration){
            filteredMovies = moviefile.movies.filter(movie => {
                if ((movie.runtime <= duration+10 && movie.runtime >= duration) || (movie.runtime >= duration-10 && movie.runtime <= duration)){
                    return movie;
                }
            });
            movieId = randomMovie(1, filteredMovies.length)-1;            
        }

        if (!duration && !genres){
            movieId = randomMovie(1, moviefile.movies.length)-1;
        }

        if (genres){
            filteredMovies.map(movie => {
                numOfMatched = movie.genres.filter(genre => genres.includes(genre)).length;
                if (numOfMatched > 0){
                    movie["numOfMatched"] = numOfMatched;
                    sortedArray.push(movie);
                }
            });
            sortedArray = sortedArray.sort((a, b) => (a.numOfMatched > b.numOfMatched) ? -1 : 1);
            sortedArray.map(movie => {
                delete movie.numOfMatched;
            });
            filteredMovies = sortedArray;

        } else {
            return res.status(200).json(filteredMovies[movieId]);
        }

        res.status(200).json((filteredMovies.length > 0) ? filteredMovies : {message: "Nothing found"});
    }
    catch(e){
        res.status(400).json({error: e.message});
    }
})

router.post('/add', async (req, res) => {
    try {
        const {genres, title, year, runtime, director, actors, plot, posterUrl} = req.body;
        const rawdata = fs.readFileSync('./data/db.json');
        let moviefile = JSON.parse(rawdata);
        let notSupported = false;

        //Genres validation
        if (genres){
            genres.map(genre => {
                if(!moviefile.genres.includes(genre)){
                    notSupported = true;
                }
            });
            if (notSupported){
                return res.status(400).json({error: "One of the specified genres are not supported."});
            }
        }
        else {
            return res.status(400).json({error: "You have to specify genres."});
        }

        //Title validation
        if (title){
            if (title.length > 255){
                return res.status(400).json({error: "Specified title is too long (>255)"});
            }
            else {
                moviefile.movies.map(movie => {
                    if (movie.title == title){
                        notSupported = true;
                    }
                });
                if (notSupported) {
                    return res.status(400).json({error: "This move is already in the catalogue."});
                }
            }
        }
        else {
            return res.status(400).json({error: "You have to specify a title."});
        }

        //Year validation
        if (year){
            if (isNaN(year)){
                return res.status(400).json({error: "Year must be a number."});
            }
        }
        else{
            return res.status(400).json({error: "You have to specify a year."});
        }

        //Runtime validation
        if(runtime){
            if (isNaN(runtime) || runtime < 1){
                return res.status(400).json({error: "Runtime must be a positive number (in minutes)."});
            }
        }
        else{
            return res.status(400).json({error: "You have to specify a runtime."});
        }

        //Director validation
        if (director){
            if (director.length > 255){
                return res.status(400).json({error: "Specified director name is too long (>255)"});
            }
        }
        else {
            return res.status(400).json({error: "You have to specify a director."});
        }

        //Optional validation
        if (actors && actors.length < 3){
            return res.status(400).json({error: "Actors field should contain at least 3 characters (if specified)."});
        }
        if (plot && plot.length < 3){
            return res.status(400).json({error: "Plot field should contain at least 3 characters (if specified)."});
        }
        if (posterUrl && !isUrl(posterUrl)){
            return res.status(400).json({error: "PlotUrl does not contain a valid URL."});
        }

        moviefile.movies.push(
            {
                "id": moviefile.movies.length+1,
                "title": title,
                "year": year,
                "runtime": runtime,
                "genres": genres,
                "director": director,
                "actors": actors,
                "plot": plot,
                "posterUrl": posterUrl
            }
        );

        const updatedFile = JSON.stringify(moviefile, null, "\t");
        fs.writeFileSync('./data/db.json', updatedFile, err => {
            if (err){
                console.log(err);
                throw err;
            }
        });

        res.status(200).json({message: "Movie was successfully added."});

    }
    catch(e){
        res.status(400).json({error: e.message});
    }

});

module.exports = router;