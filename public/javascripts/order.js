$(function(){
  var cart = JSON.parse($('.hidden-cart').text());
  cart.forEach((item)=>{
    $('table').append(`<tr><td>${item[0]}</td><td>${item[1]}VND</td><td><button class='remove' onclick="remove(['${item[0]}',${item[1]}])">Xóa</button></td></tr>`);
  })
  $('.total span').text(cart.reduce((total,num)=>total+Number(num[1]),0))
  window.remove = function(item) {
    const newCart = cart.filter((i)=>JSON.stringify(i)!==JSON.stringify(item));
    cart = newCart;
    $('.total span').text(cart.reduce((total,num)=>total+Number(num[1]),0));
    if($('.total span').text()==='0') {
      $('.checkout').prop('disabled',true);
    }
  }
  $('.remove').click(function(){
    $(this).parent().parent().remove();
  })
  $('.checkout').click(function(){
    let total = Number($('.total span').text())
    $.post('/checkout',{cart:JSON.stringify(cart),total},function(){
      window.location.replace('/profile');
    })
  })
})
