// EVENTS WHEN INPUTS ARE FILLED OUT
$(document).ready(function() {
	$('.unanswered-getter').submit(function(e){
		// prevents page from being reloaded when submitting entry in form
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();
		// calls getUnanswered function
		getUnanswered(tags);
	});
	/* -- The answers for tags -- */
	$('.inspiration-getter').submit(function(e){
		e.preventDefault();
		// empty results div
		$('.results').html('');
		// assign the value typed in by user to variable
		var tag = $(this).find("input[name='answerers']").val();
		getTopanswers(tag);
	});
});
