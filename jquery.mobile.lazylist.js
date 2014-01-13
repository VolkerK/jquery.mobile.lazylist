/*
 * jquery.mobile.lazylist v1
 *
 * Copyright (c) 2013, Volker Krebs
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * This widget applies listview and loads content from an
 * element with lazylist-morebtn class.
 * The content that is loaded needs to contain a new lazylist-morebtn element
 * for the next content that is loaded. So you need to have control over
 * the content that is loaded. The url of the loaded content is specified
 * with data-lazylist-moreurl.
 */
(function($) {
    $.widget('mobile.lazylist', {
    //instance variables
    moreButton: undefined,
    options: {
        initSelector: ':jqmData(role=lazylist)'
    },
    _create: function() {
        //console.log('_create called');
        this.apply();
        //apply listview plugin
        this.element.listview();
    },
    _loadMore: function(url) {
        var widget = this;
        //console.log("Load more stuff with ajax form " + url);
        $.ajax({
            url: url,
            dataType: 'html',
            success: function(html) {
                //console.log('done loading');
                widget._removeMoreButton();
                var content = $( html.trim() );
                widget.element.append(content);
                // Enhance the content if necessary
                if ( typeof(content.attr('data-role')) !== 'undefined' ) {
                        var pluginName = content.attr('data-role');
                        content[pluginName]();
                }
                // Enhance the children of content if necessary
                $.each(content.find('[data-role]'), function() {
                        var item = $(this)
                          , pluginName = item.attr('data-role');
                        if ( typeof item[pluginName] === 'function' ) { 
                                item[pluginName]();
                        }
                });
                //refresh needed for the just loaded content
                widget.element.listview('refresh');
                //apply this widget (more button and stuff)
                widget.apply();
            },
            error: function(jqXHR) {
                var message = "Sorry, your request could not be fullfilled.\nStatus Text:" + jqXHR.statusText + "\nStatus Code: " + jqXHR.status;
                alert( message );
            },
            beforeSend: $.proxy(widget._enableLoadingState, this)
        });
    },
    _enableLoadingState: function() {
    	this.moreButton.addClass('loading');
    },
    _removeMoreButton: function() {
        this.moreButton.parent().remove();
    },
    apply: function() {
        //console.log('apply');
        //Store morebutton as instance varaiable
        this.moreButton = this.element.find(".lazylist-morebtn");
        //enhance it like jqm would do it
        //TODO: Make this classes a property
        // this.moreButton.parent().addClass('ui-btn ui-btn-icon-right ui-icon-carat-r');
        //console.log('Found ' + this.moreButton.length + ' more buttons');
        if (this.moreButton.length >= 1) {
            //no more button, so nothintg to bind
            this.moreButton.bind("click", $.proxy(function(event) {
                var moreUrl = $(event.target).attr("data-lazylist-moreurl");
                if(typeof moreUrl === 'undefined') {
                    //if moreUrl still is undefined we try to find it in an parent object
                    //this is necessary when clicking the count element for example
                    $.each($(event.target).parentsUntil(this.element, "[data-lazylist-moreurl]"), function(index, value) {
                        //find all parents until the widgets ends, which have a data-lazylist-moreurl attribute
                        moreUrl = $(value).attr("data-lazylist-moreurl");
                    });
                }
                //console.log(moreUrl);
                if(typeof moreUrl !== 'undefined') {
                    this._loadMore(moreUrl);
                }
            }, this));
        }
    }
    });
    //auto self-init widgets
    $(document).bind('pagecreate', function(event) {
	$($.mobile.lazylist.prototype.options.initSelector, event.target).lazylist();
    });
}(jQuery));
