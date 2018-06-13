$(function(){
  $.get('/buyhistory',function(data){
    console.log(typeof(data));
    data.reverse().forEach((item,index)=>{
      let time = new Date(item.date);
      $('.item').append(`<p>${time.getHours()}:${time.getMinutes()}:${time.getSeconds()} Ngày ${time.getDate()} Tháng ${time.getMonth()+1} Năm ${time.getFullYear()} </p>`);
      $('.item').append(`<table id='${index}'><tr><th>Mặt hàng</th><th>Giá cả</th></tr></table>`);
      JSON.parse(item.items).forEach((it)=>{
        $(`#${index}`).append(`<tr><td>${it[0]}</td><td>${it[1]}</td></tr>`);
      })
      $('.item').append(`<p>Tổng giá trị: ${item.total}VNĐ</p><hr>`);
    })
  })
})