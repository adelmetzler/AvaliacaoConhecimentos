$(document).ready(function() {
	if(localStorage.getItem("cidade") == null){
		localStorage.setItem("cidade", 'Blumenau');
		localStorage.setItem("estado", 'SC');
	}
	
	var $cidade = $('#cidade')
	var $estado = $('#estado')
	document.getElementById("cidade").value = localStorage.getItem("cidade");
	document.getElementById("estado").value = localStorage.getItem("estado");
	ajax();

}); // fim doc ready

// inicia ajax
function ajax() {

	// variaveis usadas
	var $cidade = $('#cidade')
	var $estado = $('#estado')
	var url2 = "http://developers.agenciaideias.com.br/tempo/json/"
			+ $cidade.val() + "-" + $estado.val();
	var menortemp = 100;
	var dataMenorTemp = 0;
	var maiorTemp = 0;
	var dataMaiorTemp = 0;
	var praia = 0;

	// get ajax
	$
			.ajax({
				type : 'GET',
				url : url2,
				dataType : "json",
				// mostra load image
				beforeSend : function() {
					$('#image').show();
					$('#content').hide();
					$('#header').hide();
				},
				// retira load image
				complete : function() {
					$('#header').show();
					$('#image').hide();
				},
				success : function(data) {

					// set dados do ajax get no html
					for (i = 0; i < 5; i++) {
						$('.cidade' + i).html(data.cidade);
						$('.data' + i).html(data.previsoes[i].data);
						$('.hoje' + i).css('background', 'linear-gradient(rgba(255,255,255,0.3),rgba(255,255,255,0.5)), url(' + data.previsoes[i].imagem + ') top right no-repeat');
						$('.temp-max' + i).html(
								data.previsoes[i].temperatura_max + "°C");
						$('.descricao' + i).html(data.previsoes[i].descricao);
						$('.temp-min' + i).html(
								data.previsoes[i].temperatura_min + "°C");

						// calcula menor temperatura da semana
						if (menortemp > data.previsoes[i].temperatura_min) {
							menortemp = data.previsoes[i].temperatura_min;
							dataMenorTemp = data.previsoes[i].data;
						}
						$('.menortemp').html(
								"A menor temperatura é " + menortemp
										+ "°C, " + dataMenorTemp);

						// calcula maior temperatura da semana
						if (maiorTemp < data.previsoes[i].temperatura_max) {
							maiorTemp = data.previsoes[i].temperatura_max;
							dataMaiorTemp = data.previsoes[i].data;
						}
						$('.maiortemp').html(
								"A maior temperatura é " + maiorTemp
										+ "°C, " + dataMaiorTemp);

						// checa se o tempo estará bom no fim de semana
						var praia = (data.previsoes[i].data).substring(0, 3);
						var tempoBom = (data.previsoes[i].descricao).substring(
								0, 10);
						if ((praia == ('Sáb') | praia == ('Dom'))
								& (data.previsoes[i].temperatura_min + data.previsoes[i].temperatura_max) > 25
								& (tempoBom == ('Ensolarado') | tempoBom == ('Tempo Bom '))) {
							$('.partiuPraia').html(
									"Codições OK! :) ");
							$('.partiuPraia').css(
							'color', 'red');

						} else {
							$('.partiuPraia').html(
									"Condições ÑOK! :( ");
							$('.partiuPraia').css(
									'color', 'blue');
						}

					} // fim do for

					//show contents, tive de mudar pois o char.js dá pau se o campo que ele renderiza estiver escondido
					$('#content').show();
					// dados do gráfico
					var graficoData = {
						labels : [ data.previsoes[0].data,
								data.previsoes[1].data, data.previsoes[2].data,
								data.previsoes[3].data, data.previsoes[4].data ],
						datasets : [
								{
									label : "Maiores temperaturas da semana",
									fillColor : "rgba(255,0,0,0.3)",
									strokeColor : "rgba(255,0,0,1)",
									pointColor : "rgba(255,0,0,1)",
									pointStrokeColor : "#fff",
									pointHighlightFill : "#fff",
									pointHighlightStroke : "rgba(255,220,220,1)",
									data : [ data.previsoes[0].temperatura_max,
											data.previsoes[1].temperatura_max,
											data.previsoes[2].temperatura_max,
											data.previsoes[3].temperatura_max,
											data.previsoes[4].temperatura_max ]
								},
								{
									label : "Menores temperaturas da semana",
									fillColor : "rgba(30,144,255,0.3)",
									strokeColor : "rgba(30,144,255,1)",
									pointColor : "rgba(30,144,255,1)",
									pointStrokeColor : "#fff",
									pointHighlightFill : "#fff",
									pointHighlightStroke : "rgba(151,187,205,1)",
									data : [ data.previsoes[0].temperatura_min,
											data.previsoes[1].temperatura_min,
											data.previsoes[2].temperatura_min,
											data.previsoes[3].temperatura_min,
											data.previsoes[4].temperatura_min ]
								} ]
					};

					// seta opção responsivo
					Chart.defaults.global.responsive = true;

					// inicia grafico html
					var grafico = document.getElementById('grafico').getContext('2d');
					new Chart(grafico).Line(graficoData);

				},
				error : function() {
					alert('Erro com conexão ou cidade inexistente, tente novamente.');
				}
			});

}// fim ajax

// botão de função de pesquisa
$('#botao').click(function() {
	ajax();
});




// botão favoritar
$('#favorito').click(
		function() {
			var $cidade = $('#cidade')
			var $estado = $('#estado')
			// Check browser support
			if (typeof (Storage) !== "undefined") {
				// Store
				localStorage.setItem("cidade", $cidade.val());
				localStorage.setItem("estado", $estado.val());
				// Retrieve
				document.getElementById("cidade").innerHTML = localStorage
						.getItem("cidade");
				document.getElementById("estado").innerHTML = localStorage
						.getItem("estado");
			} else {
				alert("Não é possível salvar");
			}

			ajax(); // faz chamada ajax da cidade marcada como favorito.. não
			// necessário

		});
