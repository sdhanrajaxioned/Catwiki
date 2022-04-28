$(document).ready(function () {
  var search_input = $('#search-breed');
  var search_btn = $('#search-btn');
  var list_items = [];

  search_btn.click(function (e) { 
    e.preventDefault();
    showCatInfo();
    location.href = 'cat_breed_details.html'
  });
});