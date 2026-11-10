(function($){
	$(document).ready(function(){
		let post_id = $('#post_id').val();
		if($('#post_id').length){
			setTimeout(() => {
				load_saved_sections(post_id);
			},500)
		}	
		//Show available Section
			$('#projects-builder').on('click','.add-section', function(){
				load_sections({
					type:[0,1]
				});
			})
		//Show available Section

		//Hide the sections
	        $('.available-sections').on('click', '.hide-sections', function(){
	            hide_sections_modal($(this));
	        })
	    //Hide the sections

	    //Show the section form
	        $('.available-sections').on('click', '.sections > ul > li', function(){
	            //Display the form for the section
	            load_section_form($(this));
	            $(this).parents('.available-sections').find('.hide-sections').trigger('click');
	        })

	         $('.page-sections').on('click', '.edit-section', function(){
	            //Display the form for the section
	            load_section_form($(this));
	            $(this).parents('.available-sections').find('.hide-sections').trigger('click');
	        })
	    //Show the section form

	});
	
})(jQuery)