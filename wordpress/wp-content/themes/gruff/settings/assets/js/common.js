(function($){
    //show message
    show_message = (response) => {
    	console.log(response.message);
    	switch(response.status){
    		case true:
    			setTimeout(() => {
    				window.location.href = response.redirectUrl;
    			},5)
    			break;
    		case false:
    			break;
    	}
    }

    //Show the alert
    show_alert = (e) => {
    	$(e).next('.alert').slideDown();
    }

    //Hide the alert
    hide_alert = (e) => {
        $(e).parents('.alert').slideUp();
    }
    
})(jQuery)