function fileUploader(list_target, max, maxFileSizeLimit){
	this.count = 0;
	this.id = 0;
	this.max = -1;		
	this.list_target = list_target;
	this.maxFileSizeLimit = maxFileSizeLimit;
	var size = 0;
	
	if( max ){
		this.max = max;
	};
	
	this.addElement = function( element ){
		if( element.tagName == 'INPUT' && element.type == 'file' ){
			element.name = 'file';
			element.file_uploader = this;
			element.onchange = function(){
				if(!jQuery.browser.msie){
					size = size + element.files[0].size;
				}				
				var new_element = document.createElement( 'input' );
				new_element.type = 'file';
				new_element.name = 'file';
				this.name = 'file_' + this.file_uploader.id++;				
				this.parentNode.insertBefore( new_element, this );
				this.file_uploader.addElement( new_element );
				this.file_uploader.addListRow( this );
				this.style.position = 'absolute';
				this.style.left = '-1000px';
				styleFileButton();
			};
			if(!jQuery.browser.msie) {
				if(size > this.maxFileSizeLimit){
					element.disabled = true;
					document.getElementById('attachment_errors').style.display = "block";
					document.getElementById('over50mb').style.display = "block";
					document.getElementById('form_submit').disabled = true;
				}
			};
			if( this.max != -1 && this.count >= this.max ){
				element.disabled = true;
				document.getElementById('attachment_errors').style.display = "block";
				document.getElementById('over20files').style.display = "block";
				document.getElementById('form_submit').disabled = true;
			};
			document.getElementById( 'fileStatus' ).innerHTML = this.count + ' files added';
			this.count++;
			this.current_element = element;
		} 
	};

	this.addListRow = function( element ){
		var new_row = document.createElement( 'div' );
		new_row.setAttribute("class", "fileRow");		
		var new_row_button = document.createElement( 'input' );
		new_row_button.type = 'button';
		new_row_button.value = 'X';		
		new_row.element = element;
		new_row_button.onclick= function(){
			this.parentNode.element.parentNode.removeChild( this.parentNode.element );
			this.parentNode.parentNode.removeChild( this.parentNode );
			this.parentNode.element.file_uploader.count--;
			if(jQuery.browser.msie){
				if(this.parentNode.element.file_uploader.count <= this.parentNode.element.file_uploader.max){
					this.parentNode.element.file_uploader.current_element.disabled = false;
					document.getElementById('form_submit').disabled = false;
					document.getElementById('attachment_errors').style.display = "none";
					document.getElementById('over20files').style.display = "none";
				}
			} else {	
				size = size - this.parentNode.element.files[0].size;			
				if(size < this.parentNode.element.file_uploader.maxFileSizeLimit && this.parentNode.element.file_uploader.count <= this.parentNode.element.file_uploader.max){	
					this.parentNode.element.file_uploader.current_element.disabled = false;				
					document.getElementById('form_submit').disabled = false;	
					document.getElementById('attachment_errors').style.display = "none";
					document.getElementById('over20files').style.display = "none";		
					document.getElementById('over50mb').style.display = "none";					
				}
			}			
			document.getElementById( 'fileStatus' ).innerHTML = this.parentNode.element.file_uploader.count - 1 + ' files added';
			return false;
		};		
		new_row.innerHTML = element.value.split('\\').pop()+'<br>';	
		new_row.appendChild( new_row_button );
		this.list_target.appendChild( new_row );		
		
	};
	
};

(function($) {
    
    $.fn.filestyle = function(options) {
        var settings = {
            width : 250,
            width: 88,
            height: 28,
            tabIndex: false
        };
                
        if(options) {
            $.extend(settings, options);
        };
                        
        return this.each(function() {
            
            var self = this;
            input = $(this);

            var outerWrapper = $("<div>").addClass('filestyle');
            
            var button = $("<div>").css({
            	"position": "relative"
            }).addClass('fileButton');
            
            button.css({
            		"width": settings.width + "px",
                    "height": settings.height + "px",
                    "background": "url(" + settings.image + ") 0 0 no-repeat",
                    "background-position": "left top",
                    "display": "inline",
                    "position": "absolute",
                    "overflow": "hidden"
            });

            if (settings.tabIndex != false) {
                button.attr('tabIndex', settings.tabIndex)   
            }

            var filename = $('<input class="file" READONLY/>')
                             .addClass($(self).attr("class"))
                             .attr('tabIndex', 999)
                             .css({
                                 "display": "inline",
                             }).addClass('fileName');

			$(self).wrap(outerWrapper);
			$(self).wrap(button);
			$(self).parent().parent().prepend(filename);

            $(self).css({
                        "position": "absolute",
                        "top": 0,
                        "left": 0,
                        "height": settings.height + "px",
                        "width": settings.width + "px",
                        "display": "inline",
                        "cursor": "pointer",
                        "opacity": "0.0"
                    });

            if ($.browser.mozilla) {
                if (/Win/.test(navigator.platform)) {
                    $(self).css("margin-left", "-115px");                    
                } else {
                    $(self).css("margin-left", "-168px");                    
                };
            } else {
                $(self).css("margin-left", settings.imagewidth - settings.width + "px");                
            };

            $(self).bind("change", function() {
            	v = $(self).val();
            	if (v.indexOf('C:\\fakepath\\') == 0)
            		v = v.substring(12);
                filename.val(v);
            });
        });
    };
    
})(jQuery);
	
function styleFileButton(){
	jQuery("input[type=file][name=file]").filestyle({ 
		image: formURL+"/images/btn_drkBlu90x22add.gif",
		imageheight : 22,
		imagewidth : 62,
		height:22,
		width : 100
	});
}
