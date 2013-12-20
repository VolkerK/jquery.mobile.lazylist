/*
 * jquery.mobile.lazylist v1
 *
 * Copyright (c) 2013, Volker Krebs
 * Dual licensed under the MIT and GPL Version 2 licenses.
 * 
 */
(function($) {
    $.widget('mobile.lazylist', {
    options: {
        initSelector: ':jqmData(role=lazylist)'
    },
    _create: function() {
        //console.log('_create');
        //TODO: Better selection
        var moreBtn = $(".lazylist-morebtn");
        //TODO: Handling when no more button was found
        //console.log(moreBtn);
        moreBtn.bind("click", $.proxy(function(event) {
            //console.log(event);
            this._loadMore(event.target.href);
            //abbort and load with ajax
            return false;
        }, this));
        //apply listview plugin
	this.element.listview();
    },
    _loadMore: function(url) {
        console.log("Load more stuff with ajax form " + url);
        console.log($(this));
        //$(this).element.append('Hallo');
    }
    });

    //auto self-init widgets
    $(document).bind('pagecreate', function(event) {
	$($.mobile.lazylist.prototype.options.initSelector, event.target).lazylist();
    });

}(jQuery));