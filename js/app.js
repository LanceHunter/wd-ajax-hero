(function() {
  'use strict';

  const movies = [];

  const renderMovies = function() {
    $('#listings').empty();

    for (const movie of movies) {
      const $col = $('<div>').addClass('col s6');
      const $card = $('<div>').addClass('card hoverable');
      const $content = $('<div>').addClass('card-content center');
      const $title = $('<h6>').addClass('card-title truncate');

      $title.attr({
        'data-position': 'top',
        'data-tooltip': movie.title
      });

      $title.tooltip({
        delay: 50
      }).text(movie.title);

      const $poster = $('<img>').addClass('poster');

      $poster.attr({
        src: movie.poster,
        alt: `${movie.poster} Poster`
      });

      $content.append($title, $poster);
      $card.append($content);

      const $action = $('<div>').addClass('card-action center');
      const $plot = $('<a>');

      $plot.addClass('waves-effect waves-light btn modal-trigger');
      $plot.attr('href', `#${movie.id}`);
      $plot.text('Plot Synopsis');

      $action.append($plot);
      $card.append($action);

      const $modal = $('<div>').addClass('modal').attr('id', movie.id);
      const $modalContent = $('<div>').addClass('modal-content');
      const $modalHeader = $('<h4>').text(movie.title);
      const $movieYear = $('<h6>').text(`Released in ${movie.year}`);
      const $modalText = $('<p>').text(movie.plot);

      $modalContent.append($modalHeader, $movieYear, $modalText);
      $modal.append($modalContent);

      $col.append($card, $modal);

      $('#listings').append($col);

      $('.modal-trigger').leanModal();
    }
  };

  // ADD YOUR CODE HERE

  let input = $('#search');
  let button = $(':button');

  button.click(function() {
    if (input.val() !== '') {
      while (movies.length > 0) {
        movies.pop();
      }
      console.log(input.val());
      let $xhr = $.getJSON(`https://omdb-api.now.sh/?s=${input.val()}`);

      $xhr.done(function(data) {
        if ($xhr.status !== 200) {
          return;
        }
        for (let i = 0; i < data.Search.length; i++) {
          let movieObj = {};
          movieObj.id = data.Search[i].imdbID;
          movieObj.poster = data.Search[i].Poster;
          movieObj.title = data.Search[i].Title;
          movieObj.year = data.Search[i].Year;
          movies.push(movieObj);
        }

        for (let k = 0; k < movies.length; k++) {
          let $xhr2 = $.getJSON(`https://omdb-api.now.sh/?i=${movies[k].id}`);
          $xhr2.done(function(data2) {
            if ($xhr2.status !== 200) {
              return;
            }
            for (let l = 0; l < movies.length; l++) {
              if (movies[l].id == data2.imdbID) {
                movies[l].plot = data2.Plot;
              }
            }
            renderMovies();
          });
        }
      });
    }
    event.preventDefault();
  });

})();
