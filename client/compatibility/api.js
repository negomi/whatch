// Handles all interaction with the external OMDb API.
var api = {

  // Search the OMDbAPI for a movie title.
  search: function(title) {
    $.ajax({
      url: 'http://www.omdbapi.com/?s=' + title,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        if ('undefined' !== typeof data.Search) {
          Session.set('loading', false);
          Session.set('searchResults', data.Search);
        }
      },
      error: function(jqXHR, textStatus, errorThrown) {
        Session.set('loading', false);
        console.error(errorThrown.message);
      }
    });
  },

  // Fetch a movie's details based on its IMDbID.
  fetch: function(imdbId) {
    // TODO: if in DB, retrieve from there
    $.ajax({
      url: 'http://www.omdbapi.com/?i=' + imdbId,
      dataType: 'json',
      success: function(data, textStatus, jqXHR) {
        modal.show(data);
      },
      error: function(jqXHR, textStatus, errorThrown) {
        console.error(errorThrown.message);
      }
    });
  }
};
