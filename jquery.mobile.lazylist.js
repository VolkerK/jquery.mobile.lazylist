/*
 * jquery.mobile.lazylist v1
 *
 * Copyright (c) 2013, Volker Krebs
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 * This widget applies listview and loades content from an
 * element with lazylist-morebtn class.
 * The content that is loaded needs to contain a new lazylist-morebtn element
 * for the next content that is loaded. So you need to have control over
 * the content that is loaded. The url of the loaded content is specified
 * with data-lazylist-moreurl.
 */
(function($) {
    $.widget('mobile.lazylist', {
    //instance variables
    loading: undefined,
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
                // Enhance the content
                if ( typeof(content.attr('data-role')) !== 'undefined' ) {
                    var pluginName = content.attr('data-role');
                    content[pluginName]();
                }
                //refresh needed for the just loaded content
                widget.element.listview('refresh');
                //apply this widget (more button and stuff)
                widget.apply();
            },
            error: function(jqXHR) {
                var message = "Sorry, your request could not be fullfilled.\nStatus Text:" + jqXHR.statusText + "\nStatus Code: " + jqXHR.status;
                alert( message );
            },
            beforeSend: $.proxy(widget._enableLoadingState, this),
            complete: $.proxy(widget._disableLoadingState, this)
        });
    },
    _enableLoadingState: function() {
        //console.log("loading");
        this.loading = $('<span>').addClass('lazycontent-loading');
        this.element.append(this.loading);
    },
    _disableLoadingState: function() {
        //console.log("finished loading");
        this.loading.remove();
    },
    _removeMoreButton: function() {
        //console.log('removing more button');
        this.moreButton.parent().remove();
    },
    apply: function() {
        //console.log('apply');
        //Store morebutton as instance varaiable
        this.moreButton = this.element.find(".lazylist-morebtn");
        //enhance it like jqm would do it
        //TODO: Make this classes a property
        this.moreButton.parent().addClass('ui-btn ui-btn-icon-right ui-icon-carat-r');
        //console.log('Found ' + this.moreButton.length + ' more buttons');
        if (this.moreButton.length >= 1) {
            //no more button, so nothintg to bind
            this.moreButton.bind("click", $.proxy(function(event) {
                var moreUrl = $(event.target).attr("data-lazylist-moreurl");
                //console.log(moreUrl);
                this._loadMore(moreUrl);
            }, this));
        }
    }
    });
    //auto self-init widgets
    $(document).bind('pagecreate', function(event) {
	$($.mobile.lazylist.prototype.options.initSelector, event.target).lazylist();
    });
}(jQuery));
