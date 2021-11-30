$(document).ready(function () {
	loadData("");

	var games = [];
	function loadData(searchParam) {
		games = [];
		$(".game_cards").empty();
		$.ajax({
			url: "https://api.rawg.io/api/games",
			type: "GET",
			data: { key: "84e585c2793c4c798053c96954750353", search: searchParam },
			success: function (response) {
				response.results.forEach(game => {
					let url = "https://api.rawg.io/api/games/" + game.id;
					$.ajax({
						url: url,
						type: "GET",
						data: { key: "84e585c2793c4c798053c96954750353" },
						success: function (gameDetails) {
							games.push(gameDetails);
							var htmlCard =
								"<div class='col-sm-6 col-lg-4 col-md-4 mb-1 mt-1'><a href='#' class='interactive_card' id='" +
								gameDetails.id +
								"''><div class='cards int_card' id='" +
								gameDetails.id +
								"'><div class='card-side front' style='background-image: url(" +
								gameDetails.background_image +
								");'><h4>" +
								gameDetails.name +
								"</h4></div><div class='card-side back'><h3>" +
								gameDetails.name +
								"</h3><div class='card_platforms'><h6>Categories</h6><p class='genres'> - ";
							gameDetails.genres.forEach(genre => {
								htmlCard += genre.name + " - ";
							});
							htmlCard += "<p><h6>Developers</h6> - ";
							gameDetails.developers.forEach(dev => {
								htmlCard += dev.name + " - ";
							});
							htmlCard += "</p></div></div></div></a></div>";
							$(".game_cards").append(htmlCard);
						}
					});
				});
				console.log(games);
			}
		});
	}
	function setModalGameDetails(game) {
		console.log(game);
		$("#modalTitle").text(game.name_original);
		if (game.background_image_additional) {
			$("#modalImg").css("background-image", "url(" + game.background_image_additional + ")");
		} else {
			$("#modalImg").css("background-image", "url(" + game.background_image + ")");
		}
		$(".modalWebBtn").attr("href", game.website);

		if (game.esrb_rating) {
			$("#rating").text(game.esrb_rating.name);
		} else {
			$("#rating").text("Not Registered");
		}

		if (game.rating) {
			$("#puntuation").text(game.rating);
			if (parseFloat(game.rating) < 4.0) {
				$("#puntuation").removeClass("bg-danger");
				$("#puntuation").removeClass("bg-success");
				$("#puntuation").addClass("bg-warning");
			} else if (parseFloat(game.rating) < 3.0) {
				$("#puntuation").removeClass("bg-danger");
				$("#puntuation").removeClass("bg-success");
				$("#puntuation").addClass("bg-warning");
			} else {
				$("#puntuation").removeClass("bg-danger");
				$("#puntuation").removeClass("bg-success");
				$("#puntuation").addClass("bg-success");
			}
		} else {
			$("#puntuation").text("Not Registered");
		}

		if (game.description) {
			$("#modalDesc").empty();
			$("#modalDesc").append(game.description);
		} else {
			$("#modalDesc").append("<p>Not Registered</p>");
		}

		if (game.tags) {
			game.tags.forEach(tag => {
				$("#tags").append("<span class='badge bg-secondary m-1'>" + tag.name + "</span>");
			});
		} else {
			$("#tags").append("<span class='badge bg-secondary m-1'>None</span>");
		}

		if (game.publishers) {
			game.publishers.forEach(publisher => {
				$("#publishers").append(
					"<li class='list-group-item list-group-item-info text-dark fw-bold'>" + publisher.name + "</li>"
				);
			});
		} else {
			$("#publishers").append("<li class='list-group-item list-group-item-info text-dark fw-bold'>None</li>");
		}
	}

	$(".custom-select").each(function () {
		var classes = $(this).attr("class"),
			id = $(this).attr("id"),
			name = $(this).attr("name");
		var template = '<div class="' + classes + '">';
		template += '<span class="custom-select-trigger">' + $(this).attr("placeholder") + "</span>";
		template += '<div class="custom-options">';
		$(this)
			.find("option")
			.each(function () {
				template +=
					'<span class="custom-option ' +
					$(this).attr("class") +
					'" data-value="' +
					$(this).attr("value") +
					'">' +
					$(this).html() +
					"</span>";
			});
		template += "</div></div>";

		$(this).wrap('<div class="custom-select-wrapper"></div>');
		$(this).hide();
		$(this).after(template);
	});
	$(".custom-option:first-of-type").hover(
		function () {
			$(this).parents(".custom-options").addClass("option-hover");
		},
		function () {
			$(this).parents(".custom-options").removeClass("option-hover");
		}
	);
	$(".custom-select-trigger").on("click", function () {
		$("html").one("click", function () {
			$(".custom-select").removeClass("opened");
		});
		$(this).parents(".custom-select").toggleClass("opened");
		event.stopPropagation();
	});

	//Categories search
	$(".custom-option").on("click", function () {
		$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
		$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
		$(this).addClass("selection");
		$(this).parents(".custom-select").removeClass("opened");
		$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

		var value = $(this).data("value");
		loadData(value);
	});

	//On click on a card
	$("body").delegate(".interactive_card", "click", function () {
		var id = $(this).attr("id");
		$("#exampleModal").modal("show");
		const game = games.find(obj => obj.id == id);
		setModalGameDetails(game);
	});

	//Input search
	$("#search").on("click", function () {
		var param = $("#searchParam").val();
		loadData(param);
	});
});
