const games = [
	{
		id: "catan",
		name: "Catan",
		minPlayers: 3,
		maxPlayers: 4,
		duration: "60-90 menit",
		category: "Strategy",
		image: "assets/catan-box.jpg",
		caption: "Catan - edisi dasar",
		description: "Bangun pemukiman, kumpulkan sumber daya, dan jadi penguasa pulau Catan. Salah satu game strategi populer untuk pemula maupun pemain berpengalaman.",
		difficulty: "Menengah",
		communityRating: "4.3 / 5",
		reviews: [
			{ text: "Game gateway terbaik buat yang baru mulai main boardgame strategi.", author: "Rangga, Bandung" },
			{ text: "Selalu jadi pilihan pertama kalau lagi kumpul rame-rame.", author: "Sinta, Bandung" },
		],
	},
	{
		id: "ticket-to-ride",
		name: "Ticket to Ride",
		minPlayers: 2,
		maxPlayers: 5,
		duration: "45-60 menit",
		category: "Strategy",
		image: "assets/ticket-to-ride-box.jpg",
		caption: "Ticket to Ride",
		description: "Bangun jalur kereta antarkota, kumpulkan kartu, dan selesaikan rute sebelum pemain lain.",
		difficulty: "Mudah",
		communityRating: "Belum ada rating",
		reviews: [],
	},
	{
		id: "codenames",
		name: "Codenames",
		minPlayers: 4,
		maxPlayers: 8,
		duration: "15-30 menit",
		category: "Party",
		image: "assets/codenames-box.jpg",
		caption: "Codenames",
		description: "Beri petunjuk satu kata agar tim menemukan agen mereka tanpa memilih kata lawan.",
		difficulty: "Mudah",
		communityRating: "Belum ada rating",
		reviews: [],
	},
	{
		id: "sushi-go",
		name: "Sushi Go!",
		minPlayers: 2,
		maxPlayers: 5,
		duration: "15 menit",
		category: "Family",
		image: "assets/sushi-go-box.png",
		caption: "Sushi Go!",
		description: "Pilih kartu sushi, teruskan sisanya, dan kumpulkan kombinasi hidangan dengan skor tertinggi.",
		difficulty: "Mudah",
		communityRating: "Belum ada rating",
		reviews: [],
	},
	{
		id: "monopoly-deal",
		name: "Monopoly Deal",
		minPlayers: 2,
		maxPlayers: 5,
		duration: "15-30 menit",
		category: "Family",
		image: "assets/monopoly-deal-box.jpg",
		caption: "Monopoly Deal",
		description: "Kumpulkan set properti dan gunakan kartu aksi untuk mengejar kemenangan dalam permainan kartu yang cepat.",
		difficulty: "Mudah",
		communityRating: "Belum ada rating",
		reviews: [],
	},
];

const seedEvents = [
	{
		id: "strategy-night",
		title: "Malam Strategi: Catan & Ticket to Ride",
		description:
			"Yuk kumpul santai main dua game strategi klasik. Cocok buat yang udah pernah main maupun yang baru mau coba, bakal ada yang bantu jelasin aturan main di awal.",
		venue: "kopi-session",
		venueName: "Kopi Session, Dago",
		date: "2026-10-24",
		time: "19:00",
		capacity: 8,
		filled: 4,
		games: ["Catan", "Ticket to Ride"],
		participants: ["Rangga P. (Host)", "Sinta W.", "Fajar A.", "Dewi K."],
	},
	{
		id: "party-game-intro",
		title: "Party Game Santai untuk Pemula",
		description:
			"Sesi ringan untuk kenalan dengan game party. Datang sendiri juga boleh, aturan akan dijelaskan sebelum mulai.",
		venue: "board-brew",
		venueName: "Board & Brew, Buah Batu",
		date: "2026-10-31",
		time: "18:30",
		capacity: 10,
		filled: 4,
		games: ["Codenames", "Sushi Go!"],
		participants: ["Nadia R. (Host)", "Arif S.", "Mira T.", "Bimo K."],
	},
	{
		id: "codenames-marathon",
		title: "Marathon Codenames",
		description:
			"Main beberapa ronde Codenames bersama komunitas. Acara ini sudah penuh.",
		venue: "kopi-session",
		venueName: "Kopi Session, Dago",
		date: "2026-11-07",
		time: "16:00",
		capacity: 12,
		filled: 12,
		games: ["Codenames"],
		participants: ["Komunitas Kumple"],
	},
];

const eventStorageKey = "kumple-events-v1";

function readStorage(key, fallback) {
	try {
		const storedValue = window.localStorage.getItem(key);
		return storedValue ? JSON.parse(storedValue) : fallback;
	} catch {
		return fallback;
	}
}

function writeStorage(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		showMessage("Perubahan hanya tersimpan selama halaman ini terbuka.");
	}
}

function getEvents() {
	const storedEvents = readStorage(eventStorageKey, null);
	return Array.isArray(storedEvents) ? storedEvents : seedEvents;
}

function escapeHtml(value) {
	return String(value).replace(/[&<>"']/g, (character) => {
		const entities = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#39;",
		};
		return entities[character];
	});
}

function formatEventDate(date, time) {
	const eventDate = new Date(`${date}T${time}`);
	const dateText = new Intl.DateTimeFormat("id-ID", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
	}).format(eventDate);
	return `${dateText}, ${time.replace(":", ".")}`;
}

function formatPlayerRange(game) {
	return game.minPlayers === game.maxPlayers
		? `${game.minPlayers} pemain`
		: `${game.minPlayers}-${game.maxPlayers} pemain`;
}

function filterGames(searchText, playerRange, category) {
	const normalizedSearch = searchText.trim().toLowerCase();

	return games.filter((game) => {
		const matchesName = game.name.toLowerCase().includes(normalizedSearch);
		const matchesCategory = !category || game.category.toLowerCase() === category;
		let matchesPlayers = true;

		if (playerRange === "2") {
			matchesPlayers = game.minPlayers <= 2 && game.maxPlayers >= 2;
		} else if (playerRange === "3-4") {
			matchesPlayers = game.minPlayers <= 4 && game.maxPlayers >= 3;
		} else if (playerRange === "5+") {
			matchesPlayers = game.maxPlayers >= 5;
		}

		return matchesName && matchesCategory && matchesPlayers;
	});
}

function renderGames(gameList) {
	const gameListElement = document.querySelector(".game-list");
	if (!gameListElement) return;

	if (gameList.length === 0) {
		gameListElement.innerHTML =
			'<p class="empty-state">Game tidak ditemukan. Coba ubah kata kunci atau filter.</p>';
		return;
	}

	gameListElement.innerHTML = gameList
		.map(
			(game) => `
				<article class="game-card ${escapeHtml(game.category.toLowerCase())}">
					<figure class="game-image">
						<span class="game-tile tile-${game.maxPlayers}" title="Maksimal ${game.maxPlayers} pemain" aria-hidden="true"></span>
						<img src="${escapeHtml(game.image)}" alt="Kotak game ${escapeHtml(game.name)}" />
					</figure>
					<h2 class="game-title"><a href="game-detail.html?id=${encodeURIComponent(game.id)}" class="game-link">${escapeHtml(game.name)}</a></h2>
					<p class="game-info">${formatPlayerRange(game)} | ${escapeHtml(game.duration)} | <span class="game-tag">${escapeHtml(game.category)}</span></p>
				</article>
			`,
		)
		.join("");
}

function filterEvents(venue, date) {
	return getEvents()
		.filter((event) => (!venue || event.venue === venue) && (!date || event.date === date))
		.sort((first, second) => `${first.date}${first.time}`.localeCompare(`${second.date}${second.time}`));
}

function renderEvents(eventList) {
	const eventListElement = document.querySelector(".event-list");
	if (!eventListElement) return;

	if (eventList.length === 0) {
		eventListElement.innerHTML =
			'<p class="empty-state">Belum ada event yang cocok. Coba tanggal atau venue lain.</p>';
		return;
	}

	eventListElement.innerHTML = eventList
		.map((event) => {
			const remaining = Math.max(event.capacity - event.filled, 0);
			const filledPercentage = Math.min((event.filled / event.capacity) * 100, 100);
			const fullClass = remaining === 0 ? "event-full" : "";
			const tile = remaining > 0
				? `<span class="game-tile tile-${Math.min(remaining, 8)}" title="${remaining} slot tersisa" aria-hidden="true"></span>`
				: "";

			return `
				<article class="event-card ${fullClass}">
					${tile}
					<h2 class="event-title"><a href="event-detail.html?id=${encodeURIComponent(event.id)}" class="event-link">${escapeHtml(event.title)}</a></h2>
					<p class="event-venue">${escapeHtml(event.venueName)}</p>
					<p class="event-time"><time datetime="${escapeHtml(event.date)}T${escapeHtml(event.time)}">${escapeHtml(formatEventDate(event.date, event.time))}</time></p>
					<p class="event-slots">${remaining === 0 ? "Penuh - " : ""}${event.filled} dari ${event.capacity} slot terisi</p>
					<span class="slot-bar" style="--filled: ${filledPercentage}%"></span>
					<p class="event-game-list">Game: ${escapeHtml(event.games.join(", "))}</p>
				</article>
			`;
		})
		.join("");
}

function renderHomeEventPreview() {
	const eventSection = document.querySelector(".events");
	const seeAllLink = eventSection?.querySelector(".see-all");
	if (!eventSection || !seeAllLink) return;

	const previewEvents = filterEvents("", "").slice(0, 2);
	const previewMarkup = previewEvents
		.map(
			(event) => `
				<article class="event-card">
					<h3 class="event-title"><a href="event-detail.html?id=${encodeURIComponent(event.id)}" class="event-link">${escapeHtml(event.title)}</a></h3>
					<p>${escapeHtml(event.venueName)} - <time datetime="${escapeHtml(event.date)}T${escapeHtml(event.time)}">${escapeHtml(formatEventDate(event.date, event.time))}</time></p>
				</article>
			`,
		)
		.join("");
	seeAllLink.insertAdjacentHTML("beforebegin", previewMarkup);
}

function showMessage(message, selector = ".interaction-message") {
	if (typeof window.$ !== "function") return;
	const messageElement = $(selector);
	if (!messageElement.length) return;

	messageElement.stop(true, true).text(message).slideDown(180);
}

function setUpGameFilters() {
	const filterForm = document.querySelector("#game-filter");
	if (!filterForm) return;

	const refreshGames = () => {
		const filteredGames = filterGames(
			document.querySelector("#search").value,
			document.querySelector("#players").value,
			document.querySelector("#category").value,
		);
		renderGames(filteredGames);
		showMessage(`${filteredGames.length} game ditemukan.`, "#game-filter-message");
	};

	renderGames(games);
	$(filterForm).on("submit", (event) => {
		event.preventDefault();
		refreshGames();
	});
}

function setUpEventFilters() {
	const filterForm = document.querySelector("#event-filter");
	if (!filterForm) return;

	const refreshEvents = () => {
		const filteredEvents = filterEvents(
			document.querySelector("#venue").value,
			document.querySelector("#tanggal").value,
		);
		renderEvents(filteredEvents);
		showMessage(`${filteredEvents.length} event ditemukan.`, "#event-filter-message");
	};

	renderEvents(filterEvents("", ""));
	$(filterForm).on("submit", (event) => {
		event.preventDefault();
		refreshEvents();
	});
}

function setUpEventForm() {
	const eventForm = document.querySelector("#create-event-form");
	if (!eventForm) return;

	$(eventForm).on("submit", (event) => {
		event.preventDefault();
		const title = document.querySelector("#nama-event").value.trim();
		const venue = document.querySelector("#venue").value;
		const date = document.querySelector("#tanggal").value;
		const time = document.querySelector("#waktu").value;
		const capacity = Number(document.querySelector("#slot").value);
		const selectedGames = Array.from(
			eventForm.querySelectorAll('input[name="game"]:checked'),
		).map((input) => input.nextElementSibling.textContent.trim());
		const venueNames = {
			"kopi-session": "Kopi Session, Dago",
			"board-brew": "Board & Brew, Buah Batu",
		};

		if (!title || !venue || !date || !time || !capacity || selectedGames.length === 0) {
			showMessage("Lengkapi nama, venue, tanggal, waktu, slot, dan pilih minimal satu game.", "#create-event-message");
			return;
		}

		if (capacity < 2 || capacity > 30) {
			showMessage("Jumlah slot harus antara 2 dan 30 peserta.", "#create-event-message");
			return;
		}

		if (date < new Date().toISOString().slice(0, 10)) {
			showMessage("Pilih tanggal hari ini atau setelahnya.", "#create-event-message");
			return;
		}

		const eventData = {
			id: `event-${Date.now()}`,
			title,
			description: document.querySelector("#deskripsi").value.trim() || "Detail acara akan dibagikan oleh host.",
			venue,
			venueName: venueNames[venue],
			date,
			time,
			capacity,
			filled: 1,
			games: selectedGames,
			participants: ["Kamu (Host)"],
		};
		const events = getEvents();
		events.push(eventData);
		writeStorage(eventStorageKey, events);
		showMessage("Event berhasil dibuat. Membuka daftar event...", "#create-event-message");
		window.setTimeout(() => {
			window.location.href = "events.html";
		}, 700);
	});
}

function renderEventDetail() {
	const titleElement = document.querySelector("#event-detail-title");
	if (!titleElement) return;

	const eventId = new URLSearchParams(window.location.search).get("id");
	const event = getEvents().find((item) => item.id === eventId) || getEvents()[0];
	if (!event) return;

	titleElement.textContent = event.title;
	document.querySelector("#event-detail-description").textContent = event.description;
	document.querySelector("#event-detail-venue").textContent = event.venueName;
	const timeElement = document.querySelector("#event-detail-time");
	timeElement.dateTime = `${event.date}T${event.time}`;
	timeElement.textContent = formatEventDate(event.date, event.time);
	const remainingSlots = Math.max(event.capacity - event.filled, 0);
	document.querySelector("#event-detail-slots").textContent = `${remainingSlots} dari ${event.capacity} slot tersisa`;
	const slotBar = document.querySelector("#event-detail-slots").nextElementSibling;
	slotBar.style.setProperty("--filled", `${Math.min((event.filled / event.capacity) * 100, 100)}%`);
	const detailTile = document.querySelector(".detail-card > .game-tile");
	if (detailTile) {
		detailTile.className = `game-tile tile-${Math.min(remainingSlots, 8)}`;
		detailTile.title = `${remainingSlots} slot tersisa`;
		detailTile.hidden = remainingSlots === 0;
	}
	document.querySelector("#event-detail-games").innerHTML = event.games
		.map((gameName) => {
			const game = games.find((item) => item.name === gameName);
			const gameUrl = game ? `game-detail.html?id=${encodeURIComponent(game.id)}` : "games.html";
			return `<li><a href="${gameUrl}" class="game-chip">${escapeHtml(gameName)}</a></li>`;
		})
		.join("");
	document.querySelector("#event-detail-players").innerHTML = event.participants
		.map((participant) => `<li class="player">${escapeHtml(participant)}</li>`)
		.join("");

	const joinButton = document.querySelector(".join-event-button");
	joinButton.dataset.eventId = event.id;
	joinButton.disabled = event.filled >= event.capacity;
	joinButton.textContent = event.filled >= event.capacity ? "Event Penuh" : "Gabung Event Ini";
}

function setUpJoinEvent() {
	$(document).on("click", ".join-event-button", function () {
		const eventId = this.dataset.eventId;
		const events = getEvents();
		const event = events.find((item) => item.id === eventId);
		if (!event || event.filled >= event.capacity) {
			showMessage("Maaf, semua slot event ini sudah terisi.", "#join-event-message");
			return;
		}

		if (event.participants.includes("Kamu")) {
			showMessage("Kamu sudah terdaftar di event ini.", "#join-event-message");
			return;
		}

		event.filled += 1;
		event.participants.push("Kamu");
		writeStorage(eventStorageKey, events);
		renderEventDetail();
		showMessage("Kamu berhasil bergabung. Sampai ketemu di meja permainan!", "#join-event-message");
	});
}

function renderGameDetail() {
	const gameCard = document.querySelector("#game-detail-card");
	if (!gameCard) return;

	const gameId = new URLSearchParams(window.location.search).get("id") || "catan";
	const game = games.find((item) => item.id === gameId);
	const notFoundMessage = document.querySelector("#game-detail-not-found");
	const reviewSection = document.querySelector(".reviews");

	if (!game) {
		gameCard.style.display = "none";
		notFoundMessage.hidden = false;
		reviewSection.hidden = true;
		return;
	}

	gameCard.style.display = "";
	notFoundMessage.hidden = true;
	reviewSection.hidden = false;
	document.title = `${game.name} | Detail Game | Kumple`;
	document.querySelector("#game-detail-image").src = game.image;
	document.querySelector("#game-detail-image").alt = `Kotak game ${game.name}`;
	document.querySelector("#game-detail-caption").textContent = game.caption;
	document.querySelector("#game-detail-title").textContent = game.name;
	document.querySelector("#game-detail-description").textContent = game.description;
	document.querySelector("#game-detail-players").textContent = formatPlayerRange(game);
	document.querySelector("#game-detail-duration").textContent = game.duration;
	document.querySelector("#game-detail-category").textContent = game.category;
	document.querySelector("#game-detail-difficulty").textContent = game.difficulty;
	document.querySelector("#game-detail-rating").textContent = game.communityRating;
	document.querySelector("#game-detail-tile").className = `game-tile tile-${game.maxPlayers}`;
	document.querySelector("#game-detail-tile").title = `Maksimal ${game.maxPlayers} pemain`;
	document.querySelector("#game-review-list").innerHTML = game.reviews.length
		? game.reviews.map((review) => `
			<article class="review-card">
				<p class="review-text">"${escapeHtml(review.text)}"</p>
				<p class="review-author">- ${escapeHtml(review.author)}</p>
			</article>
		`).join("")
		: '<p class="empty-state">Belum ada ulasan untuk game ini.</p>';
}

$(function () {
	renderHomeEventPreview();
	setUpGameFilters();
	setUpEventFilters();
	setUpEventForm();
	renderEventDetail();
	renderGameDetail();
	setUpJoinEvent();
});
