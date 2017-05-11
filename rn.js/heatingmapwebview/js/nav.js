$(function () {

    var up = $('.up');
    var onOff=true;
    var upNav = $('.upNav');
    var content;
    $(".up").click(function(){
    	if(onOff==true){
           upNav.css({
                top: "0px",
                transition: "top 1s"
            });
            onOff=false;
    	}else{
        	hideNav();
    	}
    	
    });
    $('span').each(function () {
        var dom = $(this);
        dom.on('click', function () {
            hideNav();
            content=dom.text();
            $(".up").text(content);
        });
    });
    function hideNav() {
        upNav.css({
            top: "-30.5%",
            transition: "top .1s"
        });
        onOff=true;
    }
});