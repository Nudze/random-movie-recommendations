const [ about, get, filter ] = document.querySelectorAll("#nav section");
const filterBtn = document.querySelector("#filter h2");
const nav = document.querySelector("#nav");
const form = document.querySelector("form");
const aboutBtn = document.querySelector("#about h2");
const p = document.querySelector("#about p");

aboutBtn.addEventListener("click", () => {
	get.classList.remove("filter-to-about");
	if (!form.classList.contains("hidden")) {
		p.classList.remove("hidden");
		form.classList.add("hidden");
		get.classList.add("get-when-about");
		get.classList.remove("get-when-filter");
		nav.classList.add("nav-when-about");
		nav.classList.remove("nav-when-filter");
	} else {
		p.classList.toggle("hidden");
		get.classList.remove("filter-to-about");

		get.classList.toggle("get-when-about");
		if (!p.classList.contains("hidden")) {
			nav.classList.add("nav-when-about");
		} else {
			nav.classList.remove("nav-when-about");
		}
	}
});

filterBtn.addEventListener("click", () => {
	if (!p.classList.contains("hidden")) {
		form.classList.remove("hidden");
		p.classList.add("hidden");
		get.classList.remove("get-when-about");
		get.classList.add("filter-to-about");
	} else {
		form.classList.toggle("hidden");

		if (!form.classList.contains("hidden")) {
			get.classList.add("get-when-filter");
		} else {
			get.classList.remove("get-when-filter");
		}
		get.classList.remove("filter-to-about");
	}
	nav.classList.remove("nav-when-about");
	nav.classList.toggle("nav-when-filter");
});
