window.onload = function() {

		// Bouton Télécharger CV dans section Parcours
		var linkButton = document.createElement('a');
		var text = document.createTextNode('Mon CV');
		linkButton.appendChild(text);
		linkButton.className = 'btn btn-lg';
		linkButton.setAttribute({
			'href': 'https://css-tricks.com/forums/topic/addclass-with-pure-javascript/',
			'role': 'button'
		});
		document.getElementById('parcours').appendChild(linkButton);






};