$(function() {
	$('#f-editButtons').live('mouseover', function() {
		if (!$(this).data('init')) {
			$(this).append($('<span class="move">move</span>'));
			$(this).data('init', true).draggable({
				handle: '.move'
			});
		}
	});
});