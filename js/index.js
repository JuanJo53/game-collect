$(document).ready(function () {
	loadData("");
	function loadData(searchParam) {
		let games = [];
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
								"</h3><div class='card_platforms'><h6>Generos</h6><p class='genres'> - ";
							gameDetails.genres.forEach(genre => {
								htmlCard += genre.name + " - ";
							});
							htmlCard += "<p><h6>Desarrolladores</h6> - ";
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

	$(".custom-option").on("click", function () {
		$(this).parents(".custom-select-wrapper").find("select").val($(this).data("value"));
		$(this).parents(".custom-options").find(".custom-option").removeClass("selection");
		$(this).addClass("selection");
		$(this).parents(".custom-select").removeClass("opened");
		$(this).parents(".custom-select").find(".custom-select-trigger").text($(this).text());

		var value = $(this).data("value");
		loadData(value);
	});

	$("body").delegate(".interactive_card", "click", function () {
		var id = $(this).attr("id");
		console.log(id);
	});
	$("#search").on("click", function () {
		var param = $("#searchParam").val();
		loadData(param);
	});
});
