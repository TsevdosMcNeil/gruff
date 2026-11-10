(function($){
	var max_fields          = 50;
	var x                   = 1;
	var rules 				= {
		image:{
			width:'',
			height:''
		},
		required:false
	};
	$(document).ready(function(){
		var wrapper             = $("#wrapper_elem");
		var add_button          = $("#add_more");
		var remove              = $('.remove_fields');
		let tags = '';
		jQuery.ajax({
	        url: gruff_section_builder.ajax_url,
	        type:'GET',
	        data: {
	        	'action' : 'gruff_get_tags'
	        },
	        dataType: "json",
	        success:function(response) {
	        	//console.log(response);
	        	if(response.length){
	        		response.map((item,key) => {
	        			tags+=`<option value="${item.id}">${item.name}</option>`;
	        		})
	        		//Generate the repeater
			            var html = `<div class="repeat_elem" id="repeat_elem">
			                            <div class="addFieldItems cell-10">
			                                <h4>(content|0)</h4>
			                                <div class="tag-selection">
				                                <select class="addinput" name="tag_id[]" >
				                                    <option value="">Please Select</option>
				                                    ${tags}
				                                </select>
			                                </div>
			                                <div class="validation-fields" style="display:none">
			                                 	<div class="image-rules" style="display:none">
			                                 		<input type="number" maxlength="4" name="width[]" class="addinput" placeholder="Enter the width">
			                                 		<input type="number" maxlength="4" name="height[]" class="addinput" placeholder="Enter the height">
			                                 	</div>
			                                 	<div class="common-rules" style="display:none">
			                                 		<label>Manadatory Field</label>
			                                 		<input type="checkbox" name="required[]" />
			                                 	</div>
			                                </diV>
			                            </div> 
			                            <input type="hidden" name="sections_tags_id[]" />   
			                        </div>`;
			                $('#wrapper_elem').html(html);
			                x = 1;
			        //Generate the repeater
	        	}
	        },
	        error: function(xhr){
	        	console.log(xhr.responseText);
	        }
	    });

	    //Set Validation 
	    	$('#addFrm').on('change','select[name="tag_id[]"]', function(){
	    		let type_id 	= $(this).val();
	    		let elem_set 	= $(this).parents('.repeat_elem');
	    		switch(Number(type_id)){
	    			case 3:
	    				show_validation_fields({type:1,elem_set}); //type => 1 : Image, 2 : Others
	    				break;
	    			default:
	    				hide_validation_fields({elem_set});
	    				break;	
	    		}
	    	})
	    //Set Validation

		//Sortable functionality
			if($('#sortable').length){
				$('#sortable').on('click','.section-controls',function(){
					$(this).parents('.single-section').find('.section-container').toggle();
					$(this).toggleClass("is-collapsed");
				})

				$( "#sortable" ).sortable({
					update: function( event, ui ) {
						let elems = document.querySelectorAll('.single-section');
						let post_id = $('#post_id').val();
						let arr   = {
							post_id,
							id:[]
						};
						Array.from(elems).forEach((elem,key) => {
							//console.log(elem);
							let id 			= $(elem).attr('data-id');
							let sequence 	= $(elem).attr('data-sequence');
							arr['id'].push(id);
						})
						$.ajax({
				            type: 'POST',
				            url:gruff_section_builder.ajax_url,
				            dataType: 'json',
				            data: {
				                arr,
				                action:'gruff_update_sequence'
				            },
				            success: function(response){
				            	load_saved_sections(post_id)
				                $('#loader').hide();
				            },
				            error:function(xhr){
				                $('#loader').hide();
				                console.log(xhr.responseText);
				            }
				        })
					}
				});
			}
		//Sortable functionality

    	//Add functionality
            add_button.click(function(e){
                e.preventDefault();
                var y               = parseInt(x)+1;
                var clone           = $('body').find('#repeat_elem').clone()
                                    .find('input,select').val('')
                                    .removeAttr('id')
                                    .end();
                clone.find('select').attr('name','tag_id[]');                    
                clone.find('h4').html(`(content|${x})`);
                hide_validation_fields({elem_set:clone});
                if(x < max_fields){
                    x++;
                    $(wrapper).append(clone.append('<div class="removItemArea"><a class="link outline-link link-red remove_fields">REMOVE</a></div>'));
                }
                if(x == max_fields)
                    add_button.hide();
            });
        //Add functionality

        //Remove functionality
            $('body').on("click",".remove_fields", function(e){
                $(this).parent('div').parent('div.repeat_elem').remove();
                x--;
                if(x < max_fields)
                    add_button.show();
            })
        //Remove functionality

        // ADD AND UPDATE FUCTIONALITY //
	        $('#addFrm').validate({
	            ignore: [],
	            errorElement: "i",
	            errorClass: "msg-error error-dp-cls",
	            rules:{
	                section_name:{
	                    required:true,
	                },
	                "tag_id[]":{
	                    required:true
	                },
	                section_html:{
	                    required:function() 
	                    {
	                     CKEDITOR.instances.section_html.updateElement();
	                    }
	                },
	                sequence:{
	                    digits: true
	                },
	                icon:{
	                }
	            },
	            messages:{
	                section_name:{
	                    required:"Please enter a section name",
	                },
	                "tag_id[]":{
	                    required:"Please select a field"
	                },
	                section_html:{
	                    required:"Please enter the html"
	                },
	                sequence:{
	                    digits: "Please enter a valid sequence"
	                },
	                icon:{
	                    required: "Please upload a file"
	                }
	            },
	            submitHandler: function(form) {
	                $('#submit_button').prop('disabled', true);
	                $('#submit_button').val('Please Wait');
	                var id      = $('#id').val();
	                var data    = new FormData(form);
					data.append('action', 'gruff_section_builder_submission');
	                $.ajax({
			            type: 'POST',
			            url:gruff_section_builder.ajax_url,
			            data: data,
			            cache: false,
			            contentType: false,
			            processData: false,      
			            dataType:'json',           
			            success: function(response) {
			                $('#submit_button').prop('disabled', false);
			                $('#submit_button').val('SAVE');
			                show_message(response);
			            },
			            error: function(xhr){
	        				console.log(xhr.responseText);
			            }
			        });
	                
	            }
	        });
	    // ADD AND UPDATE FUCTIONALITY //

	    //Ajax section save
	        $('.section-form').on('click','.save_section',function(){
	            $('#loader').show();
                let section_id 	= $(this).parents('.editFormElemWrapper').attr('id');
                let sequence 	= $(this).parents('.editFormElemWrapper').find('input[name="sequence[]"]').val();
                let post_id 	= $('#post_id').val();
                let post_type 	= $('#post_type').val();
                
                let data = {
                	action:'gruff_save_section',
                	post_id,
                    section_id,
                    sequence,
                    content:[],
                    post_type
                };

                Array.from($(this).parents('.section-form').find('select, input.addinput')).forEach(function(elem){
                    let fieldname   = $(elem).attr('name');
                    let val         = $(elem).val();
                    data['content'].push({ [fieldname]: val });   
                });
                

                //CKEditor values to data object
                    $(this).parents('.section-form').find('.editable').each(function(){
                        let fieldname   = $(this).attr('name');
                        data['content'].push({ [fieldname]: CKEDITOR.instances[fieldname].getData()});
                    })
                //CKEditor values to data object

                 data['content'] = data['content'].reduce(function(result, currentObject) {
                    for(var key in currentObject) {
                        if (currentObject.hasOwnProperty(key)) {
                            result[key] = currentObject[key];
                        }
                    }
                    return result;
                }, {});  


                $.ajax({
                    type: 'POST',
                    url:gruff_section_builder.ajax_url,
                    data:data,
                    success: function(obj) {
                    	load_saved_sections(post_id);
                        show_message(obj);
                        $('#loader').hide();
                    },
                    error: function(xhr){
                        $('#loader').hide();
                        console.log(xhr.responseText);
                    }
                });
	        })
	    //Ajax section save 

	    //Delete a section from post
	    	$('.page-sections').on('click','.delete-section', function(){
	    		let post_id = $('#post_id').val();
            	let data = {
	                post_id,
	                section_id: $(this).attr('data-section_id'),
	                sequence: $(this).attr('data-sequence'),
                	action:'gruff_remove_section',
	            };

	            $.ajax({
	                type: 'POST',
                    url:gruff_section_builder.ajax_url,
	                data:data,
	                success: function(obj) {
                        load_saved_sections(post_id);
                        show_message(obj);
	                    $('#loader').hide();
	                },
	                error: function(xhr){
	                    $('#loader').hide();
	                    console.log(xhr.responseText);
	                }
	            });
	        })
	    //Delete a section from post

	    //Hide the form
	        $('.section-form').on('click','.btnFormClose',function(){
	            let wrapper = $('.section-form');
	            $('body').removeClass('LBOpen');
	            wrapper.attr('class','section-form').html('');
	        })
	    //Hide the form

	})

	//Load the available sections 
	    load_sections = (param) => {
	    	$('#loader').show();
	        let wrapper = $('.available-sections');
	        param.action = 'available_sections';
	        $.ajax({
	            type: 'POST',
	    		url:gruff_section_builder.ajax_url,
	            data:param, 
	            dataType:'json',
	            success: function(response) {
	                $('#loader').hide();
	                let {data,status} = response;
	                let output = '';
	                //Display all sections
	                    if(status){
	                        output += `<ul>`;
	                        data.map((section, index) => {
	                            let icon = section.icon && section.icon != null ? `<figure>${section.icon_img}</figure>` : ``;
								output += `<li data-section_id="${section.id}">
												${icon}
	                                            <span class="section_name">${section.section_name}</span>
	                                        </li>`;
	                        })
	                        output += `</ul>`;
	                        $('body').addClass('LBOpen');
	                    }else{
	                        output = `<h4>No section(s) available!</h4>`;
	                    }
	                    wrapper.attr('class','available-sections open').show().find('.sections').html(output);
	                //Display all sections

	            },
	            error: function(xhr){
	                $('#loader').hide();
	                console.log(xhr.responseText);
	            }
	        });
	    }
	//Load the available sections 

    //Hide Sections moddal
	    hide_sections_modal = (elem) => {
	        $('body').removeClass('LBOpen');
	        elem.parents('.available-sections').removeClass('open').hide().find('.sections').html('');
	    }
    //Hide Sections moddal

    //Load the form 
	    load_section_form = (elem) => {
	        $('#loader').show();
	        let wrapper     = $('.section-form');
	        let section_id  = elem.attr('data-section_id');
	        let _sequence    = elem.attr('data-sequence') == undefined || elem.attr('data-sequence') == null ? $('#sequence').val() : elem.attr('data-sequence');
	        let post_id     = $('#post_id').val();
	        //console.log(sequence);
	        $.ajax({
	            type: 'POST',
	            url:gruff_section_builder.ajax_url,
	            data:{
	                id:section_id,
	                post_id:post_id,
	                sequence:_sequence,
	                action:'gruff_load_the_form'
	            }, 
	            dataType:'json',
	            success: function(response) {
	                $('#loader').hide();
	                let {form,data,sequence,formTags} = response;
	                let rules_arr = [];
	                $('body').addClass('LBOpen');
	                
	                wrapper.attr('class','section-form open').show().html(form);

	                wrapper.find('.editable').each(function(){
	                    load_editor($(this));
	                })
	                formTags.map(function(set,index){
	                	if(set.tag_id == 3){
	                		rules_arr.push($.parseJSON(set.rules));
	                	}
	                })
	                dropzone_fn(wrapper,rules_arr);
	                show_form_data(data, sequence);
	            },
	            error: function(xhr){
	                $('#loader').hide();
	                console.log(xhr.responseText);
	            }
	        });
	    }
    //Load the form 

    //Load the form data
	    function show_form_data(data,_sequence){
	        sequence = _sequence;
	        $('.section-form').find('input[name="sequence[]"]').val(_sequence);
	        //console.log(data);
	        Object.keys(data).map((seq) => {
	            $('.section-form').find('.editFormElemWrapper').find('input[name="sequence[]"]').val(seq);
	            sequence = seq;
	            Object.keys(data[seq])
	            .map((item) => {
	                $('.section-form').find('.editFormElemWrapper').find('input[type="text"][name="'+item+'"]').val(data[seq][item]);
	                $('.section-form').find('.editFormElemWrapper').find('select[name="'+item+'"]').val(data[seq][item]);
	                $('.section-form').find('.editFormElemWrapper').find('input[type="hidden"][name="'+item+'"]').val(data[seq][item]);
                	$('.section-form').find('.editFormElemWrapper').find('input[placeholder="URL"][name="'+item+'"]').val(data[seq][item]);

	                Array.from($('.section-form').find('.editFormElemWrapper').find('.dropzone.dz-clickable')).forEach((field) => {
		                let imgname = $(field).next('input[type="hidden"]').val();
		                let imgpath = `${IMAGE_PATH}${imgname}`;
		                $(field).find('img').attr('src', imgpath);
		            })

		            Array.from($('.section-form').find('.editFormElemWrapper').find('textarea')).forEach((field) => {
		                let _fieldname       = $(field).attr('name');
		                console.log(_fieldname,data[seq]);
		                CKEDITOR.instances[_fieldname].setData(data[seq][_fieldname]);
		            })

	            })	            
	        })
	    }
	//Load the from data

	//Load saved data
	    load_saved_sections = (post_id = null) => {
	        $.ajax({
	            type: 'POST',
	            url:gruff_section_builder.ajax_url,
	            dataType: 'json',
	            data: {
	                post_id:post_id,
	                action:'gruff_load_saved_sections'
	            },
	            success: function(response){
                    $('.section-form').find('.btnFormClose').trigger('click');
	                let wrapper = $('.page-sections');
	                $('#loader').hide();
	                let {sections_arr,page_data,sequence} = response;
	                let output = '';
	                $('#sequence').val(sequence);
	                //Display all sections
	                    if(sections_arr.length){
	                        output += page_data;
	                        wrapper.show().html(output);
	                        //console.log(output);
	                    }
	                //Display all sections
	                
	                Array.from(wrapper.find('img')).forEach((item) => {
	                    let imgname = $(item).attr('data-src');
	                    let imgpath = `${IMAGE_PATH}${imgname}`;
	                    $(item).attr('src',imgpath);
	                })    
	            },
	            error:function(xhr){
	                $('#loader').hide();
	                console.log(xhr.responseText);
	            }
	        })
	    }
    //Load saved data

	//Initialize CKEditor
	    function load_editor(elem){
	        var fieldname = elem.attr('name');
	        //console.log(fieldname);
	        CKEDITOR.config.basicstyles = [
	          ['Bold', 'Italic', 'Underline']
	        ];
	        var editor = CKEDITOR.instances[fieldname];

	        if (editor)
	        {
	            editor.destroy(true);
	            editor = null;
	            var editor = CKEDITOR.instances[fieldname];
	        }
	        CKEDITOR.replace(fieldname,{
	            toolbarGroups: [
	                {"name":"basicstyles","groups":["basicstyles"]},
	                {"name":"document","groups":["mode"]},
	            ],
	            removeButtons: 'Strike,Subscript,Superscript,Anchor,Styles,Specialchar'

	        });
			CKEDITOR.config.allowedContent = true;
	    }
	//Initialize CKEditor

	//Initializing the dropzone
	    function dropzone_fn(elem = null,rules_arr){
	    	elem.find("div.dropzone").dropzone({
	            url: gruff_section_builder.ajax_url,
	            autoProcessQueue: true,
	            uploadMultiple: true,
	            addRemoveLinks:true,
	            parallelUploads: 1,
	            maxFiles: 1,
	            maxFilesize: 1,
	            acceptedFiles: ".jpeg,.jpg,.png,.gif",
	            init: function() {
	                var myDropzone 	= this;
	                let all_dzones 	= $('div.dropzone'),
	                	current  	= all_dzones.filter($(myDropzone.element)),
	                	index		= all_dzones.index(current);

	                //console.log(rules_arr);
	                let maxImageWidth 	= rules_arr[index] === null ? 10 : rules_arr[index].width,
	                	maxImageHeight 	= rules_arr[index] === null ? 10 : rules_arr[index].height;

	                current.find('.dz-message').find('p').after(`<p>Image Dimension ${maxImageWidth}px X ${maxImageHeight}px</p>`);

	                this.on("addedfile", function(file) { 
	                  $(this.element.children[0]).hide();
	                });
	                this.on("sending", function(file, xhr, formData) {
	                  //var row_id = this.element.attributes['id'].value;
	                  formData.append('action',"gruff_builder_image"); 
	                });
	                this.on("success", function(files, response) {
	                    if(response)
	                        $(this.element).siblings('input[type="hidden"].dz-img').val(response);  
	                });
	                this.on("error", function(files, response) {
	                    if (response.code == 500 || response.code == undefined && response != 'Image width or height too small.' && response != 'You can not upload any more files.'){
	                        $(files.previewElement).find('.dz-error-message').text("Some error occured, please try again!");
	                    }else{
	                        $(files.previewElement).find('.dz-error-message').text(response);
	                    }
	                });
	                this.on("removedfile", function(file) {
	                  $(this.element.children[0]).show();
	                  $(this.element).siblings('input[type="hidden"].dz-img').val('noimg.png');  
	                });
	                this.on("thumbnail", function(file) {
	                    if (file.rejectDimensions !== undefined || file.acceptDimensions !== undefined) {
	                        if (file.width != maxImageWidth || file.height != maxImageHeight) {
	                            file.rejectDimensions()
	                        }
	                        else {
	                            file.acceptDimensions();
	                        }
	                    }    
	                });
	            },
	            accept: function(file, done) {
	                file.acceptDimensions = done;
	                file.rejectDimensions = function() { done("Image width or height too small."); };
	            }
	        });
	    }
	//Initializing the dropzone

	//Confirm delete of Section
		confirm_delete = (e) => {
			
			let id = jQuery(e).parents('.alert').attr('data-id');
			let _this = jQuery(e);

			if(id == '' || id == null || id == undefined || id == isNaN(id)) return;

			$.ajax({
		        url: gruff_section_builder.ajax_url,
		        type:'POST',
		        data: {id,'action': 'gruff_section_remove'},
		        dataType: "json",
		        success:function(response) {
					show_message(response);
					hide_alert();
					response.status == 'success' ? _this.parents('.single-row').remove() : '';
		        },
		        error: function(xhr){
					hide_alert();
		        	console.log(xhr.responseText);
		        }
		    });
		}
	//Confirm delete of Section

	//Show Validation fields
		show_validation_fields = (params) => {
			//console.log(params['elem_set'].find('.validation-fields'));
			params['elem_set'].find('.validation-fields').show();
			if(params['type'] === 1){
				params['elem_set'].find('.image-rules').show();
			}else{
				params['elem_set'].find('.image-rules').hide();
			}
		}
	//Show Validation fields

	//Hide Validation fields
		hide_validation_fields = (params) => {
			if(params === undefined){
				$('body').find('.validation-fields').hide();
			}
			params['elem_set'].find('.validation-fields').hide();
			params['elem_set'].find('.image-rules').hide();
		}
	//Hide Validation fields

})(jQuery)
