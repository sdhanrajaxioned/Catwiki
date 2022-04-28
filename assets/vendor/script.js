$(document).ready(function () {
  var search_input = $('#search-breed');
  var search_btn = $('#search-btn');
  var list_items = [];

  //on search button click page redirects to cat breed details page and cat breed info is displayed.
  search_btn.click(function (e) { 
    e.preventDefault();
    getCatInfo();
    location.href = 'cat_breed_details.html'
  });
 
  //function to get cat breed details data from cat api and stores it in local storage and then calls getImages 
  function getCatInfo() {
    $.ajax({
      type: 'GET',
      url: 'https://api.thecatapi.com/v1/breeds/search?q='+search_input.val(),
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        var breed_info = JSON.stringify(response);
        localStorage.setItem('breed_details', breed_info);
        var search_input_value = search_input.val().substring(0,4);
        getImages(search_input_value);
      }
    });
  }

  //function to get cat breed images data and stores it in local storage
  function getImages(search_input_value) {
    $.ajax({  
      type: 'GET',
      url: `https://api.thecatapi.com/v1/images/search?breed_id=${search_input_value}&limit=8`,
      headers: {'x-api-key' : 'c01bb41e-223c-4c42-8d3f-32776d4d64a9'},
      data: 'JSON',
      success: function(response) {
        var image_response = JSON.stringify(response);
        localStorage.setItem('imageResponse',image_response);
      }
    });
  }

});