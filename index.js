(async () => {
	// get genres
	let genres = [];
	const displayGenres = () => {
		for (const genre of genres) {
			const div = document.createElement("div");
			div.classList.add("checkbox");
			div.innerHTML = `
			<input type="checkbox" id="genre${genre.id}" value="${genre.id}">
			<label for="genre${genre.id}">${genre.name}</label>
		`;

			document.querySelector("#all-genres").appendChild(div);
		}
	};
	try {
		({ data: { genres } } = await axios.get(
			"https://api.themoviedb.org/3/genre/movie/list?api_key=4b830d2cad014722b35470fc237c5737&language=en-US"
		));
		displayGenres();
	} catch (err) {
		document.querySelector("#all-genres").remove();
	}

	//get configuration url for image
	const fetchConfig = async () => {
		const { data } = await axios.get(
			"https://api.themoviedb.org/3/configuration?api_key=4b830d2cad014722b35470fc237c5737"
		);
		const { secure_base_url, poster_sizes } = data.images;
		return `${secure_base_url}${poster_sizes[3]}`;
	};
	const urlConfig = await fetchConfig();

	//movie list
	let movies = [];
	const fetchMovies = async (rating, genres, year) => {
		try {
			const { data: { total_pages } } = await callAxios(1, rating, genres, year);
			const randomPage = Math.floor(Math.random() * total_pages) + 1;
			const { data: { results } } = await callAxios(randomPage, rating, genres, year);
			movies = results;
			shuffleArray(movies);
			movies.splice(6);
		} catch (err) {
			document.body.innerHTML = `<p id="error-message">Something went wrong, please try again later.</p>`;
		}
	};
	const callAxios = (page = 1, rating, genres, year) => {
		const params = {
			api_key       : "4b830d2cad014722b35470fc237c5737",
			language      : "en-US",
			sort_by       : "popularity.desc",
			include_adult : false,
			include_video : false,
			page          : page
		};

		if (rating) params["vote_average.gte"] = rating;
		if (genres) params.with_genres = genres;
		if (year) params.year = year;
		return axios.get("https://api.themoviedb.org/3/discover/movie", {
			params
		});
	};

	//buttons for pagination
	const setButtons = () => {
		let innerHTML = "";
		for (let i = 0; i < movies.length; i++) {
			innerHTML += `<button class="page">${i + 1}</button>`;
		}

		document.querySelector("#pages").innerHTML = innerHTML;
		const w = 100 / movies.length;
		document.querySelectorAll("#pages button").forEach((button) => {
			button.style.width = `${w}%`;
		});
	};

	//event listeners for buttons
	const setEventListeners = () => {
		if (movies.length > 0) {
			for (let i = 0; i < pages.length; i++) {
				pages[i].addEventListener("click", () => {
					const url = `${urlConfig}${movies[i].poster_path}`;
					let genresNames = "";
					if (genres.length > 0) {
						for (const id of movies[i].genre_ids) {
							const { name } = genres.find((genre) => genre.id === id);
							genresNames += `${name} `;
						}
					} else {
						genresNames = "N/A";
					}

					document.querySelector("main article").innerHTML = `
						<figure>
							<img src="${urlConfig}${movies[i].poster_path}" alt="Movie Poster">
						</figure>
						<section>
							<h3>${movies[i].title}</h3>
							<p id="rating"><span>Rating:</span> ${movies[i].vote_average} (${movies[i].vote_count})</p>
							<p id="genres"><span>Genres:</span> ${genresNames}</p>
							<p id="language"><span>Language:</span> ${movies[i].original_language}</p>
							<p id="release-date"><span>Release date:</span> ${movies[i].release_date.replace(/-/g, "/")}</p>
							<p id="summary"><span>Summary:</span><br><span>${movies[i].overview}</span></p>
						</section>
					`;
				});
			}
		} else {
			document.querySelector("main article").innerHTML = `
				<p id="no-movies">There are no recommendations with given filters.</p>
			`;
		}

		// style for selected page button
		for (const page of pages) {
			page.addEventListener("click", function () {
				clearPageClasses();
				this.classList.add("selected");
			});
		}

		if (pages[0]) {
			pages[0].classList.add("selected");
			pages[0].click();
		}
	};

	const clearPageClasses = () => {
		for (const page of pages) {
			if (page.classList.contains("selected")) {
				page.classList.remove("selected");
				break;
			}
		}
	};

	// enable filters
	document.querySelector("form").addEventListener("submit", async (event) => {
		event.preventDefault();

		const year = document.querySelector("input[type='number']").value;
		let genres = "";
		document.querySelectorAll("input[type='checkbox']").forEach((checkbox) => {
			if (checkbox.checked) genres += `${checkbox.value},`;
		});
		const rating = document.querySelector("select").value;

		await fetchMovies(rating, genres, year);
		setButtons();
		setEventListeners();
	});

	const pages = document.getElementsByClassName("page");
	// await fetchMovies();
	// setButtons();
	// setEventListeners();
	document.querySelector("form").requestSubmit(document.querySelector("#get button"));
})();

// Randomize array in-place using Durstenfeld shuffle algorithm
function shuffleArray (array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
}
