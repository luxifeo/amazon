let cart = [];
let cost = 0;
$(document).ready(function() {
  $.post('/start',{},function(result) {
    render(result);
    $('#text').html('Những mặt hàng đang có khuyến mại')
  });
  $('#order').click(function() {
    $.post('/order',{cart,cost},function(result) {
      
    })
  })
  
  $('.search').submit(function(event) {
    event.preventDefault();
    var key = $('input').val();
    $.post('/search',{key},(result) => render(result)
    )
  });
  $('.dropbtn').click(() => $('.dropdown .dropdown-content').toggleClass('show'));
})
function renderedItem(item) {
  return '<div class="product-box"><a target="_blank" href=' + item.DetailPageURL
  + '><img src=' + (item.MediumImage?item.MediumImage.URL:"http://webservices.amazon.com/scratchpad/assets/images/amazon-no-image.jpg") 
  + ' width="120" height="160"></a><div class="product-title"><h3>'
  + item.ItemAttributes.Title + '</h3></div><p class="product-price">' 
  + (item.ItemAttributes.ListPrice?item.ItemAttributes.ListPrice.FormattedPrice:"N/A")
  + '<br><a target="_blank" style="color: #337ab7; text-decoration:none;" href='
  + item.Offers.MoreOffersUrl 
  + '> More offers </a></p><div><span class="a-button a-button-primary">' 
  + '<span class="a-button-inner"><img src="http://webservices.amazon.com/scratchpad/assets/images/Amazon-Favicon-64x64.png" class="a-icon a-icon-shop-now"><span class="add a-button-text">Add to Cart</span></span></span></div></div>'
}
function render(result) {
      $('#result').html('');
      result.map((item) => {
        $('#result').append(renderedItem(item));
        $('.add').last().on('click',function(event) {
          let num = Number($('#item').text());
          $('#item').html(num+1);
          $('#itemlist').append(item.ItemAttributes.Title+'<br>');
          cost = Number($('#cost').text());
          $('#cost').text(Number(cost+Number((item.ItemAttributes.ListPrice?item.ItemAttributes.ListPrice.Amount/100:0))).toFixed(2));
          cart.push([item.ItemAttributes.Title,Number((item.ItemAttributes.ListPrice?item.ItemAttributes.ListPrice.Amount/100:0))]);
          cost = Number(cost+Number((item.ItemAttributes.ListPrice?item.ItemAttributes.ListPrice.Amount/100:0))).toFixed(2);
        })
      });

}